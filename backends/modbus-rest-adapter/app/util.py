def is_valid_input(value):
    """
    Checks if a value is an integer between 0 and 100 (inclusive).

    Args:
        value: The value to be checked.

    Returns:
        True if the value is an integer between 0 and 100, False otherwise.
    """
    # Check if the value is an integer
    if not isinstance(value, int):
        return False

    # Check if the value is within the range (0 to 100)
    return 0 <= value <= 100
