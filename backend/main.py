from typing import Union

from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from botocore.exceptions import NoCredentialsError
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil 
import json
from PyPDF2 import PdfReader
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import time
import os
import boto3

app = FastAPI()
UPLOAD_DIR = "pdf_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def save_audio_to_s3(bucket_name, audio_file, s3_key):
    s3_client = boto3.client("s3")
    try:
        s3_client.upload_file(audio_file, bucket_name, s3_key)
        print(f"File uploaded to S3: s3://{bucket_name}/{s3_key}")

        response = s3_client.head_object(Bucket=bucket_name, Key=s3_key)
        
        print("File Metadata:")
        print(f"ETag: {response.get('ETag')}")
        print(f"Last Modified: {response.get('LastModified')}")
        print(f"File Size: {response.get('ContentLength')} bytes")
        
        object_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
        print(f"File URL: {object_url}")
        last_modified_str = response.get('LastModified').isoformat()

        
        # Return relevant data to the frontend
        return {
            "s3_url": object_url,
            "bucket_name": bucket_name,
            "s3_key": s3_key,
            "etag": response.get('ETag'),
            "last_modified": last_modified_str,
            "content_length": response.get('ContentLength')
        }
    except NoCredentialsError:
        print("Credentials not available.")
    except Exception as e:
        print(f"An error occurred: {e}")
    

def speech_to_text(speechT, output_audio_file):
    speechT = speechT.split("\n")
    speechT = [line.strip() for line in speechT if line.strip() != ""]
    speechT = speechT[3:]
    ind = 0
    for line in speechT:
        if line.find(":") != -1:
            ind = speechT.index(line)
            break
    speechT = speechT[ind:]
    speechT = [line[line.find(":")+2:].strip() for line in speechT]
    speechT = "\n".join(speechT)
    speechT.replace("<|end_header_id|>", "")
    speechT.replace("<|start_header_id|>", "")
    speechT.replace("<|eot_id|>", "")
    speechT = speechT.split("\n")
    # for i in range(len(speechT)):
    #     if speechT[i].find("<|end_header_id|>") != -1:
    #         speechT[i] = speechT[i].replace("<|end_header_id|>", "")
    #     elif speechT[i].find("<|start_header_id|>") != -1:
    #         speechT[i] = speechT[i].replace("<|start_header_id|>", "")
    #     elif speechT[i].find("<|eot_id|>") != -1:
    #         speechT[i] = speechT[i].replace("<|eot_id|>", "")
    # for line in speechT:
    #     line = line[line.find(":")+2:] # need to parse out <|end_header_id|>, <|start_header_id|>, <|eot_id|>
    print("PARSING", speechT)
    # Create a Polly client
    polly = boto3.client('polly')

    try:
        # Use Polly to synthesize speech
        for idx, line in enumerate(speechT):
            v_id = "Danielle" if idx % 2 == 0 else "Matthew"
            response = polly.synthesize_speech(
                Text=line,
                OutputFormat='mp3',  # You can use 'ogg_vorbis' or 'pcm' too
                VoiceId=v_id,  # Choose from available Polly voices
                Engine="neural"
            )
            if "AudioStream" in response:
                with open(output_audio_file, 'ab') as audio_file:
                    audio_file.write(response['AudioStream'].read())
        
        return speechT
    except Exception as e:
        print(f"An error occurred: {e}")


def get_podcast_script(summary):
    checkpoint = "meta-llama/Llama-3.2-1B-Instruct"
    tokenizer = AutoTokenizer.from_pretrained(checkpoint)
    model = AutoModelForCausalLM.from_pretrained(checkpoint) 
    messages = [
        {
            "role": "podcaster1",
            "content": f"""
                You are the host of a podcast with a guest, but make sure to have a name to identify yourself. 
                Use this summary to build some context of the conversation. The topic of discussion has something 
                to do with '{summary}'. The host is curious and asks engaging questions, while the guest is knowledgeable.
                Make sure to go deep into the topic and be technical. End with a concluding statement.
                """,
        },
        {
            "role": "podcaster2", 
            "content": f"""
                You are the guest of a podcast with a host, but make sure to have a name to identify yourself. 
                Use this summary to build some context of the conversation. The topic of discussion has something 
                to do with '{summary}'. The host is curious and asks engaging questions, while the guest is knowledgeable.
                Make sure to go deep into the topic and be technical. End with a concluding statement.
            """
        },
    ]

    max_length = 512
    end_token_id = tokenizer.encode('.', add_special_tokens=False)[0]
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    tokenized_chat = tokenizer.apply_chat_template(
        messages, 
        tokenize=True, 
        add_generation_prompt=True,
        return_tensors="pt",
        padding=True,  # Enable padding
        truncation=True,  # Truncate to max length
        add_special_tokens=False,  # Do not add special tokens
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=end_token_id,
    )

    outputs = model.generate(
        tokenized_chat, 
        max_length=max_length,  # Generate up to this limit
        min_length=max_length - 200,  # Ensure a minimum length before considering stopping
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=end_token_id,
        no_repeat_ngram_size=2,
    ) 
    return tokenizer.decode(outputs[0])

@app.post("/upload-file")
def upload_file(file: UploadFile = File(...)):
    try:
        file_loc = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_loc, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        reader = PdfReader(file_loc)
        print("FILE LOCA:", file_loc)

        total_summary = ""
        summarizer = pipeline("summarization", model="google/pegasus-xsum")
        for page in reader.pages:
            summary = summarizer(page.extract_text(), max_length=12, min_length=8, do_sample=True)
            summary = summary[0]['summary_text']
            total_summary += (summary + "\n")

        podcast_script = get_podcast_script(total_summary)
        print("SCRIPT:", podcast_script)
        parsed_out = speech_to_text(podcast_script, f"../frontend/public/output-{file.filename}.mp3")
        res = save_audio_to_s3("podcastaudio123", f"../frontend/public/output-{file.filename}.mp3", f"podcastaudio123/output-{file.filename}.mp3")
        s3_client = boto3.client("s3")
        print("RESPONSE:", res)
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": "podcastaudio123", "Key": f"podcastaudio123/output-{file.filename}.mp3"},
            ExpiresIn=10000,
        )
        print(url)
        parsed = ""
        for line in parsed_out:
            parsed += line + "\n"
        parsed = parsed.strip()
        return Response(status_code=200, content=json.dumps({"url": url, "loc": f"../frontend/public/output-{file.filename}.mp3", "transcript": parsed}))
    except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def read_root():
    return {"Hello": "World"}