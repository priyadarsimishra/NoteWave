import boto3

def text_to_speech(text, output_audio_file):

    speechT = '''
        <|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023
Today Date: 26 Jan 2025

<|eot_id|><|start_header_id|>podcaster1<|end_header_id|>

You are the host of a podcast with a guest, but make sure to have a name to identify yourself. 
            Don't USE ANY abbreviations and make sure to have proper grammar.
            Use this summary to build some context of the conversation. The topic of discussion has something 
            to do with 'In this example, the compiler pads the end of the class to a multiple of sizeof'. The host is curious and asks engaging questions, while the guest is knowledgeable.
            Make sure you are factually correct and combine your knowledge base along 
            with the topic provided to build the conversation. Make sure to go deep into the topic and be technical
            Don't get off topic and make sure to end on a concluding statement.<|eot_id|><|start_header_id|>podcaster2<|end_header_id|>

You are the guest of a podcast with a host, but make sure to have a name to identify yourself. 
            Don't USE ANY abbreviations and make sure to have proper grammar.
            Use this summary to build some context of the conversation. The topic of discussion has something 
            to do with 'In this example, the compiler pads the end of the class to a multiple of sizeof'. The host is curious and asks engaging questions, while the guest is knowledgeable.
            Make sure you are factually correct and combine your knowledge base along 
            with the topic provided to build the conversation. Make sure to go deep into the topic and be technical
            Don't get off topic and make sure to end on a concluding statement.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Host: Welcome to "The Code Conundrum", a podcast where we dive into the intricacies of computer science and programming languages.

Guest: Thank you for having me, it's a pleasure to be here.

Host: Today, we're going to tackle a question that has puzzled many a programmer: what happens when we try to pad the end of a class with a multiple of the size of the object it contains?

Guest: Ah, yes, that's a great question, and it's a topic that gets to the heart of how memory is allocated in C++.

Host: Exactly! So, let's dive in and explore this topic further.

Guest: In C++, when we define a class, it's not just a collection of variables, it's a namespace that contains a set of member variables and functions.

Host: That's right! And when we try to access a member variable outside of the class, the compiler doesn't know where to find it.

Guest: That's where the concept of padding comes in.

Host: Padding, in this context, refers to the process of adding a certain amount of memory to the class to ensure that the data it contains fits within a specific boundary.

Guest: Exactly! When we define a class with a member variable, the compiler allocates a certain amount of memory for that variable.

Host: But what happens when we try to access the member variable outside of the class? The compiler doesn't know where to find it, so it adds padding to the end of the class to make room for the variable.

Guest: That's correct! The amount of padding added is typically equal to the size of the object it contains.

Host: So, to illustrate this concept, let's consider an example.

Guest: Sure, let's say we have a class called `Point` with a member variable `x` of type `int`.

Host: Great example! And let's say we want to pad the end of the `Point` class to a multiple of 4 bytes.

Guest: That's a good example, because the `x` variable typically takes up 4 bytes on a 32-bit system.

Host: Okay, so if we pad the `Point` class to a multiple of 4 bytes, what happens to the `x` variable?

Guest: Well, the compiler adds padding to the end of the class, which effectively increases the size of the class by 4 bytes.

Host: That's right! So, in this case, the `x` variable is effectively shifted to the right by 4 bytes, which means it's no longer accessible outside of the class.

Guest: Exactly! This is why padding is necessary when working with classes that contain objects of different sizes.

Host: I see what you mean! So, to summarize, when we pad the end of a class with a multiple of the size of the object it contains, we're essentially increasing the size of the class by that amount.

Guest: That's correct! And this is why padding is an important concept to understand when working with C++.

Host: Thank you for your insightful explanation, guest! It's clear that you have a deep understanding of this topic.

Guest: Thank you, it was a pleasure to share my knowledge with your listeners.

Host: Well, I'm sure our listeners will find this explanation helpful in their own programming endeavors.

Guest: Absolutely, I'm glad I could help.

Host: And that's all for today's episode of "The Code Conundrum". If you have any questions or topics you'd like to discuss, please don't hesitate to reach out.

Guest: Thank you for having me, it was a pleasure.

Host: Thank you to our sponsor, "Code Complete", for supporting our podcast.

Guest: Thank you to "Code Complete" for supporting our podcast.

Host: And that's a wrap! Join us next time for another episode of "The Code Conundrum".<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Host: Welcome back to "The Code Conundrum", a podcast where we dive into the intricacies of computer science and programming languages.

Guest: Thank you for having me, it's a pleasure to be here.

Host: Today, we're going to tackle a question that has puzzled many a programmer: what happens when we try to pad the end of a class with a multiple of the size of the object it contains?

Guest: Ah, yes, that's a great question, and it's a topic that gets to the heart of how memory is allocated in C++.

Host: Exactly! So, let's dive in and explore this topic further.

Guest: In C++, when we define a class, it's not just a collection of variables, it's a namespace that contains a set of member variables and functions.

Host: That's right! And when we try to access a member variable outside of the class, the compiler doesn't know where to find it.

Guest: That's where the concept of padding comes in.

Host: Padding, in this context, refers to the process of adding a certain amount of memory to the class to ensure that the data it contains fits within a specific boundary.

Guest: Exactly! When we define a class with a member variable, the compiler allocates a certain amount of memory for that variable.

Host: But what happens when we try to access the member variable outside of the class? The compiler doesn't know where to find it, so it adds padding to the end of the class to make room for the variable.

Guest: That's correct! The amount of padding added is typically equal to the size of the object it contains.

Host: So, to illustrate this concept, let's consider an example
    '''

    speechT = speechT.split("\n")
    speechT = [line.strip() for line in speechT if line.strip() != ""]
    speechT = speechT[3:]
    ind = 0
    for line in speechT:
        if line.find(":") != -1:
            ind = speechT.index(line)
            break
    speechT = speechT[ind:]
    print(speechT)
    # Create a Polly client
    polly = boto3.client('polly')

    try:
        # Use Polly to synthesize speech
        for idx, line in enumerate(speechT):
            line = line[line.find(":")+1:].strip()
            v_id = "Danielle" if idx % 2 == 0 else "Matthew"
            response = polly.synthesize_speech(
                Text=line,
                OutputFormat='mp3',  # You can use 'ogg_vorbis' or 'pcm' too
                VoiceId=v_id, # Choose from available Polly voices
                Engine='neural'
            )
            if "AudioStream" in response:
                with open(output_audio_file, 'ab') as audio_file:
                    audio_file.write(response['AudioStream'].read())
    except Exception as e:
        print(f"An error occurred: {e}")


# # Example usage
text = "Welcome to our AI-generated podcast. This is an example of AWS Polly in action."
output_audio_file = "output.mp3"
text_to_speech(text, output_audio_file)
