from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import time

# Load the tokenizer and model
model_name = "meta-llama/Llama-3.2-1B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Check if pad_token is defined. If not, set it to eos_token.
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Set pad token to eos token

# Define your prompt
prompt = '''
    Write a dialogue script between two people conducting a podcast on the topic of artificial intelligence.
    Make sure to distinguish who is speaking at time based by providing names before their texts like 
    Speaker 1 says ____ and Speaker 2 says ___. The dialogue should be engaging and informative. Make sure
    to end on a concluding statement
'''

# Tokenize the input prompt
input_ids = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True).input_ids

# Define maximum length for the text
max_length = 500  # Generate up to this many tokens
end_token_id = tokenizer.encode('.', add_special_tokens=False)[0]  # Token ID for the period

# Generate text
start_time = time.time()

output = model.generate(
    input_ids,
    max_length=max_length,  # Generate up to this limit
    min_length=max_length - 150,  # Ensure a minimum length before considering stopping
    num_return_sequences=1,
    no_repeat_ngram_size=2,  # Prevent repetitive phrases
    temperature=0.5,  # Adjust creativity
    pad_token_id=tokenizer.pad_token_id,
    eos_token_id=end_token_id,  # Prefer to stop at a period
)

# Decode the generated text
generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

# Print the generated text
print("Generated Text: ")
print(generated_text)
end_time = time.time()

execution_time = end_time - start_time
print(f"Execution time: {execution_time} seconds")