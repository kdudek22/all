from pydantic import BaseModel

class OpinionBase(BaseModel):
    userId: str
    doctorId: str
    rating: int
    content: str
    @staticmethod
    def from_opinion(opinion):
        return OpinionBase(
            id=opinion.id,
            userId=opinion.userId,
            content=opinion.content,
            rating=opinion.rating,
            doctorId=opinion.doctorId,
            # doctorFirstname=doctor.firstname,
            # doctorSurname=doctor.surname,
            # doctorSpecialty=doctor.specialty,
            # username="Username"
        )
    
class OpinionBaseWithId(OpinionBase):
    id: int

    class Config:
        orm_mode = True

class OpinionCreate(OpinionBase):
    pass

class NewOpinion(OpinionBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True

class OpinionDTO(OpinionBase):
    id: int
    doctorFirstname: str
    doctorSurname: str
    doctorSpecialty: str
    username: str

    # @staticmethod
    # def from_opinion(opinion, doctor):
    #     return OpinionBase(
    #         id=opinion.id,
    #         userId=opinion.userId,
    #         content=opinion.content,
    #         rating=opinion.rating,
    #         doctorId=opinion.doctorId,
    #         # doctorFirstname=doctor.firstname,
    #         # doctorSurname=doctor.surname,
    #         # doctorSpecialty=doctor.specialty,
    #         # username="Username"
    #     )

class OpinionsWithPage(BaseModel):
    total_pages: int
    opinions: list[NewOpinion]

class DoctorDTO(BaseModel):
    id: int
    firstname: str
    surname: str
    specialty: str