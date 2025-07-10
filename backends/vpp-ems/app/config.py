import os
from typing import Optional


class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://root:secret1234@localhost:27017/dspace_db?authSource=admin")
    PORT = int(os.getenv("PORT", 5001))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
    PULL_INTERVAL_SECONDS = int(os.getenv("PULL_INTERVAL_SECONDS", 10))
    HTTP_TIMEOUT_SECONDS = int(os.getenv("HTTP_TIMEOUT_SECONDS", 5))


def get_config() -> Optional[Config]:
    """Retrieves configuration from environment variables.

    Returns:
        A Config object or None if environment variables are not set.
    """
    try:
        return Config()
    except ValueError:
        # Handle cases where environment variables might not be integers (PORT)
        print("Error reading configuration from environment variables.")
        return None
