from app.enums import TypeOfData, UnitMultiplier, ModbusTCPByteOrder
from typing import List


class GenericModbusTCPDataMapping:

    def __init__(self,
                 register: int,
                 register_count: int,
                 byte_order: ModbusTCPByteOrder,
                 type_of_data: TypeOfData,
                 unit_multiplier: UnitMultiplier,
                 comment: str,
                 read_after_write=None,
                 use_random_transaction_id=None):
        self.register = register
        self.count = register_count
        self.byte_order = byte_order
        self.unit_multiplier = unit_multiplier
        self.type_of_data = type_of_data
        self.comment = comment
        self.read_after_write = read_after_write
        self.use_random_transaction_id = use_random_transaction_id


class GenericModbusTCPDataMappingContainer:
    def __init__(self,
                 data_mappings: List[GenericModbusTCPDataMapping],
                 set_point_configurations: List[GenericModbusTCPDataMapping]):
        if not all(isinstance(dm, GenericModbusTCPDataMapping) for dm in data_mappings):
            raise ValueError("data_mappings must be a list of GenericModbusTCPDataMapping")
        if not all(isinstance(spc, GenericModbusTCPDataMapping) for spc in set_point_configurations):
            raise ValueError("set_point_configurations must be a list of GenericModbusTCPDataMapping")
        self.data_mappings = data_mappings
        self.set_point_configurations = set_point_configurations
