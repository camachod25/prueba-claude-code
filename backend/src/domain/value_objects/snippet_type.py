from enum import Enum


class SnippetType(str, Enum):
    PROMPT = "prompt"
    CODE = "code"
    TEXT = "text"
