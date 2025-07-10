from app.enums import ModbusTCPByteOrder, TypeOfData, UnitMultiplier
from app.model import GenericModbusTCPDataMapping, GenericModbusTCPDataMappingContainer

wind_mapping = GenericModbusTCPDataMappingContainer(
    data_mappings=[
        GenericModbusTCPDataMapping(
            0,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Aktuelle Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            2,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.SUPPLIED_INSTALLED_NOMINAL_ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Installierte Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            4,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT,
            UnitMultiplier.KILO,
            "Ist-Sollwert"
        ),
        GenericModbusTCPDataMapping(
            5,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.READY,
            UnitMultiplier.NONE,
            "Grid Availability"
        ),
        GenericModbusTCPDataMapping(
            6,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.AVAILABLE_ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Verfügbare Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            8,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.WIND_SPEED,
            UnitMultiplier.NONE,
            "Wind speed in m/s"
        ),
    ],
    set_point_configurations=[
        GenericModbusTCPDataMapping(
            10,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT_OPERATION,
            UnitMultiplier.NONE,
            "Soll-Sollwert",
            read_after_write=False,
            use_random_transaction_id=False
        )
    ]
)


solar_mapping = GenericModbusTCPDataMappingContainer(
    data_mappings=[
        GenericModbusTCPDataMapping(
            0,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Aktuelle Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            2,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.SUPPLIED_INSTALLED_NOMINAL_ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Installierte Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            4,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT,
            UnitMultiplier.KILO,
            "Ist-Sollwert"
        ),
        GenericModbusTCPDataMapping(
            5,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.READY,
            UnitMultiplier.NONE,
            "Grid Availability"
        ),
        GenericModbusTCPDataMapping(
            6,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.AVAILABLE_ACTIVE_POWER,
            UnitMultiplier.KILO,
            "Verfügbare Wirkleistung in kW"
        ),
        GenericModbusTCPDataMapping(
            8,
            2,
            ModbusTCPByteOrder.FLOAT32_HBF_LWF,
            TypeOfData.FREQUENCY,
            UnitMultiplier.NONE,
            "Frequenz in Hz"
        ),
    ],
    set_point_configurations=[
        GenericModbusTCPDataMapping(
            10,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT_OPERATION,
            UnitMultiplier.NONE,
            "Soll-Sollwert",
            read_after_write=False,
            use_random_transaction_id=False
        )
    ]
)

modbus_sim_mapping = GenericModbusTCPDataMappingContainer(
    data_mappings=[
        # unixtime aus Holding Register 400+401
        GenericModbusTCPDataMapping(
            400,
            2,
            ModbusTCPByteOrder.UINT32_MOTOROLA,
            TypeOfData.UNIX_TIME,
            UnitMultiplier.NONE,
            "unixtime from modbus-sim (Holding Register 400/401)"
        ),
        # Holding Register 102 – wird gelesen (z. B. Setpoint-Value)
        GenericModbusTCPDataMapping(
            102,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER,
            UnitMultiplier.NONE,
            "Setpoint value (Holding Register 102, read)"
        ),
    ],
    set_point_configurations=[
        # Holding Register 102 – wird beschrieben
        GenericModbusTCPDataMapping(
            102,
            1,
            ModbusTCPByteOrder.UINT16_HBF,
            TypeOfData.ACTIVE_POWER_SET_POINT_PERCENT_OPERATION,
            UnitMultiplier.NONE,
            "Setpoint value (Holding Register 102, write)",
            False,
            False
        )
    ]
)
