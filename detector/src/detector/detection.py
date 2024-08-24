from typing import Callable
from dataclasses import dataclass
from .datatypes import Student, Discrepancy, DiscrepancyType


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


def is_already_detected(student: Student, discrepancies: set[Discrepancy]) -> bool:
    if not discrepancies:
        return False
    return any(student == discrepancy.wc_info for discrepancy in discrepancies)


@dataclass
class ProgressReport:
    index: int
    student: Student
    completed_student: bool
    new_discrepancies: set[Discrepancy]
    existing_discrepancies: set[Discrepancy]
    discrepancies: set[Discrepancy]


def detect_resolved(existing_discrepancies: set[Discrepancy], wc_students: list[Student], db_students: list[Student]) -> None:
    for existing_discrepancy in existing_discrepancies:
        if existing_discrepancy.resolved_by is not None:
            continue
        if existing_discrepancy.wc_info not in wc_students:
            existing_discrepancy._resolved_from_wc()



def detect_all_sync(wc_students: list[Student], db_students: list[Student], existing_discrepancies: set[Discrepancy], progress_reporter: Callable[[ProgressReport], None] = None) -> ProgressReport:
    if progress_reporter is None:
        progress_reporter: Callable[[ProgressReport], None] = lambda progress: None
    progress = ProgressReport(index=0,
                              student=None,
                              completed_student=False,
                              new_discrepancies=[],
                              existing_discrepancies=existing_discrepancies,
                              discrepancies=list(existing_discrepancies))

    detect_resolved(existing_discrepancies, wc_students, db_students)

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
            progress.new_discrepancies.append(discrepancy)
        progress.completed_student = True
        progress_reporter(progress)
    progress.discrepancies.extend(progress.new_discrepancies)
    return progress
