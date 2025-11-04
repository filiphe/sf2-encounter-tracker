from enum import Enum
from typing import Annotated

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import create_engine, Field, Session, SQLModel, select


class Rarity(Enum):
    Common = "common"
    Uncommon = "uncommon"
    Rare = "rare"
    Unique = "unique"

class Size(Enum):
    Tiny = "tiny"
    Small = "small"
    Medium = "medium"
    Large = "large"
    Huge = "huge"
    Gargantuan = "gargantuan"

class Creature(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    source: str
    rarity: Rarity
    size: Size
    trait: str
    level: int
    hp: str
    ac: str
    fortitude: str
    reflex: str
    will: str
    sense: str
    speed: str
    spoilers: str

class CreatureFilter(BaseModel):
    max_level: int = Field(25, ge=-1, lt=26)
    min_level: int = Field(-1, ge=-1, lt=26)
    name: str = Field("", min_length=0, max_length=100)
    limit: int = Field(100, gt=0, le=100)
    offset: int = Field(0, ge=0)

sqlite_file_name = "2e.aonsrd.com-creature-data-new.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/creatures/")
def read_creatures(
    session: SessionDep,
    filter_query: Annotated[CreatureFilter, Query()] = None,
) -> list[Creature]:
    creatures = session.exec(select(Creature)
                             .where(Creature.name.contains(filter_query.name))
                             .where(Creature.level <= filter_query.max_level)
                             .where(Creature.level >= filter_query.min_level)
                             .offset(filter_query.offset).limit(filter_query.limit)).all()
    return creatures

@app.get("/creatures/{creature_id}")
def read_creature(creature_id: int, session: SessionDep) -> Creature:
    creature = session.get(Creature, creature_id)
    if not creature:
        raise HTTPException(status_code=404, detail="Creature not found")
    return creature

@app.post("/creatures/")
def create_creature(creature: Creature, session: SessionDep) -> Creature:
    session.add(creature)
    session.commit()
    session.refresh(creature)
    return creature

@app.delete("/creatures/{creature_id}")
def delete_creature(creature_id: int, session: SessionDep):
    creature = session.get(Creature, creature_id)
    if not creature:
        raise HTTPException(status_code=404, detail="Creature not found")
    session.delete(creature)
    session.commit()
    return {"ok": True}