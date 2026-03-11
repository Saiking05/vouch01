import sys
sys.path.append("d:/aiinfluencer/backend")

import asyncio
from services import ai_service as ai
from services import supabase_service as db
import traceback

async def run():
    try:
        profile = await db.get_influencer("inf_01JN3Q8X8C06K42YFT1T13Z5H4")
        if profile:
            res = await ai.predict_live_analytics(profile)
            print("Success!")
            with open("success.log", "w") as f:
                f.write(str(res))
    except Exception as e:
        with open("error.log", "w") as f:
            traceback.print_exc(file=f)

if __name__ == "__main__":
    asyncio.run(run())
