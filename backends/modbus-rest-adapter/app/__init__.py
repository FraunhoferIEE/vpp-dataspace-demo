from flask import Flask
from flasgger import Swagger
from flask_cors import CORS

template = {
    "swagger": "2.0",
    "info": {
        "title": "Modbus REST Adapter",
        "description": "A REST API to interact with the Modbus TCP Simulator",
        "version": "0.0.1"
    },
}


def create_app():
    app = Flask(__name__)
    CORS(app)
    Swagger(app, template=template)
    with app.app_context():
        from . import routes
    return app
