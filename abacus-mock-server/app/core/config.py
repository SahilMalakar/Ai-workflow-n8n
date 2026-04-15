from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool = False

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DATABASE_URL: str

    API_VERSION: str
    API_BASE_PATH: str

    ABACUS_CLIENT_ID: str
    ABACUS_CLIENT_SECRET: str
    ABACUS_MOCK_TOKEN: str

    TOKEN_EXPIRY_SECONDS: int

    INSTANCE_URL: str

    ALLOWED_ORIGINS: List[str]

    @property
    def api_base_path(self):
        return self.API_BASE_PATH

    @property
    def token_endpoint_url(self):
        return f"{self.INSTANCE_URL}/oauth/token"

    class Config:
        env_file = ".env"


settings = Settings()