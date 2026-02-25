from fastapi import APIRouter, HTTPException
from services import supabase_service as db
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["Users"])

class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    company: str | None = None
    role: str | None = None
    notifications: dict | None = None

@router.get("/{user_id}")
async def get_profile(user_id: str):
    profile = await db.get_user_profile(user_id)
    if not profile:
        # Create a default profile if not exists
        profile = await db.upsert_user_profile({"id": user_id})
    return profile

@router.post("/{user_id}")
async def update_profile(user_id: str, profile: UserProfileUpdate):
    data = profile.dict(exclude_unset=True)
    updated = await db.upsert_user_profile({"id": user_id, **data})
    return updated
