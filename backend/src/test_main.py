import importlib
import os
from typing import Literal

from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from fastapi.testclient import TestClient
import pytest
import main
from main import app
from src.types import HistoryEntry, RootResponse

# ---------------------------------------------------------------
# Initializing
# ---------------------------------------------------------------
load_dotenv()
client = TestClient(app)


# ---------------------------------------------------------------
# TEST CASE: CORS Testing
# ---------------------------------------------------------------
allowed_origin = os.getenv("FRONT_END_URL", "")
disallowed_origin = "https://random.com"


# Note: CORS is enforced by the browser. The server will add CORS into headers but will not execute the policy.
# Therefore, we can only check if CORS policy are included in the headers.
@pytest.mark.parametrize(
    ("is_allowed", "origin"),
    [
        (True, allowed_origin),
        (False, disallowed_origin),
    ],
)
def test_cors_returns_headers_from_various_origin(is_allowed: bool, origin: str):
    response = client.get(
        "/",
        headers={
            "Origin": origin,
        },
    )
    if is_allowed:
        assert (
            "access-control-allow-origin" in response.headers
        ), f"{origin} is allowed to access the server resource. It should contain CORS in the returned headers in the response."
    else:
        assert (
            "access-control-allow-origin" not in response.headers
        ), f"{origin} is not allowed to access the server resource due to CORS. It should not contain CORS in the returned headers in the response."


# We can also check if options attempt is successful or not.
@pytest.mark.parametrize(
    ("is_allowed", "origin"),
    [
        (True, allowed_origin),
        (False, disallowed_origin),
    ],
)
def test_cors_preflight_from_various_origin(is_allowed: bool, origin: str):
    response = client.options(
        "/",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    if is_allowed:
        assert (
            response.status_code == 200
        ), f"{origin} should be allowed to access the server resource, expecting a successful option request."
    else:
        assert (
            response.status_code == 400
        ), f"{origin} should not be allowed to access the server resource, expecting a failed option request."


# ---------------------------------------------------------------
# TEST CASE: GET at /
# ---------------------------------------------------------------
def test_root_get():
    response = client.get("/")
    assert response.status_code == 200
    assert RootResponse(status=response.json()["status"]) == RootResponse()


# ---------------------------------------------------------------
# TEST CASE: POST at /chat
# ---------------------------------------------------------------
history_normal = [
    HistoryEntry(role="user", message="Hi"),
    HistoryEntry(role="model", message="Hi"),
]


# Test if the route is returning the expected data type
@pytest.mark.parametrize(
    ("user_prompt", "model_name", "expected_code", "should_check_return"),
    [
        ("Hi", "gemini", 200, True),  # HIT THE API
        ("Hi", "gpt", 200, True),  # HIT THE API
        ("", "gemini", 400, False),  # Provide empty input_prompt to gemini
        ("", "gpt", 400, False),  # Provide empty input_prompt to gpt
        ("Hi", "not_gemini_or_gpt", 422, False),  # Non valid model name
        # /title's type - AiTitleRequest actually first proof read the type of input, which is limited to "gemini" or "gpt" -> will return 422 instead of 500
    ],
)
def test_chat_post(
    user_prompt: str,
    model_name: str,
    expected_code: int,
    should_check_return: bool,
):
    response = client.post(
        "/chat",
        json={
            "user_prompt": user_prompt,
            "history": history_normal,
            "is_serious": True,
            "model_name": model_name,
        },
    )

    assert (
        response.status_code == expected_code
    ), f"Using Prompt: {user_prompt} at /chat with {model_name} should return a response code of {expected_code}."
    if should_check_return:
        assert (
            len(response.content) > 0
        ), f"Using Prompt: {user_prompt} at /chat with {model_name} should generate iterable and non-empty content."


# Test if the system prompt is load correctly
@pytest.mark.parametrize(
    ("is_serious"),
    [
        (True),
        (False),
    ],
)
def test_load_system_prompt(mocker, is_serious: bool):

    mocker_serious = mocker.patch(
        "main.load_serious_prompts", return_value="Serious system prompts"
    )
    mocker_playful = mocker.patch(
        "main.load_playful_prompts", return_value="Playful system prompts"
    )
    mocker.patch("main.GeminiModel")  # to prevent api call

    response = client.post(
        "/chat",
        json={
            "user_prompt": "Hi",
            "history": history_normal,
            "is_serious": is_serious,
            "model_name": "gemini",
        },
    )

    if is_serious:
        mocker_serious.assert_called_once()  # Call load_serious_prompt
        mocker_playful.assert_not_called()  # Not call load_playful_prompt
    else:
        mocker_playful.assert_called_once()
        mocker_serious.assert_not_called()


# ---------------------------------------------------------------
#  TEST CASE: POST at /title
# ---------------------------------------------------------------
# Test if the route is returning the expected data type
@pytest.mark.parametrize(
    ("prompt", "model_name", "expected_code", "should_check_return"),
    [
        ("Hi", "gemini", 200, True),  # HIT THE API
        ("Hi", "gpt", 200, True),  # HIT THE API
        ("", "gemini", 400, False),  # Provide empty input_prompt to gemini
        ("", "gpt", 400, False),  # Provide empty input_prompt to gpt
        ("Hi", "not_gemini_or_gpt", 422, False),  # Non valid model name
        # /title's type - AiTitleRequest actually first proof read the type of input, which is limited to "gemini" or "gpt" -> will return 422 instead of 500
    ],
)
def test_title_post_with_various_prompt_and_model_name(
    prompt: str,
    model_name: Literal["gpt", "gemini"],
    expected_code: int,
    should_check_return: bool,
):
    response = client.post(
        "/title",
        json={"prompt": prompt, "model_name": model_name},
    )

    assert (
        response.status_code == expected_code
    ), f"Using Prompt: {prompt} at /title with {model_name} should return a response code of {expected_code}."

    if should_check_return:
        assert (
            type(response.json()["title"]) == str
        ), f"Using Prompt: {prompt} at /title with {model_name} should return a response that contains title in its body."
