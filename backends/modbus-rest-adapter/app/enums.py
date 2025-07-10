from enum import auto, Enum


class ModbusTCPByteOrder(Enum):
    """
   Defines how to interpret the Bytes of the Register's
   e.g. BigEndian (high Byte first) suffix: HBF, LittleEndian (low Byte first) suffix: LBF

   Possible Byte Order on 32 Bit Value (2 Registers/Words, 4 Bytes)
   - high Byte first high Word first (BigEndian) suffix: hBf_hWf / BE
   - high Byte first low Word first (Mixed) suffix: hBf_lWf
   - low Byte first high Word first (Mixed) suffix: lBf_hWf
   - low Byte first low Word first (LittleEndian) suffix lBf_lWf / LE

   LE/lBf (low Byte first): (Intel)x86, ALPHA, VAX
   BE/hBf (high Byte first): Motorola, MIPS SPARC

   Modbus based on Motorola Processors so the "normal" byte-order of a Register (16 bit Word) is high Byte first (hBf or BE)
   but for 32Bit Values, often set external by Intel systems. so its results in a mixed mode high Byte first low Word first (hBf_lWf)
    """
    UNDEF = auto()
    UINT16_HBF = auto()
    INT16_HBF = auto()
    UINT32 = auto()
    INT32 = auto()
    INT64 = auto()
    UINT32_MOTOROLA = auto()
    INT32_MOTOROLA = auto()
    INT64_MOTOROLA = auto()
    FLOAT_MOTOROLA = auto()
    DOUBLE_MOTOROLA = auto()
    FLOAT32_HBF_LWF = auto()
    FLOAT32_LE = auto()
    BINARY = auto()
    COIL = auto()


class UnitMultiplier(Enum):
    # Centi 10**-2.
    CENTI = "Centi"

    # Deci 10**-1.
    DECI = "Deci"

    # Giga 10**9.
    GIGA = "Giga"

    # Kilo 10**3.
    KILO = "Kilo"

    # Mega 10**6.
    MEGA = "Mega"

    # Micro 10**-6.
    MICRO = "Micro"

    # Milli 10**-3.
    MILLI = "Milli"

    # Nano 10**-9.
    NANO = "Nano"

    # No multiplier or equivalently multiply by 1.
    NONE = "none"

    # Pico 10**-12.
    PICO = "Pico"

    # Tera 10**12.
    TERA = "Tera"


class UnitSymbol(Enum):
    # Plane angle in degrees
    DEG = ("deg", "°")
    # Relative temperature in degrees Celsius
    DEG_C = ("degC", "°C")
    # Euro
    EUR = ("EUR", "€")
    # Euro per Megawatt hour
    EUR_PER_M_WH = ("EUR_per_MWh", "€/MWh")
    # Time in hours
    H = ("h", "h")
    # Frequency in hertz
    HZ = ("Hz", "Hz")
    # Volume in cubic meters
    M_3 = ("m3", "\u33A5")
    # Velocity in meters per second
    M_S = ("m_s", "m/s")
    # Standard cubic meter per hour in Nm³/h
    NM3_H = ("NM3_H", "N\u33A5/h")
    # Dimension less quantity, e.g. count, per unit, etc.
    NONE = ("none", "")
    # Time in seconds
    S = ("s", "s")
    # Volt-ampere reactive
    VAR = ("Var", "Var")
    # Power in Watt
    W = ("W", "W")
    # Energy in Watt hours
    WH = ("Wh", "Wh")

    def __init__(self, code, printable_value):
        self._value_ = code
        self.printable_value = printable_value


class InterpolationMode(Enum):
    # linear interpolation method
    LINEAR = auto()

    # linear interpolation method for angle values [degree]. resulting value-range=[0..360]
    LINEAR_ANGLE = auto()

    # linear interpolation method including weighted mean for angle values [degree]. resulting value-range=[0..360].
    # Note: Calculation of mean value never takes place for given last result timestamp.
    LINEAR_MEAN_ANGLE = auto()

    # linear interpolation method including weighted mean for angle values [degree]. resulting value-range=[-180..180].
    # Note: Calculation of mean value never takes place for given last result timestamp
    LINEAR_MEAN_ANGLE2 = auto()

    # linear interpolation method including weighted arithmetic mean.
    # Note: Calculation of mean value never takes place for given last result timestamp.
    LINEAR_MEAN = auto()

    # step function
    STEP = auto()

    # step function with maximum of values of interval
    STEP_MAXIMUM = auto()

    # step function including weighted arithmetic mean.
    # Note: Calculation of mean value never takes place for given last result timestamp.
    STEP_MEAN = auto()

    # step function with minimum of values of interval
    STEP_MINIMUM = auto()


