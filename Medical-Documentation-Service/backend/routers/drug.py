from fastapi import APIRouter, Depends, HTTPException
from models.database import SessionLocal
from sqlalchemy.orm import Session
from models.drug import Drug


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/drugs")
async def get_prescription(name: str = "", count: int = 5, db: Session = Depends(get_db)):
    drugs = db.query(Drug).filter(Drug.name.startswith(name)).all()
    if not drugs:
        raise HTTPException(status_code=404, detail="No drugs found with the given name.")
    if len(drugs) > count:
        return drugs[0:count]
    else:
        return drugs

@router.get("/drugs/{drug_id}")
async def get_prescription(drug_id: int, db: Session = Depends(get_db)):
    drug = db.query(Drug).filter(Drug.id == drug_id).first()
    if not drug:
        raise HTTPException(status_code=404, detail="No drug found with the given id.")
    return drug
