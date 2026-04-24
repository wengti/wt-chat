
# wt-chat
A simple chat interface for user to interact with 2 different LLM endpoints. This app has the following features:
    - Authentication and Authorization
    - Chat with Gemini (`gemini-3-flash-preview`) or GPT (`gpt-5.4-nano`)
    - Get a response in playful or serious manner.
    - Generation of title for each conversation.
    - Receiving response in chunks via Streaming.

This application also serves as a simple project for the learning of
    - **FastAPI** with the learning outcome:
        * https://github.com/wengti/fast-api-tutorial
        * https://github.com/wengti/fast-api-ai-endpoint-tutorial
    - **pytest** with the learning outcome:
        * https://github.com/wengti/pytest-tutorial
    - **docker**
        * https://github.com/wengti/docker-tutorial


## Get Started
* Demo Video: https://youtu.be/mA2SR8Omy-s
* Deployed Site: https://wt-chat.vercel.app

* Remarks:
    -  First request to the FastAPI endpoint may be slow as it is deployed on render (free tier), which will take a minute or so to be activated.
    - Although the AI’s response is being streamed on the backend, render has a buffer that stores all the responses before returning it. 

![Login page](demo/1.png)
![Home page](demo/2.png)
![Conversation page](demo/3.png)

## Technical Takeaways




