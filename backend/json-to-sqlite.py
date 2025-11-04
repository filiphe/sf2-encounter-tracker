from enum import Enum

from sqlmodel import create_engine, Field, Session, SQLModel

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

if __name__ == "__main__":
    import json

    # Load JSON data
    with open("2e.aonsrd.com-creature-data.json", "r") as f:
        creatures_data = json.load(f)

    # Create SQLite database
    engine = create_engine("sqlite:///2e.aonsrd.com-creature-data-new.db")
    SQLModel.metadata.create_all(engine)

    # Insert data into the database
    with Session(engine) as session:
        for creature_dict in creatures_data:
            creature = Creature(**creature_dict)
            session.add(creature)
        session.commit()