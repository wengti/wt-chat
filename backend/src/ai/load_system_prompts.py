def load_playful_prompts() -> str:
    with open("src/ai/prompts/playful_prompts.md", "r") as f:
        return f.read()


def load_serious_prompts() -> str:
    with open("src/ai/prompts/serious_prompts.md", "r") as f:
        return f.read()


def load_title_generation_prompts() -> str:
    with open("src/ai/prompts/title_generation_prompts.md") as f:
        return f.read()
