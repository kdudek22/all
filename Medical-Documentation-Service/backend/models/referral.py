from models.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey


class Referral(Base):
    __tablename__ = "referalls"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String)
    doctor_id = Column(String)
    description = Column(String)
