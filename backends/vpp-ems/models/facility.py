from mongoengine import Document, StringField, EmbeddedDocumentField, EmbeddedDocument
import json

class DspaceConnection(EmbeddedDocument):
    contract_id = StringField(required=True)
    endpoint = StringField(required=True)
    auth_key = StringField(required=True)
    auth_code = StringField(required=True)


class Facility(Document):
    name = StringField(required=True)
    dspace_connection = EmbeddedDocumentField(DspaceConnection)
    latest_data = StringField()
    latest_data_timestamp = StringField()

    def to_dict(self):
        data = {
            "_id": str(self.id),
            "name": self.name,
            "dspace_connection": {
                "contract_id": self.dspace_connection.contract_id,
                "endpoint": self.dspace_connection.endpoint,
                "auth_key": self.dspace_connection.auth_key,
                "auth_code": self.dspace_connection.auth_code
            } if self.dspace_connection else None,
            "latest_data": json.loads(self.latest_data) if self.latest_data else None,
            "latest_data_timestamp": self.latest_data_timestamp
        }
        return data

    def add_connection(self, contract_id, endpoint, auth_key, auth_code):
        connection = DspaceConnection(contract_id=contract_id, endpoint=endpoint, auth_key=auth_key,
                                      auth_code=auth_code)
        self.dspace_connection = connection
        self.save()
        return self

    def remove_connection(self):
        self.dspace_connection = None
        self.save()
        return self

    def update_latest_data(self, data, timestamp):
        self.latest_data = json.dumps(data)
        self.latest_data_timestamp = timestamp
        self.save()
        return self
