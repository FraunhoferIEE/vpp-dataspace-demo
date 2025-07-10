from app.models.facility import Facility
from bson import ObjectId
from bson.errors import InvalidId
from mongoengine import DoesNotExist
from typing import List


class FacilityRepository:
    @staticmethod
    def create_facility(name) -> Facility:
        facility = Facility(name=name)
        return facility.save()

    @staticmethod
    def get_all_facilities() -> List[Facility]:
        return Facility.objects.all()

    @staticmethod
    def find_facility_by_id(facility_id: str) -> Facility or None:
        try:
            facility = Facility.objects(id=ObjectId(facility_id)).first()
        except InvalidId:
            # Handle case where the facility_id is not a valid ObjectId
            return None
        except DoesNotExist:
            # Handle case where no facility matches the provided ObjectId
            return None
        return facility

    @staticmethod
    def find_facility_by_contract_id(contract_id: str) -> Facility or None:
        try:
            facility = Facility.objects(dspace_connection__contract_id=contract_id).first()
        except DoesNotExist:
            # Handle case where no facility matches the provided contract_id
            return None
        return facility

    @staticmethod
    def remove_all_facilities():
        return Facility.objects.delete()
