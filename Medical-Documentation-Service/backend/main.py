from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models.medical_documentation import MedicalDocumentation, MedicalDocumentationEntry
from models.database import SessionLocal
from models.prescription import Prescription
from models.drug import Drug
from contextlib import asynccontextmanager
from routers import medical_documentation, prescription, referral, drug
from fastapi.middleware.cors import CORSMiddleware

        
async def init_db_values(db: Session):
    if db.query(Drug).first() is None:
        with open("leki.txt", "r") as file:
            for line in file:
                db.add(Drug(name=line.strip()))
            db.commit()

    # Create some initial values in the database
    if db.query(MedicalDocumentation).first() is None:
        medical_documentation = MedicalDocumentation(patient_id='a5f96fd2-a29f-4d95-bdcb-1545b59310fd')
        db.add(medical_documentation)
        db.commit()
        medical_documentation_entry = MedicalDocumentationEntry(date="2021-01-01", diagnose="Headache", recommendations="Rest", medical_documentation_id=medical_documentation.id)
        db.add(medical_documentation_entry)
        db.commit()

    if db.query(Prescription).first() is None:
        drug = db.query(Drug).filter(Drug.name.startswith('Apap')).first()
        prescription = Prescription(doctor_id='a5f96fd2-a29f-4d95-bdcb-1545b59310fd', patient_id='a5f96fd2-a29f-4d95-bdcb-1545b59310fd', drug_id=drug.id, description="Painkillers")
        db.add(prescription)
        db.commit()

    db.close()
    
        
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database
    db = SessionLocal()
    await init_db_values(db)
    yield
    # Close the database connection
    SessionLocal.close_all()

    
app = FastAPI(lifespan=lifespan)


origins = [ 
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3003",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(medical_documentation.router)
app.include_router(prescription.router)
app.include_router(referral.router)
app.include_router(drug.router)


@app.get("/")
def read_root():
    # Use the db session to interact with the database
    return {"Hello": "World"}
