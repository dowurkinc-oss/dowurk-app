import os
from openai import AsyncOpenAI
from typing import List, Dict, Optional
import json
from datetime import datetime, timezone

# Initialize OpenAI client
client = AsyncOpenAI(
    api_key=os.environ.get('OPENAI_API_KEY'),
    base_url=os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1')
)

# ==================== BUSINESS COACH ====================

COACH_SYSTEM_PROMPTS = {
    "launch": """You are an expert business launch coach for DowUrk Inc., specializing in helping 
    Louisiana entrepreneurs start their businesses. Focus on:
    - Business registration and legal requirements in Louisiana
    - Initial business planning and validation
    - First customer acquisition strategies
    - Bootstrapping and initial funding
    - Building a minimum viable product/service
    Be encouraging, practical, and provide actionable next steps.""",
    
    "growth": """You are an expert business growth coach for DowUrk Inc., helping Louisiana 
    entrepreneurs scale their businesses. Focus on:
    - Scaling operations and team building
    - Marketing and customer acquisition at scale
    - Financial management and cash flow
    - Strategic partnerships and networking
    - Technology and systems optimization
    Provide data-driven advice and growth strategies.""",
    
    "pivot": """You are an expert business pivot coach for DowUrk Inc., helping Louisiana 
    entrepreneurs navigate business transitions. Focus on:
    - Market analysis and opportunity identification
    - Business model innovation
    - Resource reallocation strategies
    - Risk management during transitions
    - Maintaining customer relationships during change
    Be supportive and help identify new opportunities."""
}

