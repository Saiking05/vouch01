"""
AI routes — brief generation, ROI prediction, report generation
"""
from fastapi import APIRouter, HTTPException
from models.schemas import BriefRequest, BriefResponse
from services import supabase_service as db
from services import ai_service as ai
from datetime import datetime

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.post("/brief")
async def generate_brief(req: BriefRequest):
    """Generate an AI marketing brief using real influencer data + Groq"""
    profile = await db.get_influencer(req.influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    brief_content = await ai.generate_brief(
        influencer=profile,
        brand_name=req.brand_name,
        campaign_objective=req.campaign_objective,
        brand_niche=req.brand_niche or "",
        budget=req.budget,
    )
    
    # Save the report to database
    # Note: user_id must be a valid UUID. Using a dummy one for system reports.
    SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000"
    
    report_data_obj = {
        "type": "brief",
        "brief": brief_content,
        "campaign_objective": req.campaign_objective,
        "brand_name": req.brand_name,
        "match_score": profile.get("match_score", 0),
    }

    report = await db.save_report({
        "user_id": SYSTEM_USER_ID,
        "influencer_id": req.influencer_id,
        "name": f"{profile.get('name', 'Unknown')} x {req.brand_name} — Marketing Brief",
        "report_data": report_data_obj,
    })
    
    return {
        "brief": brief_content,
        "influencer_name": profile.get("name", ""),
        "match_score": profile.get("match_score", 0),
        "generated_at": datetime.utcnow().isoformat(),
        "report_id": report.get("id"),
    }


@router.post("/roi/{influencer_id}")
async def predict_roi(influencer_id: str, budget: float = 0):
    """Predict ROI for a campaign with this influencer"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    result = await ai.predict_roi(profile, budget)
    return result


@router.post("/analyze-comments")
async def analyze_comments(influencer_id: str):
    """Run sentiment analysis on real comments"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    # Fetch fresh comments
    from services import social_service as social
    handle = profile.get("handle", "").replace("@", "")
    platform = profile.get("platform", "instagram")
    
    comments = await social.fetch_comments(handle, platform)
    
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found")
    
    sentiment = await ai.analyze_sentiment(comments, profile.get("name", ""))
    
    # Save to DB
    await db.save_sentiment(influencer_id, sentiment)
    
    return sentiment


@router.post("/generate-report")
async def generate_report(influencer_id: str, report_type: str = "full_analysis"):
    """Generate a comprehensive AI analysis report for an influencer"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    report_data = await ai.generate_report(profile, report_type)
    
    # Save to database
    SYSTEM_USER_ID = "00000000-0000-0000-0000-000000000000"
    
    saved_report = await db.save_report({
        "user_id": SYSTEM_USER_ID,
        "influencer_id": influencer_id,
        "name": report_data.get("title", f"{profile.get('name', 'Unknown')} — {report_type.replace('_', ' ').title()}"),
        "report_data": {
            **report_data,
            "type": report_type,
        }
    })
    
    return {
        **report_data,
        "id": saved_report.get("id"),
        "influencer_name": profile.get("name", ""),
        "influencer_handle": profile.get("handle", ""),
        "generated_at": datetime.utcnow().isoformat(),
    }


@router.get("/reports")
async def get_reports():
    """Get all generated reports from the database"""
    reports = await db.get_reports()
    return {"reports": reports}


@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    """Get a specific report by ID"""
    report = await db.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/activity")
async def get_activity_feed(limit: int = 20):
    """Get recent activity/notifications"""
    activities = await db.get_activity_feed(limit)
    return {"activities": activities}


@router.get("/market-rates/{influencer_id}")
async def get_market_rates(influencer_id: str):
    """Get estimated market rates for an influencer"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    rates = await ai.estimate_market_rates(profile)
    return rates


@router.post("/outreach-hook/{influencer_id}")
async def get_outreach_hook(influencer_id: str, brand_name: str = "Our Brand"):
    """Generate a personalized outreach hook"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    hook = await ai.generate_outreach_hook(profile, brand_name)
    return hook


@router.post("/content-audit/{influencer_id}")
async def run_content_audit(influencer_id: str):
    """Run a deep brand safety audit on recent content"""
    profile = await db.get_influencer(influencer_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Influencer not found")
    
    # Get recent posts for captions
    recent_posts = profile.get("recent_posts", [])
    captions = []
    for post in recent_posts:
        if isinstance(post, dict):
            cap = post.get("caption", post.get("text", ""))
            if cap: captions.append(cap)
        elif isinstance(post, str):
            captions.append(post)
            
    audit_results = await ai.audit_content_safety(captions)
    return audit_results
