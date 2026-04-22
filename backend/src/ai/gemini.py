from typing import Generator, Iterator

from src.ai.base import AiModel
from google import genai
from google.genai import types

from src.ai.load_system_prompts import load_title_generation_prompts
from src.types import HistoryEntry


class GeminiModel(AiModel):
    def __init__(self, system_prompt: str, model_name: str):
        super().__init__()
        self.client = genai.Client()
        self.system_prompt = system_prompt
        self.model_name = model_name

    def generate_title(self, user_prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model_name,
            config=types.GenerateContentConfig(
                system_instruction=load_title_generation_prompts()
            ),
            contents=user_prompt,
        )
        if response.text is None:
            return "Untitled conversation"
        return response.text

    def chat(self, history: list[HistoryEntry], user_prompt: str) -> Generator[str]:

        history_list: list[types.ContentOrDict] = [
            types.Content(role=entry["role"], parts=[types.Part(text=entry["message"])])
            for entry in history
        ]
        chat = self.client.chats.create(
            model=self.model_name,
            history=history_list,
            config=types.GenerateContentConfig(system_instruction=self.system_prompt),
        )
        response = chat.send_message_stream(message=user_prompt)
        for chunk in response:
            text = chunk.text
            if text is not None:
                yield text
