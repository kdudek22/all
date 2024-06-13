from fastapi import APIRouter, Depends, Header, HTTPException
from models.database import SessionLocal
from sqlalchemy.orm import Session, joinedload
import models.prescription as model
from models.drug import Drug
import schemas.prescription as schema
from schemas.new_prescription import NewPrescription

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/prescriptions")
async def get_prescription(patient_id: str, db: Session = Depends(get_db)):
    response = db.query(model.Prescription).filter(model.Prescription.patient_id == patient_id).all()
    return response
    
@router.get("/prescriptions/{prescription_id}")
async def get_prescription(prescription_id: int, db: Session = Depends(get_db)):
    prescription = db.query(model.Prescription).filter(model.Prescription.id == prescription_id).first()
    if prescription is None:
        raise HTTPException(status_code=404, detail="Presription not found")
    return prescription


@router.post("/prescriptions")
async def add_prescription(prescription: NewPrescription, db: Session = Depends(get_db)):
    drug_id = db.query(Drug).filter(Drug.name == prescription.drug_name).first().id
    entry = model.Prescription(
        patient_id=prescription.patient_id,
        doctor_id=prescription.doctor_id,
        drug_id=drug_id,
        description=prescription.description
    )
    db.add(entry)
    db.commit()
    return entry


@router.delete("/prescriptions/{prescription_id}")
async def remove_presription(prescription_id: int, db: Session = Depends(get_db)):
    prescription = db.query(model.Prescription).filter(model.Prescription.id == prescription_id).first()
    if prescription is None:
        raise HTTPException(status_code=404, detail="Prescription not found")
    else:
        db.delete(prescription)
        db.commit()
        return prescription