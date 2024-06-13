from fastapi import APIRouter, Depends, Header, HTTPException
from models.database import SessionLocal
from sqlalchemy.orm import Session, joinedload
import models.referral as model
import schemas.referral as schema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/referrals")
async def get_referrals(patient_id: str, db: Session = Depends(get_db)):
    response = db.query(model.Referral).filter(model.Referral.patient_id == patient_id).all()
    return response
    
@router.get("/referrals/{referral_id}")
async def get_referral(referral_id: int, db: Session = Depends(get_db)):
    referal = db.query(model.Referral).filter(model.Referral.id == referral_id).first()
    if referal is None:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referal

@router.post("/referrals")
async def add_referral(referral: schema.Referral, db: Session = Depends(get_db)):
    entry = model.Referral(**referral.model_dump())
    db.add(entry)
    db.commit()
    return entry


@router.delete("/referrals/{referral_id}")
async def remove_referral(referral_id: int, db: Session = Depends(get_db)):
    entry = db.query(model.Referral).filter(model.Referral.id == referral_id).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="Referral not found")
    else:
        db.delete(entry)
        db.commit()
        return entry