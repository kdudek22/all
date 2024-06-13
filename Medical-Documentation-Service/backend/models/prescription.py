from models.database import Base

from sqlalchemy import Column, Integer, String, ForeignKey


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(String)
    patient_id = Column(String)
    drug_id = Column(Integer, ForeignKey("drugs.id"))
    description = Column(String)
