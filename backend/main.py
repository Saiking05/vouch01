"""
Vouch — FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import influencers, ai_routes, payments, users

load_dotenv()

app = FastAPI(
    title="Vouch API",
    description="The Truth Engine for Influencer Marketing Backend",
    version="1.0.0",
)

# CORS — allow everything for development to avoid fetch errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(influencers.router)
app.include_router(ai_routes.router)
app.include_router(payments.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {
        "name": "Vouch API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
