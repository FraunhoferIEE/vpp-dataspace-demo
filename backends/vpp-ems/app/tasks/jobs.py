import requests
import logging
from datetime import datetime

from app.services import FacilityService
from app.config import Config
from app.models import Facility


def set_active_power_percent_for_facility(facility: Facility, value: int):
    try:
        dspace_connection = facility.dspace_connection
        if not dspace_connection:
            logging.error(f"No connection found for facility {facility.id}")
            return

        # clean up the endpoint URL
        host = dspace_connection['endpoint'].strip('/')

        # Assuming the path is always "api/control/active_power_percent".
        # Improvement: use a OpenAPI spec at ${host}/apispec_1.json to receive paths dynamically
        path = "/api/control/active_power_percent".strip('/')

        # Set the active power percent and log the response
        try:
            response = requests.post(
                f"{host}/{path}",
                headers={
                    dspace_connection['auth_key']: dspace_connection['auth_code']
                },
                json={"value": value},
                timeout=Config.HTTP_TIMEOUT_SECONDS
            )
            # Check if the response is successful and log the response
            if response.status_code == 200:
                logging.info(f"Set active power percent for facility {facility.id} : {response.json()}")
                return response
            # Log the response if it is not successful
            else:
                logging.error(
                    f"Failed to set active power percent for {facility.id} : {response.status_code} {response.reason}"
                )
                return response
        # Handle timeout exceptions
        except requests.exceptions.Timeout:
            logging.error(f"Timeout occurred for facility {facility.id}")
            raise requests.exceptions.Timeout
    except Exception as e:
        logging.error(f"Failed to set active power percent for facility {facility.id}: {str(e)}")
        raise e


def pull_values_from_all_facilities(facility_service: FacilityService, _config: Config):
    try:
        facilities = facility_service.list_facilities()
        if not facilities:
            logging.info("No facilities found")
            return
        else:
            logging.debug(f"Processing {len(facilities)} facilities")
            for facility in facilities:
                dspace_connection = facility.dspace_connection
                if not dspace_connection:
                    logging.debug(f"No connection found for facility {facility.id} (skipping)")
                    return

                # clean up the endpoint URL
                host = dspace_connection['endpoint'].strip('/')

                # Assuming the path is always "api/data".
                # Improvement: use the OpenAPI spec at ${host}/apispec_1.json to receive paths dynamically
                path = "/api/data".strip('/')

                # Pull values from the endpoint and log the response
                try:
                    response = requests.get(
                        f"{host}/{path}",
                        headers={
                            dspace_connection['auth_key']: dspace_connection['auth_code']
                        },
                        timeout=_config.HTTP_TIMEOUT_SECONDS
                    )
                    # Check if the response is successful and log the response
                    if response.status_code == 200:
                        logging.info(f"Pulled values from facility {facility.id} : {response.json()}")
                        facility_service.update_latest_data(facility.id, response.json(), datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

                    # Log the response if it is not successful
                    else:
                        logging.error(
                            f"Failed to pull values from {facility.id} : {response.status_code} {response.reason}"
                        )
                        facility_service.update_latest_data(facility.id, response.reason, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


                # Handle timeout exceptions
                except requests.exceptions.Timeout:
                    logging.error(f"Timeout occurred for facility {facility['id']}")
                    facility_service.update_latest_data(facility.id, "Timeout", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    except Exception as e:
        logging.error(f"Failed to run scheduled task: {str(e)}")


def print_time():
    logging.info(f"Current time: {datetime.now()}")
