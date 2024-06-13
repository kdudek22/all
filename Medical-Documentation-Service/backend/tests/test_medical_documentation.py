# from fastapi.testclient import TestClient
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.pool import StaticPool
# from models.medical_documentation import MedicalDocumentation, MedicalDocumentationEntry
# from models.database import Base
# from main import app
# from routers.medical_documentation import get_db, create_medical_documentation_if_not_exists
# from unittest.mock import ANY

# SQLALCHEMY_DATABASE_URL = 'sqlite:///:memory:'

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL,
#     connect_args={"check_same_thread": False},
#     poolclass=StaticPool,
# )
# TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base.metadata.create_all(bind=engine)


# def override_get_db():
#     try:
#         db = TestingSessionLocal()
#         yield db
#     finally:
#         db.rollback()
#         db.close()


# app.dependency_overrides[get_db] = override_get_db

# client = TestClient(app)

# async def test_create_medical_documentation_if_not_exists():
#     db = next(override_get_db())
#     user = User(id=2, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     assert db.query(MedicalDocumentation).filter(MedicalDocumentation.patient_id == user.id).first() is None
#     medical_documentation = await create_medical_documentation_if_not_exists(db, user.id)
#     assert isinstance(medical_documentation, MedicalDocumentation)
#     assert medical_documentation.patient_id == 2

# async def test_get_medical_documentation():
#     db = next(override_get_db())
#     user = User(id=3, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     response = client.get("/medical_documentation")
#     assert response.status_code == 400
#     assert response.json() == {'detail': 'ID not provided'}
#     response = client.get("/medical_documentation?user_id=12323")
#     assert response.status_code == 404
#     assert response.json() == {'detail': 'User not found'}
#     await create_medical_documentation_if_not_exists(db, user.id)
#     response = client.get("/medical_documentation?user_id=3")
#     assert response.status_code == 200
    
# def test_get_entry():
#     db = next(override_get_db())
#     user = User(id=5, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     medical_documentation = MedicalDocumentation(patient_id=5)
#     db.add(medical_documentation)
#     db.commit()
#     entry = MedicalDocumentationEntry(medical_documentation_id=medical_documentation.id, date="2021-01-01", diagnose="Test", recommendations="Test")
#     db.add(entry)
#     db.commit()
#     response = client.get(f"/medical_documentation/{entry.id}")
#     assert response.status_code == 200

# def test_post_entry():
#     db = next(override_get_db())
#     user = User(id=6, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     response = client.post("/medical_documentation/medical_documentation_entry", headers={"user_id": "6"}, json={"date": "2021-01-01", "diagnose": "Test", "recommendations": "Test"})
#     print(response.json())
#     assert response.status_code == 200
#     assert response.json() == {'date': '2021-01-01', 'diagnose': 'Test', 'id': 1, 'medical_documentation_id': 1, 'recommendations': 'Test'}
    
# def test_delete_entry():
#     db = next(override_get_db())
#     user = User(id=7, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     medical_documentation = MedicalDocumentation(patient_id=7)
#     db.add(medical_documentation)
#     db.commit()
#     entry = MedicalDocumentationEntry(medical_documentation_id=medical_documentation.id, date="2021-01-01", diagnose="Test", recommendations="Test")
#     db.add(entry)
#     db.commit()
#     response = client.delete(f"/medical_documentation/medical_documentation_entry/{entry.id}")
#     assert response.status_code == 200
#     assert response.json() == {'date': '2021-01-01', 'diagnose': 'Test', 'id': ANY, 'medical_documentation_id': ANY, 'recommendations': 'Test'}
#     response = client.delete(f"/medical_documentation/medical_documentation_entry/{entry.id}")
#     assert response.status_code == 404
#     assert response.json() == {'detail': 'Entry not found'}