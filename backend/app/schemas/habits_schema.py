from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.habits import AlcoholFrequency, ExerciseLevel


class HabitBase(BaseModel):
    fuma: Optional[bool] = False
    consume_alcohol: Optional[AlcoholFrequency] = AlcoholFrequency.nunca
    nivel_ejercicio: Optional[ExerciseLevel] = ExerciseLevel.sedentario
    tipo_dieta: Optional[str] = None
    consume_drogas: Optional[bool] = False
    observaciones: Optional[str] = None


class HabitCreate(HabitBase):
    pass


class HabitUpdate(HabitBase):
    pass


class HabitResponse(HabitBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
