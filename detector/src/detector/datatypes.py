from __future__ import annotations
from typing import Any
from datetime import datetime
from dataclasses import dataclass, asdict, is_dataclass, fields
import json
from enum import Enum
from .errors import DataError


def jsonl_loads(text: str, *args, **kwargs):
    for line in text.split('\n'):
        if not line:
            return
        yield json.loads(line, *args, **kwargs)


def jsonl_dumps(objs: list[Any], *args, **kwargs):
    text: str = ''
    for obj in objs:
        text += f'{json.dumps(objs, *args, **kwargs, indent=0)}\n'
    return text


class dcdict:
    """
        Provides a super class that allows easy conversion of dataclass to dict using `dataclasses.asdict()`
    """

    def __iter__(self):
        if not is_dataclass(self):
            raise RuntimeError('dcdict should only be inherited by dataclasses')
        return iter(asdict(self).items())


class rdcdict:
    """
        Provides a super class that allows easy *recursive* conversion of dataclass to dict using `dataclasses.asdict()`
    """

    @staticmethod
    def iter_on(dc) -> dict:
        if not is_dataclass(dc):
            raise RuntimeError('rdcdict should only be used by dataclasses')
        copy = asdict(dc)

        def recurse(obj, field_name: str):
            attr: Any = getattr(obj, field_name)

            def parse_list():
                for item in attr:
                    if is_dataclass(item):
                        item = rdcdict.iter_on(item)

            def parse_dict():
                for key in attr.keys():
                    if is_dataclass(attr[key]):
                        attr[key] = rdcdict.iter_on(attr[key])

            def parse_dc():
                setattr(obj, field_name, rdcdict.iter_on(attr))

            if isinstance(attr, list):
                parse_list()
            elif isinstance(attr, dict):
                parse_dict()
            elif is_dataclass(attr):
                parse_dc()

        for key in copy.keys():
            if is_dataclass(copy[key]):
                for field in fields(copy[key]):
                    recurse(copy[key], field.name)
        return iter(copy.items())

    def __iter__(self) -> dict:
        return rdcdict.iter_on(self)


@dataclass
class Student(dcdict):
    first: str
    last: str
    id: str

    @staticmethod
    def use_keys(key_map: dict[str, str], data: dict[str, str]) -> Student:
        return Student(data[key_map['first']], data[key_map['last']], data[key_map['id']])

    @staticmethod
    def ensure_dc(student: Student | dict[str | str]) -> Student:
        if isinstance(student, dict):
            return Student(**student)
        elif isinstance(student, Student):
            return student
        else:
            raise DataError('`student` should be either `Student` or `dict`')


def xor(a, b):
    return a != b


class DiscrepancyType(Enum):
    id = 0
    first = 1
    last = 2


@dataclass
class Discrepancy(rdcdict):
    RESOLVED_FROM_WC = 'RESOLVED_FROM_WC'

    type: str
    student_info: Student | None
    wc_info: Student | None
    discovered: str
    message: str
    resolved_by: str | None
    resolve_message: str | None
    similar: list[Student]

    def __post_init__(self):
        if isinstance(self.type, int):
            self.type = DiscrepancyType(self.type).name
        elif isinstance(self.type, str):
            self.type = DiscrepancyType[self.type].name
        elif isinstance(self.type, DiscrepancyType):
            self.type = self.type.name

        if isinstance(self.discovered, datetime):
            self.discovered = self.discovered.isoformat()

        if xor(self.resolve_message is None, self.resolved_by is None):
            raise DataError('resolve_message and resolved_by must be both exclusively None or not None')

        if self.student_info is not None:
            self.student_info: Student = Student.ensure_dc(self.student_info)
        if self.wc_info is not None:
            self.wc_info: Student = Student.ensure_dc(self.wc_info)
        for index, student in enumerate(self.similar):
            self.similar[index] = Student.ensure_dc(student)

    def resolve(self, message: str, by: str) -> Discrepancy:
        if by == Discrepancy.RESOLVED_FROM_WC:
            raise DataError(f'Resolver must not be ${Discrepancy.RESOLVED_FROM_WC}')
        if self.resolved_by is not None:
            raise DataError(f'Discrepancy already resolved by {self.resolved_by}')
        if None in (message, by):
            raise DataError('Must include resolve message and resolved by to resolve a discrepancy')
        self.resolve_message = message
        self.resolved_by = by
        return self

    def _resolved_from_wc(self) -> Discrepancy:
        self.resolve_message = 'The data has been resolved on WC Online'
        self.resolved_by = Discrepancy.RESOLVED_FROM_WC
        return self

    @staticmethod
    def new(type: DiscrepancyType, student_info: Student, wc_info: Student, message: str, similar: list[Student]) -> Discrepancy:
        return Discrepancy(type, student_info, wc_info, datetime.now().isoformat(), message, None, None, similar)
