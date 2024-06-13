from pydantic import BaseModel


class Referral(BaseModel):
    """Class represents the schema of a referral.

    Attributes:
        patient: Model of a user.
        doctor: Model of a doctor.
        description: Descritpion for a referral.
    """

    patient_id: str
    doctor_id: str
    description: str

    class Config:
        orm_mode = True
