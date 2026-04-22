from abc import ABC, abstractmethod

from src.types import HistoryEntry


class AiModel(ABC):

    @abstractmethod
    def chat(self, history: list[HistoryEntry], user_prompt: str) -> str:
        """Send user_prompt and in return, receiving the ai model's feedback"""
        pass

    @abstractmethod
    def generate_title(self, user_prompt: str) -> str:
        """Send user_prompt and in return, receiving a short title describing the topic of conversation"""
        pass
