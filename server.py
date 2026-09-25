"""
OmniPlay Cloud Computing - Root Server Entrypoint
Forwards directly to backend/main.py for backwards compatibility
"""
import sys
import os

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    import uvicorn
    print("Launching OmniPlay FastAPI Backend on http://localhost:8000 ...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
