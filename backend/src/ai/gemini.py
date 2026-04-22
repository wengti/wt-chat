from src.ai.base import AiModel
from google import genai
from google.genai import types

from src.types import HistoryEntry


class GeminiModel(AiModel):
    def __init__(self, system_prompt: str, model_name: str):
        super().__init__()
        self.client = genai.Client()
        self.system_prompt = system_prompt
        self.model_name = model_name

    def chat(self, history: list[HistoryEntry], user_prompt: str) -> str:

        history_list: list[types.ContentOrDict] = [
            types.Content(role=entry["role"], parts=[types.Part(text=entry["message"])])
            for entry in history
        ]
        chat = self.client.chats.create(
            model=self.model_name,
            history=history_list,
            config=types.GenerateContentConfig(system_instruction=self.system_prompt),
        )
        response = chat.send_message(message=user_prompt)
        if response.text is None:
            return "I am currently facing an issue in generating a response. Please try again later."
        return response.text
