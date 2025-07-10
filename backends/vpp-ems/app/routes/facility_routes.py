from flask import Blueprint, jsonify, request
from flask.typing import ResponseReturnValue

from ..services import FacilityService
from ..tasks import set_active_power_percent_for_facility

facility_bp = Blueprint('facility', __name__)
service = FacilityService()


@facility_bp.route('/facilities', methods=['GET'])
def list_facilities() -> ResponseReturnValue:
    facilities = service.list_facilities()
    facilities_list = [facility.to_dict() for facility in facilities]
    return jsonify(facilities_list), 200


@facility_bp.route('/facilities', methods=['POST'])
def create_facility() -> ResponseReturnValue:
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Missing required data"}), 400
    facility = service.add_facility(data['name'])
    return facility.to_json(), 201


@facility_bp.route('/facilities/<facility_id>', methods=['GET'])
def get_facility(facility_id):
    facility = service.get_facility(facility_id)
    if facility:
        return facility.to_json(), 200
    return jsonify({"error": "Facility not found"}), 404


@facility_bp.route('/facilities/<facility_id>/connection', methods=['POST'])
def add_connection_to_facility(facility_id):
    data = request.get_json()
    if not data or 'contractId' not in data or 'endpoint' not in data or 'authKey' not in data or 'authCode' not in data:
        return jsonify({"error": "Missing required data"}), 400
    if not service.get_facility(facility_id):
        return jsonify({"error": "Facility not found"}), 404

    facility = service.add_connection_to_facility(facility_id,
                                                  data['contract_id'],
                                                  data['endpoint'],
                                                  data['auth_key'],
                                                  data['auth_code'])
    return facility.to_json(), 201


@facility_bp.route('/facilities/<facility_id>/connections', methods=['DELETE'])
def remove_connection_from_facility(facility_id):
    if not service.get_facility(facility_id):
        return jsonify({"error": "Facility not found"}), 404
    facility = service.remove_connection_from_facility(facility_id)
    return facility.to_json(), 200


@facility_bp.route('/facilities/<facility_id>/control', methods=['POST'])
def control_facility(facility_id):
    facility = service.get_facility(facility_id)

    if not facility:
        return jsonify({"error": "Facility not found"}), 404

    data = request.get_json()
    print(data)
    if not data or 'active_power_percent' not in data:
        return jsonify({"error": "Missing required data"}), 400

    try:
        value = int(data['active_power_percent'])
        print(f"Setting active power percent for facility {facility.id} to {value}")

        response = set_active_power_percent_for_facility(facility, value)

        if response.status_code != 200:
            return jsonify({"error": "Failed to set active power percent"}), 500
        else:
            print(f"Success: {response.json()}")
            return jsonify(response.json()), 200

    except ValueError:
        return jsonify({"error": "Field 'active_power_percent' MUST be an integer"}), 400


@facility_bp.route('/facilities', methods=['DELETE'])
def remove_all_facilities():
    service.remove_all_facilities()
    return jsonify({"message": "All facilities removed"}), 204
