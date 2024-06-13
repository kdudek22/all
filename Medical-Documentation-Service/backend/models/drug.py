from models.database import Base
from sqlalchemy import String, Integer, Column


class Drug(Base):
    __tablename__ = "drugs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
