"""
Documentation Routes for DowUrk AI
Serves markdown documentation files
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from pathlib import Path

router = APIRouter(prefix="/api/docs", tags=["documentation"])

DOCS_DIR = Path(__file__).parent.parent  # /app directory

AVAILABLE_DOCS = {
    'DOWURK_STRATEGIC_RESOURCES.md': 'Master strategic resources guide',
    'FUNDRAISING_STRATEGY.md': 'Complete fundraising strategy',
    'SECURITY_IMPLEMENTATION_GUIDE.md': 'Security implementation guide',
    'COMPETITIVE_ANALYSIS_FRAMEWORK.md': 'Competitive analysis',
    'METRICS_DASHBOARD_GUIDE.md': 'Metrics dashboard guide',
    'MVP_ROADMAP.md': 'MVP 8-week roadmap',
    'OPTIONS_1234_IMPLEMENTATION.md': 'Implementation guide',
    'IMPLEMENTATION_COMPLETE.md': 'Implementation status'
}

@router.get("/")
async def list_docs():
    """List all available documentation files"""
    return {
        "available_docs": [
            {
                "filename": filename,
                "description": desc,
                "url": f"/docs/{filename}"
            }
            for filename, desc in AVAILABLE_DOCS.items()
        ]
    }

@router.get("/{filename}", response_class=PlainTextResponse)
async def get_doc(filename: str):
    """Get documentation file content"""
    
    if filename not in AVAILABLE_DOCS:
        raise HTTPException(status_code=404, detail="Documentation file not found")
    
    doc_path = DOCS_DIR / filename
    
    if not doc_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    try:
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