async def start_coaching_session(
    user_id: str,
    business_stage: str,
    business_description: str,
    current_challenges: List[str]
) -> Dict:
    """Start a new AI coaching session"""
    
    system_prompt = COACH_SYSTEM_PROMPTS.get(business_stage, COACH_SYSTEM_PROMPTS["launch"])
    
    prompt = f"""
    A Louisiana entrepreneur is starting a coaching session with you.
    
    Business Stage: {business_stage}
    Business Description: {business_description}
    Current Challenges: {', '.join(current_challenges)}
    
    Please provide:
    1. An assessment of their current situation
    2. Their business health score (1-100) based on the information
    3. Top 3 priorities they should focus on
    4. A personalized 30-day action plan with weekly milestones
    5. Recommended resources from DowUrk's ecosystem
    
    Format as JSON:
    {{
        "assessment": "detailed assessment",
        "health_score": 75,
        "priorities": ["priority 1", "priority 2", "priority 3"],
        "action_plan": {{
            "week_1": ["action 1", "action 2"],
            "week_2": ["action 1", "action 2"],
            "week_3": ["action 1", "action 2"],
            "week_4": ["action 1", "action 2"]
        }},
        "recommended_resources": ["resource 1", "resource 2"],
        "motivational_message": "encouraging message"
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["session_id"] = f"coach_{user_id}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        result["business_stage"] = business_stage
        return result
        
    except Exception as e:
        print(f"Error starting coaching session: {str(e)}")
        return {"error": "Unable to start coaching session"}

async def weekly_checkin(
    session_id: str,
    completed_tasks: List[str],
    challenges_faced: List[str],
    wins: List[str],
    questions: List[str]
) -> Dict:
    """Process weekly check-in and provide guidance"""
    
    prompt = f"""
    An entrepreneur is doing their weekly check-in.
    
    Completed Tasks: {', '.join(completed_tasks) if completed_tasks else 'None reported'}
    Challenges Faced: {', '.join(challenges_faced) if challenges_faced else 'None reported'}
    Wins This Week: {', '.join(wins) if wins else 'None reported'}
    Questions: {', '.join(questions) if questions else 'None'}
    
    Please provide:
    1. Feedback on their progress
    2. Updated health score adjustment (+/- points)
    3. Solutions for their challenges
    4. Answers to their questions
    5. Next week's focus areas
    6. A motivational message
    
    Format as JSON:
    {{
        "progress_feedback": "detailed feedback",
        "health_score_change": 5,
        "challenge_solutions": {{"challenge": "solution"}},
        "question_answers": {{"question": "answer"}},
        "next_week_focus": ["focus 1", "focus 2"],
        "motivational_message": "encouraging message",
        "badges_earned": ["badge name if any"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an encouraging business coach providing weekly check-in feedback."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error processing check-in: {str(e)}")
        return {"error": "Unable to process check-in"}

async def generate_micro_course(topic: str, business_stage: str) -> Dict:
    """Generate a micro-course on a specific topic"""
    
    prompt = f"""
    Create a micro-course for Louisiana entrepreneurs at the {business_stage} stage on: {topic}
    
    The course should be completable in 15-20 minutes and include:
    1. Course title and description
    2. Learning objectives (3-4)
    3. 5 bite-sized lessons with key points
    4. A practical exercise
    5. Quiz questions (3 multiple choice)
    6. Additional resources
    
    Format as JSON:
    {{
        "title": "course title",
        "description": "brief description",
        "duration_minutes": 15,
        "objectives": ["objective 1", "objective 2"],
        "lessons": [
            {{"title": "lesson title", "content": "lesson content", "key_takeaway": "main point"}}
        ],
        "exercise": {{"title": "exercise title", "instructions": "what to do", "expected_outcome": "what they'll learn"}},
        "quiz": [
            {{"question": "question", "options": ["a", "b", "c", "d"], "correct": "a", "explanation": "why"}}
        ],
        "resources": ["resource 1", "resource 2"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert business educator creating engaging micro-courses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error generating micro-course: {str(e)}")
        return {"error": "Unable to generate micro-course"}


# ==================== GRANT MATCHING ====================

async def match_grants(
    business_profile: Dict,
    available_grants: List[Dict]
) -> List[Dict]:
    """Match business profile with available grants"""
    
    prompt = f"""
    Analyze this business profile and match it with available grants.
    
    Business Profile:
    - Name: {business_profile.get('business_name', 'Unknown')}
    - Category: {business_profile.get('category', 'Unknown')}
    - Parish: {business_profile.get('parish', 'Unknown')}
    - Description: {business_profile.get('description', 'Unknown')}
    - Organization Type: {business_profile.get('organization_type', 'for-profit')}
    - Certifications: {', '.join(business_profile.get('certifications', []))}
    
    Available Grants:
    {json.dumps(available_grants, indent=2)}
    
    For each grant, provide:
    1. Match score (0-100)
    2. Matching criteria
    3. Missing criteria
    4. Recommendations to improve eligibility
    5. Application tips
    
    Format as JSON:
    {{
        "matches": [
            {{
                "grant_id": "id",
                "grant_title": "title",
                "match_score": 85,
                "matching_criteria": ["criteria 1"],
                "missing_criteria": ["criteria 1"],
                "recommendations": ["recommendation 1"],
                "application_tips": ["tip 1"],
                "priority": "high/medium/low"
            }}
        ],
        "overall_funding_potential": "assessment",
        "suggested_actions": ["action 1", "action 2"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a grant funding expert helping Louisiana entrepreneurs find funding opportunities."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error matching grants: {str(e)}")
        return {"error": "Unable to match grants", "matches": []}

async def generate_grant_application(
    grant_info: Dict,
    business_profile: Dict,
    section: str = "full"
) -> Dict:
    """Generate grant application content"""
    
    sections_prompt = {
        "executive_summary": "Write a compelling executive summary (250 words)",
        "problem_statement": "Write a clear problem statement the business addresses",
        "solution": "Describe the business solution and its impact",
        "budget_narrative": "Create a budget narrative justifying funding needs",
        "impact_metrics": "Define measurable impact metrics and outcomes",
        "full": "Generate a complete grant application with all sections"
    }
    
    prompt = f"""
    Generate grant application content for:
    
    Grant: {grant_info.get('title', 'Unknown Grant')}
    Organization: {grant_info.get('organization', 'Unknown')}
    Amount Range: {grant_info.get('amount_range', 'Unknown')}
    
    Business:
    - Name: {business_profile.get('business_name', 'Unknown')}
    - Description: {business_profile.get('description', 'Unknown')}
    - Category: {business_profile.get('category', 'Unknown')}
    - Location: {business_profile.get('city', 'Unknown')}, {business_profile.get('parish', 'Unknown')} Parish
    
    Task: {sections_prompt.get(section, sections_prompt['full'])}
    
    Format as JSON:
    {{
        "section": "{section}",
        "content": "generated content",
        "word_count": 250,
        "tips": ["tip for improvement"],
        "common_mistakes_avoided": ["mistake 1"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert grant writer who has helped secure millions in funding for Louisiana businesses."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error generating grant application: {str(e)}")
        return {"error": "Unable to generate application content"}


# ==================== COMMUNITY INTELLIGENCE ====================

async def match_mentors(
    mentee_profile: Dict,
    available_mentors: List[Dict]
) -> List[Dict]:
    """Match entrepreneurs with suitable mentors"""
    
    prompt = f"""
    Find the best mentor matches for this entrepreneur.
    
    Mentee Profile:
    - Name: {mentee_profile.get('full_name', 'Unknown')}
    - Business Stage: {mentee_profile.get('business_stage', 'launch')}
    - Industry: {mentee_profile.get('industry', 'Unknown')}
    - Goals: {', '.join(mentee_profile.get('goals', ['growth']))}
    - Challenges: {', '.join(mentee_profile.get('challenges', []))}
    - Location: {mentee_profile.get('location', 'Louisiana')}
    
    Available Mentors:
    {json.dumps(available_mentors, indent=2)}
    
    For each potential match, provide:
    1. Match score (0-100)
    2. Why they're a good match
    3. What the mentee can learn
    4. Suggested conversation starters
    
    Format as JSON:
    {{
        "matches": [
            {{
                "mentor_id": "id",
                "mentor_name": "name",
                "match_score": 90,
                "match_reasons": ["reason 1", "reason 2"],
                "learning_opportunities": ["opportunity 1"],
                "conversation_starters": ["starter 1", "starter 2"],
                "recommended_meeting_frequency": "weekly/biweekly/monthly"
            }}
        ],
        "mentorship_tips": ["tip 1", "tip 2"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert at matching entrepreneurs with mentors for maximum growth and success."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error matching mentors: {str(e)}")
        return {"error": "Unable to match mentors", "matches": []}

async def find_collaborators(
    user_profile: Dict,
    collaboration_type: str,
    available_users: List[Dict]
) -> List[Dict]:
    """Find potential business collaborators"""
    
    collab_types = {
        "partner": "business partnership opportunities",
        "supplier": "potential suppliers or vendors",
        "customer": "potential B2B customers",
        "investor": "potential investors or funding partners",
        "co-founder": "potential co-founders with complementary skills"
    }
    
    prompt = f"""
    Find {collab_types.get(collaboration_type, 'collaboration')} for this entrepreneur.
    
    User Profile:
    - Name: {user_profile.get('full_name', 'Unknown')}
    - Business: {user_profile.get('business_name', 'Unknown')}
    - Industry: {user_profile.get('category', 'Unknown')}
    - Looking for: {collaboration_type}
    - Skills/Offerings: {', '.join(user_profile.get('skills', []))}
    - Needs: {', '.join(user_profile.get('needs', []))}
    
    Available Users:
    {json.dumps(available_users[:20], indent=2)}
    
    Format as JSON:
    {{
        "collaborators": [
            {{
                "user_id": "id",
                "name": "name",
                "business": "business name",
                "match_score": 85,
                "collaboration_potential": "description of potential collaboration",
                "mutual_benefits": ["benefit 1", "benefit 2"],
                "suggested_approach": "how to reach out"
            }}
        ],
        "networking_tips": ["tip 1"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert business networker helping Louisiana entrepreneurs find valuable connections."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error finding collaborators: {str(e)}")
        return {"error": "Unable to find collaborators", "collaborators": []}

async def create_peer_group(
    users: List[Dict],
    group_focus: str
) -> Dict:
    """Create AI-curated peer accountability groups"""
    
    prompt = f"""
    Create an optimal peer accountability group from these entrepreneurs.
    
    Focus Area: {group_focus}
    
    Available Entrepreneurs:
    {json.dumps(users, indent=2)}
    
    Create a group of 4-6 members that would work well together. Consider:
    - Complementary skills and experiences
    - Similar business stages
    - Geographic proximity in Louisiana
    - Shared challenges or goals
    
    Format as JSON:
    {{
        "group_name": "creative group name",
        "group_focus": "{group_focus}",
        "members": [
            {{
                "user_id": "id",
                "name": "name",
                "role_in_group": "what they bring to the group"
            }}
        ],
        "group_dynamics": "why this group will work well",
        "suggested_activities": ["activity 1", "activity 2"],
        "meeting_agenda_template": ["agenda item 1", "agenda item 2"],
        "success_metrics": ["metric 1", "metric 2"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert at creating high-performing peer accountability groups for entrepreneurs."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"Error creating peer group: {str(e)}")
        return {"error": "Unable to create peer group"}


# ==================== SUBSCRIPTION FEATURES ====================

SUBSCRIPTION_TIERS = {
    "free": {
        "name": "Free",
        "price": 0,
        "features": [
            "Basic AI chat assistance",
            "Community forum access",
            "Limited resource library (10 items)",
            "Business directory listing",
            "Monthly newsletter"
        ],
        "limits": {
            "ai_chats_per_month": 20,
            "grant_matches": 3,
            "mentor_requests": 1,
            "resources_access": 10
        }
    },
    "pro": {
        "name": "Pro",
        "price": 19.99,
        "features": [
            "Full AI Business Coach",
            "Unlimited AI chat",
            "Grant matching & alerts",
            "Mentor matching (3/month)",
            "Live workshops access",
            "Funding toolkits",
            "Priority support",
            "Weekly micro-courses",
            "Progress dashboard"
        ],
        "limits": {
            "ai_chats_per_month": -1,  # unlimited
            "grant_matches": -1,
            "mentor_requests": 3,
            "resources_access": -1
        }
    },
    "elite": {
        "name": "Elite",
        "price": 99.00,
        "features": [
            "Everything in Pro",
            "1:1 AI coaching sessions",
            "Pitch deck review & feedback",
            "Investor introductions",
            "Custom business reports",
            "Dedicated success manager",
            "VIP event access",
            "Grant application review",
            "Unlimited mentor matching"
        ],
        "limits": {
            "ai_chats_per_month": -1,
            "grant_matches": -1,
            "mentor_requests": -1,
            "resources_access": -1,
            "coaching_sessions": -1
        }
    }
}

def get_subscription_tiers() -> Dict:
    """Get all subscription tier information"""
    return SUBSCRIPTION_TIERS

def check_feature_access(user_tier: str, feature: str) -> bool:
    """Check if a user's tier has access to a feature"""
    tier_hierarchy = {"free": 0, "pro": 1, "elite": 2}
    feature_requirements = {
        "basic_chat": "free",
        "full_coach": "pro",
        "grant_matching": "pro",
        "mentor_matching": "pro",
        "pitch_review": "elite",
        "investor_intros": "elite",
        "custom_reports": "elite"
    }
    
    required_tier = feature_requirements.get(feature, "free")
    return tier_hierarchy.get(user_tier, 0) >= tier_hierarchy.get(required_tier, 0)

async def generate_custom_report(
    user_id: str,
    business_profile: Dict,
    report_type: str
) -> Dict:
    """Generate custom business reports for Elite users"""
    
    report_prompts = {
        "market_analysis": "Comprehensive market analysis for the business",
        "competitor_analysis": "Detailed competitor analysis",
        "growth_strategy": "Custom growth strategy recommendations",
        "financial_projections": "Financial projections and recommendations",
        "marketing_plan": "Detailed marketing plan"
    }
    
    prompt = f"""
    Generate a {report_prompts.get(report_type, 'business')} report for:
    
    Business: {business_profile.get('business_name', 'Unknown')}
    Category: {business_profile.get('category', 'Unknown')}
    Location: {business_profile.get('city', 'Unknown')}, {business_profile.get('parish', 'Unknown')} Parish, Louisiana
    Description: {business_profile.get('description', 'Unknown')}
    
    Create a professional, actionable report with:
    1. Executive Summary
    2. Key Findings
    3. Detailed Analysis
    4. Recommendations
    5. Action Items
    6. Resources
    
    Format as JSON:
    {{
        "report_title": "title",
        "report_type": "{report_type}",
        "generated_at": "timestamp",
        "executive_summary": "summary",
        "key_findings": ["finding 1", "finding 2"],
        "detailed_analysis": "comprehensive analysis",
        "recommendations": [
            {{"priority": "high", "recommendation": "rec", "impact": "expected impact"}}
        ],
        "action_items": [
            {{"item": "action", "timeline": "when", "resources_needed": "what"}}
        ],
        "resources": ["resource 1"]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a senior business consultant creating executive-level reports."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.6,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["generated_at"] = datetime.now(timezone.utc).isoformat()
        return result
        
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return {"error": "Unable to generate report"}
