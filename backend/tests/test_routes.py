import sys
import types
import os

# Insert backend directory into path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Provide a fake openai module to avoid dependency
fake_openai = types.ModuleType('openai')

class _FakeCompletions:
    def create(self, model=None, messages=None):
        content = 'analysis result' if 'vision' in model else 'style guide'
        class _Res:
            choices = [type('Choice', (), {'message': type('Msg', (), {'content': content})()})]
        return _Res()

class _FakeChat:
    def __init__(self):
        self.completions = _FakeCompletions()

class FakeOpenAI:
    def __init__(self, api_key=None):
        self.chat = _FakeChat()

fake_openai.OpenAI = FakeOpenAI
sys.modules['openai'] = fake_openai

import pytest
fastapi = pytest.importorskip('fastapi')
from fastapi.testclient import TestClient

import main
import routes

client = TestClient(main.app)


def test_analyze_validation_error():
    resp = client.post('/analyze')
    assert resp.status_code == 422


def test_analyze_success(monkeypatch):
    # stub network calls
    monkeypatch.setattr(routes.requests, 'post', lambda *a, **k: type('R', (), {'status_code':200})())

    files = {'file': ('test.jpg', b'123', 'image/jpeg')}
    data = {'quiz_answers': '{}', 'user_id': 'u1', 'photo_filename': 'test.jpg'}
    resp = client.post('/analyze', files=files, data=data)
    assert resp.status_code == 200
    assert resp.json() == {'analysis': 'analysis result', 'style': 'style guide'}


