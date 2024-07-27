from __future__ import annotations
from typing import Any
from dataclasses import dataclass, field
from datetime import datetime
import json
from .datatypes import dcdict, jsonl_loads

@dataclass
class Log(dcdict):
    LOG_FILE = 'logs.jsonl'

    level: int
    sender: str
    message: str
    at: str = field(default_factory=lambda: datetime.now().isoformat())

    @staticmethod
    def out(log: Log) -> Log:
        print(log)
        with open(Log.LOG_FILE, 'a', encoding='utf-8') as log_file:
            log_file.write(f'{json.dumps(dict(log))}\n')
        return log

    @staticmethod
    def load(as_dict: dict) -> Log:
        return Log(**as_dict, )

    @staticmethod
    def logs():
        with open(Log.LOG_FILE, 'r', encoding='utf-8') as log_file:
            text: str = log_file.read()
        for log_as_dict in jsonl_loads(text):
            yield Log(**log_as_dict)

    def __str__(self) -> str:
        return f'{self.at} LEVEL {self.level}|{self.sender}: {self.message}'
