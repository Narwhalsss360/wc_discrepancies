from typing import Callable
from dataclasses import dataclass
from datatypes import Student, Discrepancy, DiscrepancyType


def prepare(s: str) -> bool:
    return s.strip().casefold()


def id_match(a: Student, b: Student) -> bool:
    return prepare(a.id) == prepare(b.id)


def name_match(a: Student, b: Student) -> bool:
    return prepare(a.first) == prepare(b.first) and \
    (prepare(b.last) in prepare(a.last) or prepare(a.last) in prepare(b.last))


def is_like(a: Student, b: Student) -> bool:
    return name_match(a, b) or id_match(a, b)


def detect_agaisnt(student: Student, db_students: list[Student]) -> Discrepancy | None:
    verified_match: Student | None = None
    similar: list[Student] = []
    for db_student in db_students:
        if id_match(student, db_student):
            verified_match: Student = db_student
            break
        if name_match(student, db_student):
            similar.append(db_student)

    if verified_match is None:
        return Discrepancy.new(DiscrepancyType.id, None, student, f'Student with ID was not found.', similar)

    if prepare(student.first) != prepare(verified_match.first):
        return Discrepancy.new(DiscrepancyType.first, verified_match, student, f'Student first name does not match.', similar)

    if prepare(student.last) != prepare(verified_match.last):
        return Discrepancy.new(DiscrepancyType.last, verified_match, student, f'Student last name does not match.', similar)

    return None


def is_already_detected(student: Student, discrepancies: list[Discrepancy]) -> bool:
    if not discrepancies:
        return False
    return any(student == discrepancy.wc_info for discrepancy in discrepancies)


@dataclass
class ProgressReport:
    index: int
    student: Student
    completed_student: bool
    discrepancies: list[Discrepancy]
    existing_discrepancies: list[Discrepancy]


def detect_all_sync(wc_students: list[Student], db_students: list[Student], existing_discrepancies: list[Discrepancy], progress_reporter: Callable[[ProgressReport], None] = None) -> list[Discrepancy]:
    if progress_reporter is None:
        progress_reporter: Callable[[ProgressReport], None] = lambda progress: None
    progress = ProgressReport(index=0,
                              student=None,
                              completed_student=False,
                              discrepancies=[],
                              existing_discrepancies=existing_discrepancies)

    for index, student in enumerate(wc_students):
        progress.index = index
        progress.completed_student = False
        progress.student = student

        if is_already_detected(student, existing_discrepancies):
            progress.completed_student = True
            progress_reporter(progress)
            continue

        progress_reporter(progress)
        if (discrepancy := detect_agaisnt(student, db_students)) is not None:
            progress.discrepancies.append(discrepancy)
        progress.completed_student = True
        progress_reporter(progress)
    return progress.discrepancies
