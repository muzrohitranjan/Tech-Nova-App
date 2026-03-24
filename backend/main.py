from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from app.database import get_service_client

app = FastAPI()


class RecipeCreate(BaseModel):
    user_id: str = Field(..., description="Supabase auth user id (UUID)")
    title: str
    description: Optional[str] = None
    cuisine: Optional[str] = None


@app.get("/")
def root():
    return {"message": "Backend running successfully"}


@app.post("/recipes")
def create_recipe(payload: RecipeCreate):
    client = get_service_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    data = {
        "user_id": payload.user_id,
        "title": payload.title,
        "description": payload.description,
        "cuisine": payload.cuisine,
    }

    res = client.table("recipes").insert(data).execute()
    if res.error:
        raise HTTPException(status_code=400, detail=str(res.error))
    return res.data


@app.get("/recipes")
def list_recipes(limit: int = 20):
    client = get_service_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    res = client.table("recipes").select("*").limit(limit).execute()
    if res.error:
        raise HTTPException(status_code=400, detail=str(res.error))
    return res.data