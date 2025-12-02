import os
from openai import AsyncOpenAI
from typing import List, Dict
import json

# Initialize OpenAI client with Emergent Universal Key
client = AsyncOpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# System prompts for different contexts
SYSTEM_PROMPTS = {
    "general": """You are a helpful AI assistant for DowUrk Inc., an organization dedicated to empowering 
    Louisiana's underrepresented entrepreneurs and communities. You help users with business planning, 
    entrepreneurship, accessing resources, and navigating Louisiana's business ecosystem. Be friendly, 
    culturally aware, and provide actionable advice specific to Louisiana when relevant.""",
    
    "business_planning": """You are an expert business planning consultant for Louisiana entrepreneurs. 
    Help users create business plans, develop strategies, understand market analysis, and structure 
    their business ideas. Focus on practical, actionable advice relevant to Louisiana's business environment.""",
    
    "grants": """You are a grant funding specialist helping Louisiana entrepreneurs find and apply for 
    grants, loans, and funding opportunities. Provide guidance on eligibility requirements, application 
    strategies, and how to present their business effectively to funders. Be specific about Louisiana-based 
    opportunities when relevant.""",
    
    "legal": """You are a business legal advisor helping Louisiana entrepreneurs understand business 
    formation, licensing, permits, and compliance requirements. Provide clear explanations of legal concepts 
    and guide users to appropriate resources. Always remind users to consult with a licensed attorney for 
    specific legal advice.""",
    
    "marketing": """You are a marketing strategist helping Louisiana entrepreneurs develop marketing plans, 
    branding strategies, and customer acquisition tactics. Provide practical, cost-effective marketing advice 
    suitable for small businesses and startups."""
}

LOUISIANA_CONTEXT = """
Key Louisiana Business Resources:
- Louisiana Economic Development (LED): Main state agency for economic development
- Louisiana Small Business Development Centers (SBDC): Free consulting and training
- Louisiana SSBCI: State Small Business Credit Initiative for capital access
- DowUrk Inc.: Community-focused support for underrepresented entrepreneurs
- Louisiana parishes (not counties): 64 parishes total
- Major cities: New Orleans, Baton Rouge, Shreveport, Lafayette, Lake Charles
- Key industries: Energy, petrochemicals, agriculture, tourism, technology
"""

async def generate_ai_response(
    user_message: str,
    conversation_history: List[Dict[str, str]] = None,
    context_type: str = "general"
) -> str:
    """
    Generate AI response using OpenAI with Emergent Universal Key
    """
    if conversation_history is None:
        conversation_history = []
    
    # Get appropriate system prompt
    system_prompt = SYSTEM_PROMPTS.get(context_type, SYSTEM_PROMPTS["general"])
    
    # Build messages array
    messages = [
        {"role": "system", "content": system_prompt + "\n\n" + LOUISIANA_CONTEXT},
    ]
    
    # Add conversation history
    for msg in conversation_history[-10:]:  # Keep last 10 messages for context
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    try:
        # Call OpenAI API
        response = await client.chat.completions.create(
            model="gpt-4o-mini",  # Using cost-effective model
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."

async def generate_business_plan_outline(business_idea: str, industry: str) -> Dict[str, any]:
    """
    Generate a business plan outline based on user's business idea
    """
    prompt = f"""
    Create a detailed business plan outline for a Louisiana-based business with the following details:
    Business Idea: {business_idea}
    Industry: {industry}
    
    Provide a structured outline with the following sections:
    1. Executive Summary
    2. Company Description
    3. Market Analysis (Louisiana-specific)
    4. Organization & Management
    5. Products/Services
    6. Marketing & Sales Strategy
    7. Financial Projections
    8. Funding Requirements
    
    For each section, provide 2-3 key points to address.
    
    Format the response as JSON with this structure:
    {{
        "sections": [
            {{
                "title": "Section Name",
                "key_points": ["point 1", "point 2", "point 3"]
            }}
        ]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a business planning expert. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    except Exception as e:
        print(f"Error generating business plan: {str(e)}")
        return {"error": "Unable to generate business plan outline"}

async def analyze_grant_eligibility(business_description: str, grant_criteria: List[str]) -> Dict[str, any]:
    """
    Analyze if a business is eligible for a specific grant
    """
    prompt = f"""
    Analyze the following business for grant eligibility:
    
    Business Description: {business_description}
    
    Grant Eligibility Criteria:
    {chr(10).join(f'- {criterion}' for criterion in grant_criteria)}
    
    Provide:
    1. Eligibility assessment (likely eligible, possibly eligible, not eligible)
    2. Matching criteria
    3. Missing criteria or areas of concern
    4. Recommendations to strengthen application
    
    Format as JSON:
    {{
        "eligibility_status": "likely/possibly/not eligible",
        "matching_criteria": [],
        "missing_criteria": [],
        "recommendations": []
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a grant funding expert. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    except Exception as e:
        print(f"Error analyzing grant eligibility: {str(e)}")
        return {"error": "Unable to analyze grant eligibility"}

async def generate_marketing_content(business_name: str, business_description: str, content_type: str) -> str:
    """
    Generate marketing content (social posts, taglines, descriptions)
    """
    prompts = {
        "tagline": f"Create 3 catchy, memorable taglines for {business_name}. Description: {business_description}",
        "social_post": f"Write an engaging social media post for {business_name}. Description: {business_description}",
        "bio": f"Write a compelling 150-character bio for {business_name}. Description: {business_description}",
        "elevator_pitch": f"Create a 30-second elevator pitch for {business_name}. Description: {business_description}"
    }
    
    prompt = prompts.get(content_type, prompts["tagline"])
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative marketing copywriter."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.9,
            max_tokens=300
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error generating marketing content: {str(e)}")
        return "Unable to generate content at this time."
