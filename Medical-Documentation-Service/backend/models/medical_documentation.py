from models.database import Base
from sqlalchemy import String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship


class MedicalDocumentation(Base):
    __tablename__ = "medical_documentation"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, nullable=False)
    medical_documentation_entries = relationship("MedicalDocumentationEntry", back_populates="medical_documentation")


class MedicalDocumentationEntry(Base):
    __tablename__ = "medical_documentation_entry"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    diagnose = Column(String, nullable=False)
    recommendations = Column(String, nullable=False)
    medical_documentation_id = Column(Integer, ForeignKey("medical_documentation.id"), nullable=False)
    medical_documentation = relationship("MedicalDocumentation", back_populates="medical_documentation_entries")