"""
Community Needs Assessment API Routes
Handles survey submissions, aggregation, and reporting for DowUrk Inc.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import json

router = APIRouter(prefix="/api/needs-assessment", tags=["Needs Assessment"])


class AssessmentSubmission(BaseModel):
    """Model for a community needs assessment submission."""
    answers: Dict[str, Any]
    submitted_at: Optional[str] = None
    parish: Optional[str] = None
    business_stage: Optional[str] = None


class AssessmentReport(BaseModel):
    """Model for an aggregated assessment report."""
    total_responses: int
    demographics: Dict[str, Any]
    top_challenges: List[Dict[str, Any]]
    resource_gaps: List[Dict[str, Any]]
    seven_fs_averages: Dict[str, float]
    nps_score: float
    recommendations: List[str]


# In-memory storage (replace with MongoDB in production)
submissions = []


@router.post("/submit")
async def submit_assessment(submission: AssessmentSubmission):
    """Submit a completed community needs assessment."""
    submission.submitted_at = datetime.utcnow().isoformat()

    # Extract parish and business stage from answers for indexing
    if submission.answers.get("q2"):
        submission.parish = submission.answers["q2"]
    if submission.answers.get("q3"):
        submission.business_stage = submission.answers["q3"]

    submissions.append(submission.dict())

    return {
        "status": "success",
        "message": "Thank you for completing the Community Needs Assessment. Your responses will help DowUrk better serve your community.",
        "submission_id": len(submissions),
        "submitted_at": submission.submitted_at
    }


@router.get("/report")
async def get_assessment_report():
    """Generate an aggregated report from all assessment submissions."""
    if not submissions:
        return {
            "status": "no_data",
            "message": "No assessment submissions yet.",
            "total_responses": 0
        }

    total = len(submissions)

    # Aggregate demographics
    parishes = {}
    stages = {}
    age_ranges = {}
    for sub in submissions:
        answers = sub.get("answers", {})
        parish = answers.get("q2", "Unknown")
        parishes[parish] = parishes.get(parish, 0) + 1
        stage = answers.get("q3", "Unknown")
        stages[stage] = stages.get(stage, 0) + 1
        age = answers.get("q1", "Unknown")
        age_ranges[age] = age_ranges.get(age, 0) + 1

    # Aggregate top challenges
    challenge_counts = {}
    for sub in submissions:
        challenges = sub.get("answers", {}).get("q6", [])
        for i, challenge in enumerate(challenges):
            weight = 3 - i  # First pick gets weight 3, second 2, third 1
            challenge_counts[challenge] = challenge_counts.get(challenge, 0) + weight

    top_challenges = sorted(
        [{"challenge": k, "weighted_score": v} for k, v in challenge_counts.items()],
        key=lambda x: x["weighted_score"],
        reverse=True
    )[:10]

    # Aggregate resource gaps
    gap_counts = {}
    for sub in submissions:
        gaps = sub.get("answers", {}).get("q12", [])
        for gap in gaps:
            gap_counts[gap] = gap_counts.get(gap, 0) + 1

    resource_gaps = sorted(
        [{"gap": k, "count": v, "percentage": round(v / total * 100, 1)} for k, v in gap_counts.items()],
        key=lambda x: x["count"],
        reverse=True
    )

    # Aggregate 7Fs scores
    seven_fs_labels = {
        "q14": "Faith", "q15": "Fitness", "q16": "Foundation",
        "q17": "Fashion", "q18": "Film", "q19": "Food", "q20": "Finance"
    }
    seven_fs_totals = {label: [] for label in seven_fs_labels.values()}
    for sub in submissions:
        answers = sub.get("answers", {})
        for qid, label in seven_fs_labels.items():
            if qid in answers and answers[qid]:
                seven_fs_totals[label].append(answers[qid])

    seven_fs_averages = {
        label: round(sum(scores) / len(scores), 1) if scores else 0
        for label, scores in seven_fs_totals.items()
    }

    # Calculate NPS
    nps_scores = []
    for sub in submissions:
        score = sub.get("answers", {}).get("q21")
        if score is not None:
            nps_scores.append(score)

    if nps_scores:
        promoters = sum(1 for s in nps_scores if s >= 9) / len(nps_scores) * 100
        detractors = sum(1 for s in nps_scores if s <= 6) / len(nps_scores) * 100
        nps = round(promoters - detractors, 1)
    else:
        nps = 0

    # Generate recommendations based on data
    recommendations = []
    weakest_f = min(seven_fs_averages.items(), key=lambda x: x[1]) if seven_fs_averages else None
    if weakest_f and weakest_f[1] < 5:
        recommendations.append(f"Priority: Strengthen {weakest_f[0]} programming (average score: {weakest_f[1]}/10)")
    if top_challenges:
        recommendations.append(f"Address top challenge: {top_challenges[0]['challenge']}")
    if resource_gaps:
        recommendations.append(f"Fill community gap: {resource_gaps[0]['gap']} ({resource_gaps[0]['percentage']}% of respondents)")

    return {
        "status": "success",
        "total_responses": total,
        "demographics": {
            "parishes": parishes,
            "business_stages": stages,
            "age_ranges": age_ranges
        },
        "top_challenges": top_challenges,
        "resource_gaps": resource_gaps,
        "seven_fs_averages": seven_fs_averages,
        "nps_score": nps,
        "recommendations": recommendations
    }


@router.get("/export")
async def export_assessment_data():
    """Export all assessment data for grant applications and reporting."""
    if not submissions:
        raise HTTPException(status_code=404, detail="No assessment data available")

    return {
        "status": "success",
        "total_submissions": len(submissions),
        "export_date": datetime.utcnow().isoformat(),
        "data": submissions,
        "summary": {
            "note": "This data can be used in grant applications to demonstrate community needs and DowUrk's impact.",
            "fields_included": [
                "Demographics (age, parish, education, ethnicity)",
                "Business stage and funding needs",
                "Top challenges and resource gaps",
                "7Fs self-assessment scores",
                "Platform feedback and NPS",
                "Open-ended community feedback"
            ]
        }
    }
