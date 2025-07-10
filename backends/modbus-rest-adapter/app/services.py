import os
import time

from pymodbus.client.tcp import ModbusTcpClient
from pymodbus.payload import BinaryPayloadDecoder, BinaryPayloadBuilder
from pymodbus.constants import Endian


from app.mappings import modbus_sim_mapping, solar_mapping, wind_mapping
from app.enums import ModbusTCPByteOrder, TypeOfData

mapping_type = os.getenv("MAPPING_TYPE", "sim").lower()

if mapping_type == "sim":
    selected_mapping = modbus_sim_mapping
elif mapping_type == "solar":
    selected_mapping = solar_mapping
else:
    selected_mapping = wind_mapping

# Define environment variables
MODBUS_HOST = os.getenv("MODBUS_HOST", "localhost")
MODBUS_PORT = int(os.getenv("MODBUS_PORT", 502))
MODBUS_UNIT_ID = int(os.getenv("MODBUS_UNIT_ID", 1))


class CommunicationService:
    def __init__(self):
        self.mapping = modbus_sim_mapping
        self.client = ModbusTcpClient(host=MODBUS_HOST, port=MODBUS_PORT)
        self.last_reading = {}

    def read(self):
        self.client.connect()
        # read values
        for mapping in self.mapping.data_mappings:
            response = self.client.read_holding_registers(address=mapping.register,
                                                          count=mapping.count,
                                                          slave=MODBUS_UNIT_ID)
            if response.isError():
                raise RuntimeError(f"Modbus error while reading {mapping.type_of_data.name}: {response}")

            if mapping.byte_order is ModbusTCPByteOrder.FLOAT32_HBF_LWF:
                decoder = BinaryPayloadDecoder.fromRegisters(
                    registers=response.registers,
                    byteorder=Endian.BIG,
                    wordorder=Endian.LITTLE,
                )
                result = decoder.decode_32bit_float()
                self.last_reading[mapping.type_of_data.name] = result
                continue

            # FLOAT_MOTOROLA (interpret as 32-bit float with BIG byte and word order)
            elif mapping.byte_order is ModbusTCPByteOrder.FLOAT_MOTOROLA:
                decoder = BinaryPayloadDecoder.fromRegisters(
                    registers=response.registers,
                    byteorder=Endian.BIG,
                    wordorder=Endian.BIG,
                )
                result = decoder.decode_32bit_float()
                self.last_reading[mapping.type_of_data.name] = result
                continue

            # UINT32_MOTOROLA (interpret as 32-bit unsigned integer with BIG byte and word order)
            elif mapping.byte_order is ModbusTCPByteOrder.UINT32_MOTOROLA:
                decoder = BinaryPayloadDecoder.fromRegisters(
                    registers=response.registers,
                    byteorder=Endian.BIG,
                    wordorder=Endian.BIG,
                )
                result = decoder.decode_32bit_uint()
                self.last_reading[mapping.type_of_data.name] = result
                continue

            # UINT32
            elif mapping.byte_order is ModbusTCPByteOrder.UINT32:
                decoder = BinaryPayloadDecoder.fromRegisters(
                    registers=response.registers, 
                    byteorder=Endian.BIG,
                    wordorder=Endian.LITTLE,
                )
                result = decoder.decode_32bit_uint()
                self.last_reading[mapping.type_of_data.name] = result
                continue


            elif mapping.byte_order is ModbusTCPByteOrder.UINT16_HBF:
                decoder = BinaryPayloadDecoder.fromRegisters(
                    registers=response.registers,
                    byteorder=Endian.BIG,
                )
                result = decoder.decode_16bit_uint()
                self.last_reading[mapping.type_of_data.name] = result
                continue


            else:
                raise NotImplementedError(f"Can't convert {mapping.byte_order.name}" "")

        self.close()
        return self.last_reading

    def write(self, target: TypeOfData, value: int):
        for mapping in self.mapping.set_point_configurations:
            if mapping.type_of_data is target:
                if mapping.byte_order is ModbusTCPByteOrder.UINT16_HBF:
                    self.client.connect()
                    encoder = BinaryPayloadBuilder(
                        byteorder=Endian.BIG,
                    )
                    encoder.add_16bit_uint(value)
                    registers = encoder.to_registers()
                    self.client.write_registers(
                        address=mapping.register,
                        values=registers,
                        slave=MODBUS_UNIT_ID,
                    )
                    time.sleep(0.2)
                    self.client.close()
                    break

    def close(self):
        self.client.close()
