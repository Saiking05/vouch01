import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def check():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    sb = create_client(url, key)
    
    # Check if we can select from user_profiles
    try:
        res = sb.table("user_profiles").select("*").limit(1).execute()
        print(f"Table user_profiles exists. Count: {len(res.data)}")
    except Exception as e:
        print(f"Error checking user_profiles: {e}")

if __name__ == "__main__":
    check()
