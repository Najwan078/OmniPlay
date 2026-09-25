"""
OmniPlay Cloud Computing Ecosystem - FastAPI Backend
Core service for Steam Web API Proxy, Dynamic Rental Pricing, and Analytics Export
"""

import sys
import json
import time
from typing import Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

app = FastAPI(
    title="OmniPlay Cloud Computing Backend",
    version="2.0.0",
    description="Core backend for Steam Integration, Dynamic Rental Calculation, Cloud Node Orchestration, and Analytics Export"
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API Router
api_router = APIRouter(prefix="/api")

# --- In-Memory Steam Catalog Database ---
STEAM_CATALOG = {
    2669320: {
        "app_id": 2669320,
        "title": "EA SPORTS FC 25",
        "genre": "Sports",
        "synopsis": "Experience unrivaled realism in EA SPORTS FC™ 25, powered by HyperMotionV and volumetric motion capture.",
        "review_summary": "Very Positive (82% positive)",
        "rating_score": 82,
        "developer": "EA Canada",
        "publisher": "Electronic Arts",
        "tags": ["Football", "Sports", "Simulation", "Multiplayer"],
        "steam_store_url": "https://store.steampowered.com/app/2669320/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/library_hero.jpg"
    },
    1091500: {
        "app_id": 1091500,
        "title": "Cyberpunk 2077",
        "genre": "RPG",
        "synopsis": "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City with full path tracing.",
        "review_summary": "Overwhelmingly Positive (92% positive)",
        "rating_score": 92,
        "developer": "CD PROJEKT RED",
        "publisher": "CD PROJEKT RED",
        "tags": ["Cyberpunk", "Open World", "RPG", "Ray Tracing"],
        "steam_store_url": "https://store.steampowered.com/app/1091500/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg"
    },
    2182340: {
        "app_id": 2182340,
        "title": "Valorant",
        "genre": "Tactical Shooter",
        "synopsis": "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities with sub-2ms input latency.",
        "review_summary": "Very Positive (94% positive)",
        "rating_score": 94,
        "developer": "Riot Games",
        "publisher": "Riot Games",
        "tags": ["Tactical", "FPS", "Competitive", "Multiplayer"],
        "steam_store_url": "https://store.steampowered.com/app/2182340/",
        "header_image": "/valorant.jpg",
        "banner_image": "/valorant.jpg"
    },
    2358720: {
        "app_id": 2358720,
        "title": "Black Myth: Wukong",
        "genre": "Action RPG",
        "synopsis": "Step into the legendary journey of the Destined One powered by Unreal Engine 5 Nanite and Lumen.",
        "review_summary": "Overwhelmingly Positive (95% positive)",
        "rating_score": 95,
        "developer": "Game Science",
        "publisher": "Game Science",
        "tags": ["Mythology", "Action RPG", "Souls-like", "Difficult"],
        "steam_store_url": "https://store.steampowered.com/app/2358720/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg"
    },
    1234567: {
        "app_id": 1234567,
        "title": "Meccha Chameleon",
        "genre": "Indie / Action",
        "synopsis": "The breakout viral sensation of 2026! Play as an ultra-adaptive robotic chameleon with high-speed color camouflaging and tongue-grapple physics across chaotic neon arenas.",
        "review_summary": "Overwhelmingly Positive (98% positive)",
        "rating_score": 98,
        "developer": "Chameleon Labs",
        "publisher": "Neon Indies",
        "tags": ["Viral Sensation", "Action", "Indie", "Physics", "Multiplayer"],
        "steam_store_url": "https://store.steampowered.com/app/1234567/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1234567/library_600x900.jpg",
        "banner_image": "/meccha_chameleon.jpg"
    },
    1623730: {
        "app_id": 1623730,
        "title": "Palworld",
        "genre": "Action RPG / Multiplayer",
        "synopsis": "Fight, farm, build and work alongside mysterious creatures called 'Pals' in this completely new multiplayer, open-world survival crafting game.",
        "review_summary": "Very Positive (93% positive)",
        "rating_score": 93,
        "developer": "Pocketpair",
        "publisher": "Pocketpair",
        "tags": ["Open World", "Creature Collector", "Survival", "Crafting", "Multiplayer"],
        "steam_store_url": "https://store.steampowered.com/app/1623730/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_hero.jpg"
    },
    1085660: {
        "app_id": 1085660,
        "title": "Destiny 2",
        "genre": "Action MMO",
        "synopsis": "Dive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat in the Final Shape expansion era.",
        "review_summary": "Very Positive (84% positive)",
        "rating_score": 84,
        "developer": "Bungie",
        "publisher": "Bungie",
        "tags": ["Action MMO", "FPS", "Looter Shooter", "Co-op", "Sci-Fi"],
        "steam_store_url": "https://store.steampowered.com/app/1085660/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_hero.jpg"
    },
    292030: {
        "app_id": 292030,
        "title": "The Witcher 3: Wild Hunt",
        "genre": "RPG",
        "synopsis": "You are Geralt of Rivia, mercenary monster slayer. As war rages, track down the Child of Prophecy in the enhanced Next-Gen visual update.",
        "review_summary": "Overwhelmingly Positive (97% positive)",
        "rating_score": 97,
        "developer": "CD PROJEKT RED",
        "publisher": "CD PROJEKT RED",
        "tags": ["RPG", "Open World", "Story Rich", "Masterpiece", "Fantasy"],
        "steam_store_url": "https://store.steampowered.com/app/292030/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_hero.jpg"
    },
    814380: {
        "app_id": 814380,
        "title": "Sekiro: Shadows Die Twice",
        "genre": "Action",
        "synopsis": "Carve your own clever path to vengeance in this critically acclaimed adventure from developer FromSoftware, creators of Bloodborne and Dark Souls.",
        "review_summary": "Overwhelmingly Positive (95% positive)",
        "rating_score": 95,
        "developer": "FromSoftware",
        "publisher": "Activision",
        "tags": ["Souls-like", "Action", "Difficult", "Ninja", "Singleplayer"],
        "steam_store_url": "https://store.steampowered.com/app/814380/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_hero.jpg"
    },
    9999992: {
        "app_id": 9999992,
        "title": "Windrose",
        "genre": "Indie RPG",
        "synopsis": "The critically acclaimed 2026 breakout indie RPG. Sail across the windswept celestial archipelagos, master elemental navigation spells, and forge a living legacy.",
        "review_summary": "Overwhelmingly Positive (96% positive)",
        "rating_score": 96,
        "developer": "Aetheria Studios",
        "publisher": "Celestial Works",
        "tags": ["Indie RPG", "Exploration", "Story Rich", "Atmospheric", "Magic"],
        "steam_store_url": "https://store.steampowered.com/app/9999992/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/9999992/library_600x900.jpg",
        "banner_image": "/windrose.jpg"
    },
    641990: {
        "app_id": 641990,
        "title": "The Escapists 2",
        "genre": "Strategy",
        "synopsis": "Risk it all to breakout from the toughest prisons in the world. Explore the biggest prisons yet, with multiple floors, roofs, vents and underground tunnels!",
        "review_summary": "Very Positive (90% positive)",
        "rating_score": 90,
        "developer": "Mouldy Toof Studios",
        "publisher": "Team17",
        "tags": ["Strategy", "Multiplayer", "Pixel Graphics", "Co-op", "Funny"],
        "steam_store_url": "https://store.steampowered.com/app/641990/",
        "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_600x900.jpg",
        "banner_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_hero.jpg"
    }
}

NODE_SPECS = {
    "JK-01": {"name": "Jakarta Edge (JK-01)", "tier": "Tier 1", "gpu": "RTX 4070 Ti", "latency": "2ms", "rate_per_hr": 10000, "multiplier": 1.0},
    "SG-01": {"name": "Singapore Premium (SG-01)", "tier": "Tier 2", "gpu": "RTX 4080", "latency": "15ms", "rate_per_hr": 16000, "multiplier": 1.0},
    "TY-01": {"name": "Tokyo Ultra (TY-01)", "tier": "Tier 3", "gpu": "RTX 4090", "latency": "60ms", "rate_per_hr": 25000, "multiplier": 1.0}
}

# --- Pydantic Models ---
class RentalCalculationRequest(BaseModel):
    game_id: int
    game_title: str
    app_id: int
    duration_hours: int
    node_id: str
    user_id: Optional[str] = "player_1"

class RentalCalculationResponse(BaseModel):
    base_rate_per_hour: int
    duration_hours: int
    node_id: str
    node_multiplier: float
    subtotal: int
    platform_fee: int
    total_price: int
    currency: str
    steam_uri: str
    estimated_fps: int
    max_resolution: str

class CloudSessionRequest(BaseModel):
    game_id: int
    app_id: int
    duration_hours: int
    node_id: str
    user_id: str

# --- Endpoints ---

@app.get("/")
def health_check():
    return {
        "service": "OmniPlay Cloud Computing Backend",
        "status": "online",
        "version": "2.0.0",
        "timestamp": time.time()
    }

# 1. Steam API Integration Endpoints
@api_router.get("/steam/details")
def get_steam_details(app_id: Optional[int] = 2669320):
    """
    Fetch game metadata simulating Steam Web API appdetails.
    Query parameter: ?app_id=...
    """
    game = STEAM_CATALOG.get(app_id)
    if not game:
        return {
            "app_id": app_id,
            "title": f"Steam Title #{app_id}",
            "synopsis": "Verified Steam Cloud Gaming Title optimized for OmniPlay streaming.",
            "review_summary": "Very Positive (88% positive)",
            "developer": "Valve Certified Partner",
            "publisher": "Steam Partner",
            "tags": ["Cloud Gaming", "Action", "Ready to Stream"],
            "steam_store_url": f"https://store.steampowered.com/app/{app_id}/",
            "header_image": f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg",
            "steam_uri": f"steam://rungameid/{app_id}"
        }
    
    response = dict(game)
    response["steam_uri"] = f"steam://rungameid/{app_id}"
    return response

@api_router.get("/steam/game/{app_id}")
def get_steam_game_by_path(app_id: int):
    """Path-based Steam game details endpoint"""
    return get_steam_details(app_id=app_id)

# 2. Data Export Endpoints
@api_router.get("/export")
@api_router.get("/analytics/export")
def export_analytics_data(format: str = Query("json", pattern="^(pdf|json)$")):
    """
    Export Feature Endpoint: strictly supports 'pdf' or 'json'
    Query parameter: ?format=pdf or ?format=json
    """
    analytics_payload = {
        "report": "OmniPlay Cloud Infrastructure & Performance Analytics Audit",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "system_health": {
            "uptime": "99.994%",
            "avg_session_latency_ms": 3.8,
            "packet_loss_rate": "0.001%",
            "peak_concurrent_streams": 1420
        },
        "edge_nodes": [
            {"node": "JK-01", "location": "Jakarta", "gpu": "RTX 4070 Ti", "utilization": "84%", "active_sessions": 32},
            {"node": "SG-01", "location": "Singapore", "gpu": "RTX 4080", "utilization": "78%", "active_sessions": 24},
            {"node": "TY-01", "location": "Tokyo", "gpu": "RTX 4090", "utilization": "62%", "active_sessions": 18}
        ],
        "compliance": "PRD 2.0.0 Verified",
        "single_export_button_rule": "Enforced"
    }

    if format.lower() == "pdf":
        mock_pdf_content = (
            b"%PDF-1.4\n1 0 obj\n<< /Title (OmniPlay Analytics Report) /Creator (OmniPlay Backend) >>\n"
            b"endobj\nstream\nOmniPlay Cloud Computing - Performance & Fleet Audit 2026\nendstream\n%%EOF"
        )
        return Response(
            content=mock_pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=omniplay_analytics_report.pdf"}
        )
    
    return JSONResponse(
        content=analytics_payload,
        headers={"Content-Disposition": "attachment; filename=omniplay_analytics.json"}
    )

# 3. Dynamic Rental Pricing Calculation
@api_router.post("/rental/calculate", response_model=RentalCalculationResponse)
def calculate_rental_price(req: RentalCalculationRequest):
    """
    PRD Section 2.1: Dynamic Pricing Formula
    Base Rate x Duration (1-5 hours) x Node Multiplier + Platform Fee
    """
    if req.duration_hours < 1 or req.duration_hours > 5:
        raise HTTPException(status_code=400, detail="Rental duration must be between 1 and 5 hours.")
    
    node = NODE_SPECS.get(req.node_id, NODE_SPECS["JK-01"])
    base_rate = node["rate_per_hr"]
    multiplier = node["multiplier"]
    
    subtotal = int(base_rate * req.duration_hours * multiplier)
    platform_fee = 2500
    total_price = subtotal + platform_fee
    
    return RentalCalculationResponse(
        base_rate_per_hour=base_rate,
        duration_hours=req.duration_hours,
        node_id=req.node_id,
        node_multiplier=multiplier,
        subtotal=subtotal,
        platform_fee=platform_fee,
        total_price=total_price,
        currency="IDR",
        steam_uri=f"steam://rungameid/{req.app_id}",
        estimated_fps=120 if multiplier >= 1.0 else 90,
        max_resolution="4K HDR" if multiplier >= 1.0 else "1440p"
    )

@api_router.post("/rental/session/start")
def start_rental_session(req: CloudSessionRequest):
    """Allocate Cloud Instance & return Steam Deep-Link URI"""
    node = NODE_SPECS.get(req.node_id, NODE_SPECS["JK-01"])
    session_id = f"omni-sess-{int(time.time())}-{req.app_id}"
    
    return {
        "session_id": session_id,
        "status": "ALLOCATED",
        "node": node["name"],
        "allocated_gpu": node["gpu"],
        "duration_hours": req.duration_hours,
        "steam_deeplink": f"steam://rungameid/{req.app_id}",
        "webrtc_stream_url": f"wss://stream.omniplay.cloud/v1/{session_id}",
        "started_at": time.time(),
        "expires_in_seconds": req.duration_hours * 3600
    }

# 4. Secure Authentication & Session Endpoints
class LoginPayload(BaseModel):
    nickname: str
    password: Optional[str] = None
    role: Optional[str] = "user"

@api_router.post("/auth/login")
def login(payload: LoginPayload, response: Response):
    """
    Issue secure HttpOnly session cookie containing simulated JWT token.
    Prevents XSS extraction via JavaScript.
    """
    clean_nickname = payload.nickname.strip() if payload.nickname else "Player1"
    role = "admin" if payload.role == "admin" else "user"
    token = f"omni_sec_jwt_{role}_{int(time.time())}"
    
    # Set HttpOnly Cookie (secure=False for local development, True for production HTTPS)
    response.set_cookie(
        key="omni_access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=86400
    )
    
    return {
        "success": True,
        "user": {
            "nickname": clean_nickname,
            "role": role,
            "tier": "Root Security / Level 5" if role == "admin" else "Tier 1 Operator"
        },
        "message": f"Session established for {clean_nickname}"
    }

@api_router.post("/auth/logout")
def logout(response: Response):
    """Clears the HttpOnly JWT session cookie"""
    response.delete_cookie(key="omni_access_token", httponly=True, samesite="lax")
    return {"success": True, "message": "Logged out successfully"}

@api_router.get("/auth/me")
def get_current_user(request: Request):
    """Inspects HttpOnly cookie; returns 401 if missing/invalid"""
    token = request.cookies.get("omni_access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Session expired or token missing")
    
    role = "admin" if "admin" in token else "user"
    return {
        "nickname": "Admin" if role == "admin" else "Player1",
        "role": role,
        "tier": "Root Security / Level 5" if role == "admin" else "Tier 1 Operator"
    }

# Register API Router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
