from pydantic import BaseModel


class Drug(BaseModel):
    """Class represents the schema of a drug.

    Attributes:
        name: name of the drug
    """

    name:str

    class Config:
        orm_mode = True
