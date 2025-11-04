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
    level: int
    creature_family: str
    source: str
    rarity: Rarity
    size: Size
    trait: str
    hp: str
    hp_scale: str
    ac: str
    ac_scale: str
    fortitude: str
    fortitude_scale: str
    reflex: str
    reflex_scale: str
    will: str
    will_scale: str
    immunity: str
    resistance: str
    weakness: str
    creature_ability: str
    perception: str
    perception_scale: str
    sense: str
    speed: str
    attack_bonus:str
    attack_bonus_scale: str
    strike_damage_average: str
    strike_damage_scale: str
    spell_attack: str
    spell_attack_scale: str
    spell_dc: str
    spell_dc_scale: str
    spell: str
    language: str
    strength: str
    strength_scale: str
    dexterity: str
    dexterity_scale: str
    constitution: str
    constitution_scale: str
    intelligence: str
    intelligence_scale: str
    wisdom: str
    wisdom_scale: str
    charisma: str
    charisma_scale: str
    skill: str

if __name__ == "__main__":
    import json

    # Load JSON data
    with open("2e.aonsrd.com-creature-data-extended.json", "r") as f:
        creatures_data = json.load(f)

    # Create SQLite database
    engine = create_engine("sqlite:///2e.aonsrd.com-creature-data-extended.db")
    SQLModel.metadata.create_all(engine)

    # Insert data into the database
    with Session(engine) as session:
        for creature_dict in creatures_data:
            creature = Creature(**creature_dict)
            session.add(creature)
        session.commit()