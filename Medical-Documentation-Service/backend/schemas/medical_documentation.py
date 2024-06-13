from pydantic import BaseModel
from typing import List

class MedicalDocumentationEntry(BaseModel):
    """Class represents the schema of a medical documentation.

    Attributes:
        date: Date of the note in documentation.
        diagnose: Diagnose of the patient.
        recommendations: Recommendations for the patient.
    """

    date: str
    diagnose: str
    recommendations: str

    class Config:
        orm_mode = True

class MedicalDocumentation(BaseModel):
    """Class represents the schema of a medical documentation.

    Attributes:
        id: ID of the medical documentation.
        patient_id: ID of the patient.
        medical_documentation_entries: List of medical documentation entries.
    """

    id: int
    patient_id: str
    medical_documentation_entries: List[MedicalDocumentationEntry]

    class Config:
        orm_mode = True