class Domain(Enum):
    # (-∞..∞)
    ANY = auto()

    # {0, 1}
    BOOLEAN = auto()

    # [-1..0..1]
    NORMALIZED_ANY = auto()

    # [0..1]
    NORMALIZED_NON_NEGATIVE = auto()

    # [-100..0..100]
    PERCENTAGE_ANY = auto()

    # [0..100]
    PERCENTAGE_NON_NEGATIVE = auto()

    # [0..∞)
    NON_NEGATIVE = auto()

    # (-∞..0]
    NON_POSITIVE = auto()

    # [0..360]
    DEGREE = auto()

    # [-180..180]
    DEGREE_SHIFTED = auto()

    # {0, 1, 2, 3, 4}
    DISCRETE_0_1_2_3_4 = auto()


class TypeOfData(Enum):
    # Active Power [W]
    # negative sign (-) means consumption, positive sign means generation
    ACTIVE_POWER = (UnitSymbol.W, False, InterpolationMode.LINEAR_MEAN, Domain.ANY)

    # Supplied installed nominal active power
    SUPPLIED_INSTALLED_NOMINAL_ACTIVE_POWER = (UnitSymbol.W, True, InterpolationMode.STEP, Domain.NON_NEGATIVE)

    # Demanded installed nominal active power
    DEMANDED_INSTALLED_NOMINAL_ACTIVE_POWER = (UnitSymbol.W, True, InterpolationMode.STEP, Domain.NON_NEGATIVE)

    # Measured SetPoint [Percent 0 ... 100]
    # (Percent of SUPPLIED_LIMITED_NOMINAL_ACTIVE_POWER for producers)
    # (Percent of DEMANDED_INSTALLED_NOMINAL_ACTIVE_POWER for consumers)
    ACTIVE_POWER_SET_POINT_PERCENT = (UnitSymbol.NONE, True, InterpolationMode.STEP, Domain.PERCENTAGE_NON_NEGATIVE)

    # Current readiness (not ready / ready)
    READY = (UnitSymbol.NONE, False, InterpolationMode.STEP_MINIMUM, Domain.BOOLEAN)

    # Air Temperature in degree Celsius
    AIR_TEMPERATURE = (UnitSymbol.DEG_C, False, InterpolationMode.LINEAR_MEAN, Domain.ANY)

    # Wind speed [m/s]
    WIND_SPEED = (UnitSymbol.M_S, False, InterpolationMode.LINEAR_MEAN, Domain.NON_NEGATIVE)

    # Configured SetPoint [Percent 0 ... 100 for producers 0 ... -100 for consumers]
    # (Percent of SUPPLIED_LIMITED_NOMINAL_ACTIVE_POWER for producers)
    # (Percent of DEMANDED_INSTALLED_NOMINAL_ACTIVE_POWER for consumers)
    ACTIVE_POWER_SET_POINT_PERCENT_OPERATION = (UnitSymbol.NONE, True, InterpolationMode.STEP, Domain.PERCENTAGE_ANY)

    AVAILABLE_ACTIVE_POWER = (UnitSymbol.W, False, InterpolationMode.STEP_MEAN, Domain.ANY)

    FREQUENCY = (UnitSymbol.HZ, False, InterpolationMode.LINEAR_MEAN, Domain.NON_NEGATIVE)
    
    UNIX_TIME = (UnitSymbol.NONE, False, InterpolationMode.LINEAR_MEAN, Domain.ANY)

    MATH_PI = (UnitSymbol.NONE, False, InterpolationMode.LINEAR_MEAN, Domain.ANY)


    def __init__(self, unit=None, future_timestamps_allowed=None, interpolation_mode=None, domain=None):
        self.unit = unit
        self.future_timestamps_allowed = future_timestamps_allowed
        self.interpolation_mode = interpolation_mode
        self.domain = domain
