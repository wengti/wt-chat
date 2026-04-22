def load_playful_prompts() -> str:
    with open("src/ai/prompts/playful_prompts.md", "r") as f:
        return f.read()


def load_serious_prompts() -> str:
    with open("src/ai/prompts/serious_prompts.md", "r") as f:
        return f.read()
