import sys
import asyncio
sys.path.append("d:/aiinfluencer/backend")

from services import ai_service as ai
from services import supabase_service as db

async def run():
    profiles = await db.get_all_influencers(limit=1)
    if not profiles:
        print("No profiles")
        return
    profile = profiles[0]
    print(f"Testing profile: {profile['handle']} ID: {profile['id']}")
    try:
        res = await ai.predict_live_analytics(profile)
        print("Success:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run())
