from pydantic import BaseModel


class ManagerUserBasic(BaseModel):
    nombre: str
    apellido: str


class ManagerMedicalResponse(BaseModel):
    usuario: ManagerUserBasic
    antecedentes: list[str]
    medicaciones: list[str]
    vacunas: list[str]
    cirugias: list[str]
