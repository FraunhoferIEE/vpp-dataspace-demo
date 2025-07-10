from flask import jsonify, current_app as app, request, redirect
from flasgger import swag_from
from app.services import CommunicationService
from app.util import is_valid_input
from app.enums import TypeOfData

comm_service = CommunicationService()


@app.route('/')
def home():
    return redirect('/apidocs')


@app.route('/api/data', methods=['GET'])
@swag_from('docs/get_data.yml')
def get_data():
    try:
        data = comm_service.read()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/control/active_power_percent', methods=['POST'])
@swag_from('docs/set_active_power_percent.yml')
def set_active_power_percent():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()
        value = data.get('value')

        if not is_valid_input(value):
            return jsonify({"error": "Field 'value' MUST be an integer between 0 and 100"}), 400

        print(value)
        comm_service.write(TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT_OPERATION, value)
        data = comm_service.read()
        return jsonify(data)

    except Exception as e:

        return jsonify({"error": str(e)}), 500
