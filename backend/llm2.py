from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import time
import os
from PyPDF2 import PdfReader


start_time = time.time()
checkpoint = "meta-llama/Llama-3.2-1B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(checkpoint)  # You may want to use bfloat16 and/or move to GPU here
UPLOAD_DIR = "pdf_uploads"
file_loc = os.path.join(UPLOAD_DIR, "main2.pdf")
reader = PdfReader(file_loc)
total_summary = ""
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
for page in reader.pages:
    summary = summarizer(page.extract_text(), max_length=30, min_length=20, do_sample=False)
    summary = summary[0]['summary_text']
    total_summary += (summary + "\n")
# print(summary[0]['summary_text'])
'''
        You are hosting a podcast with a guest (none of you are Doctors or Dr. or Dr). Make sure to have a name. 
                        Don't USE ANY abbreviations and make sure to have proper grammar (just say Doctor not Dr.) - this is a script.
                        The topic of discussion is Strassen’s algorithm for matrix multiplication, 
                        its historical significance, and its implications for computational efficiency. 
                        The host is curious and asks engaging questions, while the guest is knowledgeable, 
                        breaking down the complex ideas into simpler terms. Make the dialogue 
                        conversational, approachable, and slightly humorous to keep it engaging. 
                        Don't get off topic and make sure to end on a concluding statement. Be mathmatically accurate.
'''
print("SUMMARY", total_summary)
messages = [
    {
        "role": "podcaster1",
        "content": f"""
            You are the host of a podcast with a guest, but make sure to have a name to identify yourself. 
            Don't USE ANY abbreviations and make sure to have proper grammar.
            Use this summary to build some context of the conversation. The topic of discussion has something 
            to do with '{summary}'. The host is curious and asks engaging questions, while the guest is knowledgeable.
            Make sure you are factually correct and combine your knowledge base along 
            with the topic provided to build the conversation. Make sure to go deep into the topic and be technical
            Don't get off topic and make sure to end on a concluding statement. Do not repeat yourself!
            """,
    },
    {
        "role": "podcaster2", 
        "content": f"""
            You are the guest of a podcast with a host, but make sure to have a name to identify yourself. 
            Don't USE ANY abbreviations and make sure to have proper grammar.
            Use this summary to build some context of the conversation. The topic of discussion has something 
            to do with '{summary}'. The host is curious and asks engaging questions, while the guest is knowledgeable.
            Make sure you are factually correct and combine your knowledge base along 
            with the topic provided to build the conversation. Make sure to go deep into the topic and be technical
            Don't get off topic and make sure to end on a concluding statement. Do not repeat yourself!
        """
    },
]

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

max_length = 1250
end_token_id = tokenizer.encode('.', add_special_tokens=False)[0]

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
    min_length=max_length - 150,  # Ensure a minimum length before considering stopping
    pad_token_id=tokenizer.pad_token_id,
    eos_token_id=end_token_id,
    no_repeat_ngram_size=2,
) 
print(tokenizer.decode(outputs[0]))
end_time = time.time()
execution_time = end_time - start_time
print(f"Execution time: {execution_time} seconds")