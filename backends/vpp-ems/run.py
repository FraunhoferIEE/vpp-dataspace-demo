from app import create_app
from app.config import get_config
import logging

config = get_config()
logging.basicConfig(level=config.LOG_LEVEL, format="[%(levelname)s] %(message)s")
app = create_app(config)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=config.PORT)
