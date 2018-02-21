import pytz
from datetime import datetime


def convert_to_timestamp(date):
    """
    params date [String] - mm/dd/yy
    returns [String] - Unix time in milliseconds
    """
    dt = datetime.strptime(date, "%m/%d/%y")

    epoch = datetime.utcfromtimestamp(0)
    ms_from_epoch = (dt - epoch).total_seconds() * 1000

    return str(long(ms_from_epoch))

def convert_unix_to_readable(timestamp):
    """
    params timestamp [String] number of milliseconds from epoch
    Returns [String] - date in platform's local timestamp
    """
    seconds = int(timestamp) / 1000
    utc = pytz.timezone('UTC')
    return datetime.fromtimestamp(seconds, utc).strftime('%m/%d/%y %H:%M')
