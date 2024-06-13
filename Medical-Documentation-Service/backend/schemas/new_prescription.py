from pydantic import BaseModel


class NewPrescription(BaseModel):
    """Class represents the schema of a prescription.

    Attributes:
        patient: Model of a user.
        doctor: Model of a doctor.
        drug: Model of a drug.
        description: Descritpion for a prescription (quantity, dosage, etc.).
    """

    patient_id: str
    doctor_id: str
    drug_name: str
    description: str

    class Config:
        orm_mode = True
