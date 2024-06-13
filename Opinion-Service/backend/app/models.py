from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Opinion(Base):
    __tablename__ = "opinions"

    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String, nullable=False)
    doctorId = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)


# class OpinionDTO:
#     def __init__(self, id, userId, content, rating, doctorFirstname, doctorSurname, doctorSpecialty, username):
#         self.id = id
#         self.userId = userId
#         self.content = content
#         self.rating = rating
#         self.doctorFirstname = doctorFirstname
#         self.doctorSurname = doctorSurname
#         self.doctorSpecialty = doctorSpecialty
#         self.username = username

#     @staticmethod
#     def from_opinion(opinion):
#         return OpinionDTO(
#             id=opinion.id,
#             userId=opinion.userId,
#             content=opinion.content,
#             rating=opinion.rating,
#             doctorId=opinion.doctorId,
#             # doctorFirstname=doctor.firstname,
#             # doctorSurname=doctor.surname,
#             # doctorSpecialty=doctor.specialty,
#             doctorFirstname="First Name",
#             doctorSurname="Surname",
#             doctorSpecialty="Specialty",
#             username="Username"
#         )
