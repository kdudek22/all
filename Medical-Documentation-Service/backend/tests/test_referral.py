# from fastapi.testclient import TestClient
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.pool import StaticPool
# from models.referral import Referral
# from models.user import User
# from models.database import Base
# from main import app
# from routers.referral import get_db
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

# def test_get_referral():
#     db = next(override_get_db())
#     user = User(id=3, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit()
#     referral = Referral(id=4, patient_id=3, doctor_id=1, description='USG')
#     db.add(referral) 
#     db.commit()

#     response = client.get("/referrals")
#     assert response.status_code == 422
#     assert response.json() == {'detail': 
#     [{'input': None, 'loc': ['query', 'patient_id'], 'msg': 'Field required', 'type': 'missing','url': 'https://errors.pydantic.dev/2.7/v/missing'},]}

#     response = client.get('/referrals?patient_id=12321')
#     assert response.status_code == 200
#     assert response.json() == []

#     response = client.get("/referrals?patient_id=3")
#     assert response.status_code == 200
#     assert response.json() == [{'id': 4,
#                                 'patient_id': 3,
#                                 'doctor_id': 1,
#                                 'description': 'USG',}]

    
# def test_get_entry():
#     db = next(override_get_db())
#     user = User(id=5, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     referral = Referral(id=5, patient_id=5, doctor_id=1, description='USG')
#     db.add(referral) 
#     db.commit()
#     response = client.get(f"/referrals/{referral.id}")
#     assert response.status_code == 200
#     assert response.json() == {'id': 5,
#                                 'patient_id': 5,
#                                 'doctor_id': 1,
#                                 'description': 'USG'}

# def test_post_entry():
#     db = next(override_get_db())
#     user = User(id=6, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     response = client.post("/referral", json={
#         "patient_id": 6,
#         "doctor_id": 1,
#         "description": "USG"
#     })
#     assert response.status_code == 200
    
# def test_delete_entry():
#     db = next(override_get_db())
#     user = User(id=7, first_name="Test", last_name="User")
#     db.add(user)
#     db.commit() 
#     referral = Referral(id=7, patient_id=7, doctor_id=1, description='USG')
#     db.add(referral) 
#     db.commit()
#     response = client.delete(f"/referral/{referral.id}")
#     assert response.status_code == 200
#     assert response.json() == {'id': 7,
#                                 'patient_id': 7,
#                                 'doctor_id': 1,
#                                 'description': 'USG'}
#     response = client.delete(f"/referral/{referral.id}")
#     assert response.status_code == 404
#     assert response.json() == {'detail': 'Referral not found'}