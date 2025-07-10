from flask import Blueprint, jsonify, request
from flask.typing import ResponseReturnValue
from ..services import FacilityService

handler_bp = Blueprint('handlers', __name__)
service = FacilityService()


@handler_bp.route('/handlers/edr-receiver', methods=['POST'])
def create_new_facility_from_connection() -> ResponseReturnValue:
    param_value = request.args.get('driver', default=None)
    print(f'Value of driver: {param_value}')

    data = request.get_json()
    if not data or 'contractId' not in data or 'endpoint' not in data or 'authKey' not in data or 'authCode' not in data:
        return jsonify({"error": "Missing required data"}), 400

    # Check if a facility with the contractId already exists
    facility = service.get_facility_by_contract_id(data['contractId'])
    if facility is None:
        print(f"Facility with contractId {data['contractId']} does not exist, creating new facility")
        facility = service.add_facility(name=f"Facility created by contractId {data['contractId']}")

    if not facility:
        return jsonify({"error": "Failed to create facility"}), 500

    updated_facility = service.add_connection_to_facility(
        facility_id=facility.id,
        contract_id=data['contractId'],
        endpoint=data['endpoint'],
        auth_key=data['authKey'],
        auth_code=data['authCode'],
    )

    if not updated_facility:
        return jsonify({"error": "Failed to add connection to facility"}), 500
    else:
        print(f"Facility {facility.id} created with connection {updated_facility.dspace_connection}")
        return updated_facility.to_json(), 201
