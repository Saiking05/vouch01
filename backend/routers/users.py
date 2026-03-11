import json
import os
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

SETTINGS_FILE = "settings_store.json"

def get_local_settings(user_id: str) -> dict:
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                data = json.load(f)
                return data.get(user_id, {})
        except:
            pass
    return {}

def save_local_settings(user_id: str, settings: dict):
    data = {}
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                data = json.load(f)
        except:
            pass
    
    current_usr = data.get(user_id, {})
    current_usr.update(settings)
    data[user_id] = current_usr

    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f, indent=4)
    return current_usr

@router.get("/{user_id}")
async def get_profile(user_id: str):
    profile = await db.get_user_profile(user_id)
    if not profile:
        profile = await db.upsert_user_profile({"id": user_id})
    local_settings = get_local_settings(user_id)
    profile.update(local_settings)
    return profile

@router.post("/{user_id}")
async def update_profile(user_id: str, profile: UserProfileUpdate):
    data = profile.dict(exclude_unset=True)
    # Filter out columns that do not exist in the database original schema
    db_data = {k: v for k, v in data.items() if k in ["id"]}
    db_data["id"] = user_id
    
    # Try updating the base user profile (id)
    updated = await db.upsert_user_profile(db_data)
    
    # Save the expanded profile fields (name, company, role, notifications) to our local store
    expanded_data = {k: v for k, v in data.items() if k not in ["id"]}
    saved_local = save_local_settings(user_id, expanded_data)
    
    updated.update(saved_local)
    return updated
