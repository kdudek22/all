from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Dict
from app import models, schemas, database

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

DOCTORS_MOCKED = [
    {"id": 1, "firstname": 'John', "surname": 'Doe', "specialty": 'Cardiologist'},
    {"id": 2, "firstname": 'Jane', "surname": 'Doe', "specialty": 'Dermatologist'},
    {"id": 3, "firstname": 'Alice', "surname": 'Smith', "specialty": 'Pediatrician'},
    {"id": 4, "firstname": 'Bob', "surname": 'Brown', "specialty": 'Gynecologist'},
    {"id": 5, "firstname": 'Charlie', "surname": 'White', "specialty": 'Ophthalmologist'},
    {"id": 6, "firstname": 'David', "surname": 'Black', "specialty": 'Orthopedist'}
]

def find_mocked_doctor(doctorId):
    for doctor in DOCTORS_MOCKED:
        if doctor['id'] == doctorId:
            return schemas.DoctorDTO(**doctor)
    return None

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/opinions/", response_model=schemas.NewOpinion)
def create_opinion(opinion: schemas.OpinionCreate, db: Session = Depends(get_db)):
    db_opinion = models.Opinion(**opinion.model_dump())
    db.add(db_opinion)
    db.commit()
    db.refresh(db_opinion)
    return db_opinion

@app.get("/opinions/", response_model=schemas.OpinionsWithPage)  # Update the response model to OpinionDTO
def read_opinions(doctorId: str | None = None, minRating: int = 1, maxRating: int = 5, 
                           page: int = 1, pageSize: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * pageSize
    query = db.query(models.Opinion)
    if doctorId is not None:
        query = query.filter(models.Opinion.doctorId == doctorId)
        # doctor = find_mocked_doctor(doctorId)
        # if not doctor:
        #     raise HTTPException(status_code=404, detail="Doctor not found")
        doctor = None
    else:
        doctor = None

    query = query.filter(models.Opinion.rating >= minRating,
                         models.Opinion.rating <= maxRating)
    total_count = query.count()
    opinions = query.offset(skip).limit(pageSize).all()
    total_pages = (total_count + pageSize - 1) // pageSize  # Calculate total pages

    # Convert each Opinion to OpinionDTO
    # if doctor is not None:
    #     opinion_dtos = [schemas.OpinionDTO.from_opinion(opinion, doctor) for opinion in opinions]  # Assuming user is fetched correctly
    # else:
    #     opinion_dtos = [schemas.OpinionDTO.from_opinion(opinion, find_mocked_doctor(opinion.doctorId)) for opinion in opinions]  # Assuming user is fetched correctly
    #opinions_dtos_base = [schemas.OpinionBase.from_opinion(opinion) for opinion in opinions]
    opinions_dtos_base = [schemas.NewOpinion.from_orm(opinion) for opinion in opinions]
    return schemas.OpinionsWithPage(total_pages=total_pages, opinions=opinions_dtos_base)

@app.delete("/opinions/{opinion_id}")
def delete_opinion(opinion_id: int, db: Session = Depends(get_db)):
    opinion = db.query(models.Opinion).filter(models.Opinion.id == opinion_id).first()

    if opinion is None:
        raise HTTPException(status_code=404, detail="Opinion not found")
    
    db.delete(opinion)
    db.commit()
    return opinion

@app.put("/opinions/{opinion_id}", response_model=schemas.OpinionBase)
def update_opinion(opinion_id: int, updated_opinion: schemas.OpinionCreate, db: Session = Depends(get_db)):
    opinion = db.query(models.Opinion).filter(models.Opinion.id == opinion_id).first()

    if opinion is None:
        raise HTTPException(status_code=404, detail="Opinion not found")
    
    for key, value in updated_opinion.dict().items():
        setattr(opinion, key, value)
        
    db.commit()
    db.refresh(opinion)
    return opinion

# @app.get("/doctors/", response_model=List[schemas.DoctorDTO])
# def get_mocked_doctors():
#     # This is a mocked list of doctors for demonstration purposes
#     mocked_doctors = [
#         schemas.DoctorDTO(**doctor) for doctor in DOCTORS_MOCKED
#     ]
#     return mocked_doctors



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
