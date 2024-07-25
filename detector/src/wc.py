from typing import Optional
from datetime import datetime, timezone, timedelta
from hashlib import md5
from requests import Session, Request, PreparedRequest, Response


WC_BASE = 'https://bcc.mywconline.net/api'


class BadResponseError(Exception):
    def __init__(self, *args: object, response: Optional[Response] = None) -> None:
        super().__init__(*args)
        self.response: Response | None = response


def meridian_now_utc_offset(meridian_utc_offset: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=meridian_utc_offset)


def secure_wc_key(key: str, ip: Optional[str] = None, meridian_utc_offset: Optional[int] = -5) -> str:
    """
    Fully secures key on this call. Must be re-secured every hour
    :param key: Raw key from $API_KEY
    :param ip: IP Address from $IP
    :param meridian_utc_offset: UTC Offset, since WC Online does not change time with daylight savings
    :return: Secured key
    """

    ip = '' if ip is None else ip
    now_offset = meridian_now_utc_offset(meridian_utc_offset)
    date = now_offset.strftime('%m%d%Y')
    hour = now_offset.strftime('%H')
    return md5(f'{key}{date}?{hour}!{ip}'.encode()).hexdigest()


def wc_data(secured_key: str, date: Optional[datetime] = None, meridian_utc_offset: Optional[int] = -5, type: Optional[str] = None, session: Optional[Session] = None) -> list[dict]:
    session: Session = session or Session()
    date: datetime = date or meridian_now_utc_offset(meridian_utc_offset)
    type: str = type or 'CUSTOM'

    prepared_request: PreparedRequest = Request(
        'GET',
        WC_BASE,
        params={
            'type': type,
            'date': date.strftime('%Y%m%d'),
            'key': secured_key
        }
    ).prepare()

    response: Response = session.send(prepared_request)
    if not response.ok:
        raise BadResponseError(response.text, response=response)

    if response.headers['Content-Type'] != 'application/json':
        raise BadResponseError(f'Content mime-type was not application/json', response=response)

    return response.json()
