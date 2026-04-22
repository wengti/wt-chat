from typing import Generator

from openai import OpenAI
from src.ai.base import AiModel
from src.ai.load_system_prompts import load_title_generation_prompts
from src.types import HistoryEntry
from openai.types.responses import EasyInputMessageParam, ResponseInputItemParam


class GPTModel(AiModel):
    def __init__(self, model_name: str, system_prompt: str):
        super().__init__()
        self.client = OpenAI()
        self.model_name = model_name
        self.system_prompt = system_prompt

    def generate_title(self, user_prompt: str) -> str:
        response = self.client.responses.create(
            model=self.model_name,
            input=user_prompt,
            instructions=load_title_generation_prompts(),
        )
        return response.output_text

    def chat(self, history: list[HistoryEntry], user_prompt: str) -> Generator[str]:

        messages: list[ResponseInputItemParam] = [
            EasyInputMessageParam(
                role="user" if entry["role"] == "user" else "assistant",
                content=entry["message"],
            )
            for entry in history
        ]

        messages.append(EasyInputMessageParam(role="user", content=user_prompt))

        response = self.client.responses.create(
            model=self.model_name,
            instructions=self.system_prompt,
            input=messages,
            stream=True,
        )

        for event in response:
            if event.type == "response.output_text.delta":
                yield event.delta
