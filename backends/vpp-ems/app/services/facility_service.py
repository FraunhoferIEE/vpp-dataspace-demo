from typing import List

from ..repositories import FacilityRepository
from ..models import Facility


class FacilityService:
    def __init__(self):
        self.repository = FacilityRepository()

    def add_facility(self, name) -> Facility:
        return self.repository.create_facility(name)

    def add_connection_to_facility(self, facility_id, contract_id, endpoint, auth_key, auth_code) -> Facility or None:
        facility = self.repository.find_facility_by_id(facility_id)
        if not facility:
            return None
        return facility.add_connection(contract_id, endpoint, auth_key, auth_code)

    def remove_connection_from_facility(self, facility_id) -> Facility or None:
        facility = self.repository.find_facility_by_id(facility_id)
        if not facility:
            return None
        return facility.remove_connection()

    def list_facilities(self) -> List[Facility]:
        return self.repository.get_all_facilities()

    def get_facility(self, facility_id) -> Facility or None:
        return self.repository.find_facility_by_id(facility_id)

    def get_facility_by_contract_id(self, contract_id) -> Facility or None:
        return self.repository.find_facility_by_contract_id(contract_id)

    def remove_all_facilities(self):
        return self.repository.remove_all_facilities()

    def update_latest_data(self, facility_id, data, timestamp) -> Facility or None:
        facility = self.repository.find_facility_by_id(facility_id)
        if not facility:
            return None
        return facility.update_latest_data(data, timestamp)
