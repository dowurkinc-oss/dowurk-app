from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import os
from uuid import uuid4
import logging

from emergentintegrations.llm.chat import LlmChat, UserMessage
from security.dependencies import apply_rate_limit

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Global database reference
db = None

def set_database(database):
    """Set the database instance for this router"""
    global db
    db = database

# Pydantic Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BusinessPlanRequest(BaseModel):
    session_id: str
    user_message: str
    business_context: Optional[str] = None

class BusinessPlanResponse(BaseModel):
    session_id: str
    user_message: str
    assistant_response: str
    timestamp: datetime

class ChatHistory(BaseModel):
    session_id: str
    messages: List[ChatMessage]

@router.post("/business-plan", response_model=BusinessPlanResponse)
async def generate_business_plan(request: BusinessPlanRequest):
    """
    AI Business Planning Assistant
    Generates business plans, strategies, and advice using GPT-5
    """
    try:
        # Get API key from environment
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Initialize chat with system message
        system_message = """You are a business planning expert for DowUrk AI, specializing in helping underserved entrepreneurs, creatives, nonprofits, and minority-owned businesses. 

Your role is to:
- Provide actionable business planning advice
- Help create comprehensive business strategies
- Offer guidance on funding, marketing, and operations
- Be culturally aware and sensitive to diverse business contexts
- Focus on practical, real-world solutions for local economies

Be concise, encouraging, and provide specific actionable steps."""

        chat = LlmChat(
            api_key=api_key,
            session_id=request.session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5")
        
        # Enhance the user message with business context if provided
        enhanced_message = request.user_message
        if request.business_context:
            enhanced_message = f"Business Context: {request.business_context}\n\nQuestion: {request.user_message}"
        
        # Create user message
        user_msg = UserMessage(text=enhanced_message)
        
        # Get response from AI
        logger.info(f"Sending message to AI for session: {request.session_id}")
        ai_response = await chat.send_message(user_msg)
        
        # Store the conversation in database
        user_message_doc = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.user_message
        ).model_dump()
        user_message_doc['timestamp'] = user_message_doc['timestamp'].isoformat()
        
        assistant_message_doc = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=ai_response
        ).model_dump()
        assistant_message_doc['timestamp'] = assistant_message_doc['timestamp'].isoformat()
        
        # Insert both messages
        await db.ai_conversations.insert_many([user_message_doc, assistant_message_doc])
        
        logger.info(f"AI response generated and stored for session: {request.session_id}")
        
        return BusinessPlanResponse(
            session_id=request.session_id,
            user_message=request.user_message,
            assistant_response=ai_response,
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Error in AI business planning: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.get("/chat-history/{session_id}", response_model=ChatHistory)
async def get_chat_history(session_id: str):
    """
    Retrieve chat history for a specific session
    """
    try:
        messages = await db.ai_conversations.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(1000)
        
        # Convert ISO string timestamps back to datetime
        for msg in messages:
            if isinstance(msg['timestamp'], str):
                msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
        
        return ChatHistory(
            session_id=session_id,
            messages=[ChatMessage(**msg) for msg in messages]
        )
    except Exception as e:
        logger.error(f"Error retrieving chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/chat-history/{session_id}")
async def clear_chat_history(session_id: str):
    """
    Clear chat history for a specific session
    """
    try:
        result = await db.ai_conversations.delete_many({"session_id": session_id})
        return {
            "message": f"Deleted {result.deleted_count} messages",
            "session_id": session_id
        }
    except Exception as e:
        logger.error(f"Error clearing chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ========================================
# AI CONTENT GENERATOR
# ========================================

class ContentGeneratorRequest(BaseModel):
    content_type: str = Field(..., description="Type: social_post, blog_intro, email, ad_copy, tagline")
    topic: str = Field(..., description="Main topic or product")
    tone: str = Field(default="professional", description="Tone: professional, casual, friendly, bold")
    length: str = Field(default="short", description="Length: short, medium, long")
    additional_context: Optional[str] = None

class ContentGeneratorResponse(BaseModel):
    content_type: str
    generated_content: str
    timestamp: datetime

@router.post("/content-generator", response_model=ContentGeneratorResponse)
async def generate_marketing_content(req: ContentGeneratorRequest):
    """
    AI Content Generator for Marketing & Branding
    Generates social posts, blog intros, emails, ad copy, and taglines
    """
    try:
        # Get API key
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        # Build system prompt based on content type
        system_prompts = {
            "social_post": "You are a social media expert specializing in engaging, shareable content for businesses and nonprofits.",
            "blog_intro": "You are a content marketing expert specializing in compelling blog introductions that hook readers.",
            "email": "You are an email marketing expert specializing in persuasive, action-oriented email copy.",
            "ad_copy": "You are an advertising copywriter specializing in concise, high-converting ad copy.",
            "tagline": "You are a brand strategist specializing in memorable, impactful taglines and slogans."
        }
        
        system_message = system_prompts.get(
            req.content_type,
            "You are a creative content writer specializing in marketing and branding."
        )
        
        # Build user prompt
        length_guidance = {
            "short": "Keep it brief (1-2 sentences or under 100 words)",
            "medium": "Make it moderate length (3-5 sentences or 100-200 words)",
            "long": "Make it comprehensive (200-400 words)"
        }
        
        user_prompt = f"""Create {req.content_type} content about: {req.topic}

Tone: {req.tone}
Length: {length_guidance.get(req.length, 'short')}"""
        
        if req.additional_context:
            user_prompt += f"\nAdditional Context: {req.additional_context}"
        
        user_prompt += "\n\nGenerate the content now (no explanations, just the content):"
        
        # Generate content using GPT-5
        session_id = f"content-gen-{uuid4()}"
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-5")
        
        user_msg = UserMessage(text=user_prompt)
        generated_content = await chat.send_message(user_msg)
        
        logger.info(f"Content generated: {req.content_type}")
        
        return ContentGeneratorResponse(
            content_type=req.content_type,
            generated_content=generated_content,
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Content generation error: {str(e)}")
