from __future__ import annotations
from typing import Any
from dataclasses import dataclass, fields
from os.path import isfile, getmtime
from time import time
from json import loads, dumps
from datatypes import dcdict, rdcdict, Discrepancy, Student
from wc import secure_wc_key, wc_data


@dataclass
class KeyMap(dcdict):
    first: str
    last: str
    id: str

    @property
    def valid(self) -> bool:
        return all(getattr(self, field.name) != '' for field in fields(self))

    def __getitem__(self, key):
        for field in fields(self):
            if field.name == key:
                return getattr(self, field.name)
        raise KeyError(f'Key {key} is not a field')


@dataclass
class Config(rdcdict):
    FILE = 'config.json'
    DISCREPANCIES_FILE = 'discrepancies.json'
    CACHE_DATA = 0
    CACHE_LOAD_TIME = 1

    wc_keys: KeyMap
    database_keys: KeyMap
    database_file: str
    api_key_file: str
    pgm_state: dict[str, Any]

    def __post_init__(self) -> None:
        if isinstance(self.wc_keys, dict):
            self.wc_keys = KeyMap(**self.wc_keys)
        if isinstance(self.database_keys, dict):
            self.database_keys = KeyMap(**self.database_keys)
        self._init_caches()

    def _init_caches(self) -> None:
        self._database_cache = None, None
        self._discrepancies_cache = None, None

    @property
    def valid(self) -> bool:
        return self.wc_keys.valid and self.database_keys.valid and self.api_key_file != '' and self.pgm_state is not None and self.database_file is not None

    @property
    def database_students(self) -> list[Student]:
        if not isfile(self.database_file):
            raise RuntimeError(f'Students database file {self.database_file} does not exist')

        cached, cache_load_time = self._database_cache
        if cached is not None and getmtime(self.database_file) <= cache_load_time:
            return cached

        with open(self.database_file, 'r', encoding='utf-8') as students:
            students: list[Student] = [Student.use_keys(dict(self.database_keys), data) for data in loads(students.read())]

        self._database_cache = students, time()
        return students

    @property
    def wc_students(self) -> list[Student]:
        return [Student.use_keys(dict(self.wc_keys), data) for data in wc_data(secure_wc_key(self.api_key))]

    @property
    def discrepancies(self) -> list[Discrepancy]:
        if not isfile(Config.DISCREPANCIES_FILE):
            return []

        cached, cache_load_time = self._discrepancies_cache
        if cached is not None and getmtime(self._discrepancies_cache) <= cache_load_time:
            return cached

        with open(Config.DISCREPANCIES_FILE, 'r', encoding='utf-8') as discrepancies_file:
            discrepancies: list[Discrepancy] = [Discrepancy(**discrepancy) for discrepancy in (loads(discrepancies_file.read()))]

        self._discrepancies_cache = discrepancies, time()
        return discrepancies

    def commit_discrepancies(self, discrepancies: list[Discrepancy]) -> None:
        with open(Config.DISCREPANCIES_FILE, 'w', encoding='utf-8') as discrepancies_file:
            discrepancies_file.write(dumps([dict(discrepancy) for discrepancy in discrepancies], indent=4))
        self._discrepancies_cache = discrepancies, time()

    @property
    def api_key(self) -> str:
        with open(self.api_key_file, 'r', encoding='utf-8') as key_file:
            return loads(key_file.read())['key']

    def save(self) -> None:
        with open(Config.FILE, 'w', encoding='utf-8') as file:
            file.write(dumps(dict(self), indent=4))

    @staticmethod
    def generate_default() -> Config:
        return Config(
            KeyMap('', '', ''),
            KeyMap('', '', ''),
            '',
            '',
            {}
        )

    @staticmethod
    def load() -> Config | None:
        try:
            with open(Config.FILE, 'r', encoding='utf-8') as file:
                return Config(**loads(file.read()))
        except FileNotFoundError as e:
            return None

    def ensure_valid(self) -> Config:
        if not self.valid:
            raise RuntimeError(f'Config file {Config.FILE} was invalid.')
        return self

    @staticmethod
    def load_valid() -> Config:
        if (cfg := Config.load()) is None:
            raise RuntimeError(f'Config file {Config.FILE} not found.')
        return cfg.ensure_valid()
