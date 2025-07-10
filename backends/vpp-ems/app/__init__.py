from flask import Flask
from flask_apscheduler import APScheduler
from flask_apscheduler.utils import IntervalTrigger
from flask_cors import CORS

from mongoengine import connect
import logging

from app.config import get_config
from .models import Facility
from .services import FacilityService
from .repositories import FacilityRepository
from .tasks import pull_values_from_all_facilities, print_time


def create_app(_config):
    # Initialize the repository and service
    connect(host=_config.MONGODB_URI)

    # Initialize Flask application
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(_config)

    # Initialize repository and service
    facility_service = FacilityService()

    # Initialize Flask-APScheduler
    scheduler = APScheduler(app=app)
    scheduler.init_app(app)
    scheduler.start()
    scheduler.add_job(
        'pull_values_from_all_facilities',
        func=pull_values_from_all_facilities,
        trigger=IntervalTrigger(seconds=_config.PULL_INTERVAL_SECONDS),
        args=[facility_service, _config]
    )

    # Load routes within the application context
    with app.app_context():
        from .routes import facility_bp, handler_bp
        app.register_blueprint(facility_bp, url_prefix='/api')
        app.register_blueprint(handler_bp, url_prefix='/api')

    return app
