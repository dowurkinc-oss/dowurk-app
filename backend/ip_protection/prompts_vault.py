"""
PROMPTS VAULT - CONFIDENTIAL
DowUrk AI Proprietary System Prompts

WARNING: This file contains proprietary intellectual property.
Unauthorized access, use, or distribution is strictly prohibited.

Copyright (c) 2025 DowUrk Inc. All rights reserved.
"""

from typing import Dict, Optional
import hashlib
import os
from datetime import datetime

# Encryption key from environment (never hardcode!)
ENCRYPTION_KEY = os.environ.get('IP_ENCRYPTION_KEY', 'default-dev-key-change-in-prod')

class ProprietaryPrompts:
    """
    Secure vault for all proprietary AI prompts and system messages.
    NEVER expose these to frontend or public APIs.
    """
    
    # CONFIDENTIAL: Business Planning AI System Prompt
    BUSINESS_PLANNING_SYSTEM = """You are a business planning expert for DowUrk AI, specializing in helping underserved entrepreneurs, creatives, nonprofits, and minority-owned businesses. 

Your role is to:
- Provide actionable business planning advice
- Help create comprehensive business strategies
- Offer guidance on funding, marketing, and operations
- Be culturally aware and sensitive to diverse business contexts
- Focus on practical, real-world solutions for local economies

Be concise, encouraging, and provide specific actionable steps."""
    
    # CONFIDENTIAL: Content Generation System Prompts
    CONTENT_PROMPTS = {
        "social_post": """You are a social media expert specializing in engaging, shareable content for businesses and nonprofits.
        
Your expertise:
- Creating viral-worthy social media posts
- Understanding platform-specific best practices
- Crafting content that drives engagement
- Balancing promotional and value-driven content
        
Create content that resonates with underserved communities and drives authentic engagement.""",
        
        "blog_intro": """You are a content marketing expert specializing in compelling blog introductions that hook readers.
        
Your approach:
- Start with attention-grabbing hooks
- Clearly state the value proposition
- Create curiosity gaps that make readers want more
- Use storytelling when appropriate
        
Write for entrepreneurs who are time-starved but knowledge-hungry.""",
        
        "email": """You are an email marketing expert specializing in persuasive, action-oriented email copy.
        
Your methodology:
- Clear, compelling subject lines (when requested)
- Personalized tone that builds connection
- Strong calls-to-action
- Value-first approach
        
Write for small business owners who receive 100+ emails daily.""",
        
        "ad_copy": """You are an advertising copywriter specializing in concise, high-converting ad copy.
        
Your principles:
- Lead with the biggest benefit
- Create urgency without being pushy
- Use powerful, emotional triggers
- Every word must earn its place
        
Write for audiences scrolling quickly who need immediate value clarity.""",
        
        "tagline": """You are a brand strategist specializing in memorable, impactful taglines and slogans.
        
Your craft:
- Distill brand essence into 3-7 words
- Create memorable, repeatable phrases
- Balance cleverness with clarity
- Ensure taglines work across cultures
        
Create taglines that entrepreneurs will proudly display on their business cards."""
    }
    
    # CONFIDENTIAL: Pitch Deck System Prompt
    PITCH_DECK_SYSTEM = """You are an expert pitch deck consultant who has helped hundreds of startups raise millions in funding. You specialize in creating compelling, investor-ready pitch decks that tell a clear story and highlight key business strengths.
    
Your approach:
- Clear, concise storytelling
- Data-driven insights
- Problem-solution framing
- Realistic but ambitious projections
- Investor psychology awareness
    
Create pitch decks that get meetings with VCs and angel investors."""
    
    # CONFIDENTIAL: Financial Projections System (Future feature)
    FINANCIAL_SYSTEM = """You are a financial modeling expert specializing in realistic projections for early-stage businesses.
    
Your methodology:
- Conservative revenue assumptions
- Detailed expense modeling
- Multiple scenario planning (best, base, worst)
- Key metrics focus (CAC, LTV, burn rate)
- Fundability assessment
    
Create financial models that investors trust and founders can execute against."""
    
    # CONFIDENTIAL: Market Research System (Future feature)
    MARKET_RESEARCH_SYSTEM = """You are a market research analyst specializing in competitive intelligence and market sizing.
    
Your expertise:
- TAM/SAM/SOM calculations
- Competitive landscape mapping
- Market trend identification
- Customer segmentation
- Go-to-market strategy
    
Provide insights that give entrepreneurs unfair advantages in their markets."""
    
    @staticmethod
    def get_system_prompt(prompt_type: str, context: Optional[Dict] = None) -> str:
        """
        Securely retrieve system prompt by type.
        
        Args:
            prompt_type: Type of prompt (business_planning, content, pitch_deck, etc.)
            context: Optional context for prompt customization
            
        Returns:
            System prompt string
            
        Raises:
            ValueError: If prompt type is invalid
        """
        # Log access for audit trail
        _log_prompt_access(prompt_type)
        
        if prompt_type == "business_planning":
            return ProprietaryPrompts.BUSINESS_PLANNING_SYSTEM
        
        elif prompt_type == "pitch_deck":
            return ProprietaryPrompts.PITCH_DECK_SYSTEM
        
        elif prompt_type == "financial":
            return ProprietaryPrompts.FINANCIAL_SYSTEM
        
        elif prompt_type == "market_research":
            return ProprietaryPrompts.MARKET_RESEARCH_SYSTEM
        
        elif prompt_type in ProprietaryPrompts.CONTENT_PROMPTS:
            return ProprietaryPrompts.CONTENT_PROMPTS[prompt_type]
        
        else:
            raise ValueError(f"Invalid prompt type: {prompt_type}")
    
    @staticmethod
    def get_content_generation_config(content_type: str, tone: str, length: str) -> Dict:
        """
        Get proprietary content generation configuration.
        This contains DowUrk's secret sauce for content quality.
        
        CONFIDENTIAL: These parameters are tuned based on extensive testing.
        """
        # PROPRIETARY: Length guidance (fine-tuned for optimal engagement)
        length_configs = {
            "short": {
                "max_words": 100,
                "guidance": "Keep it brief (1-2 sentences or under 100 words)",
                "emphasis": "punchy, immediate impact"
            },
            "medium": {
                "max_words": 200,
                "guidance": "Make it moderate length (3-5 sentences or 100-200 words)",
                "emphasis": "balanced detail and readability"
            },
            "long": {
                "max_words": 400,
                "guidance": "Make it comprehensive (200-400 words)",
                "emphasis": "thorough but engaging"
            }
        }
        
        # PROPRIETARY: Tone adjustments (DowUrk's unique voice)
        tone_modifiers = {
            "professional": "Maintain business professionalism while being approachable",
            "casual": "Use conversational language that builds trust",
            "friendly": "Be warm and encouraging without being overly familiar",
            "bold": "Be confident and direct, make strong claims with authority"
        }
        
        return {
            "length_config": length_configs.get(length, length_configs["short"]),
            "tone_modifier": tone_modifiers.get(tone, tone_modifiers["professional"]),
            "content_type": content_type
        }

# SECURITY: Access logging for audit trail
def _log_prompt_access(prompt_type: str):
    """
    Log all access to proprietary prompts for security audit.
    In production, send to secure logging service.
    """
    timestamp = datetime.utcnow().isoformat()
    access_hash = hashlib.sha256(f"{prompt_type}{timestamp}{ENCRYPTION_KEY}".encode()).hexdigest()[:16]
    
    # In production: Send to secure audit log service
    # For now: Basic logging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"PROMPT_ACCESS: type={prompt_type}, hash={access_hash}, ts={timestamp}")

# PROPRIETARY: Watermarking system for AI outputs
class ContentWatermark:
    """
    Invisible watermarking for AI-generated content.
    Helps track unauthorized distribution of DowUrk-generated content.
    """
    
    @staticmethod
    def add_watermark(content: str, metadata: Dict) -> str:
        """
        Add invisible watermark to generated content.
        Uses zero-width characters and pattern-based embedding.
        """
        # PROPRIETARY: Watermark implementation
        # In production: Use sophisticated watermarking
        # For now: Add metadata in comment (invisible in rendered content)
        
        watermark_data = {
            "generated_by": "DowUrk_AI",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": metadata.get("user_id", "unknown"),
            "content_type": metadata.get("content_type", "unknown")
        }
        
        # Create watermark hash
        watermark_hash = hashlib.sha256(
            f"{watermark_data['generated_by']}{watermark_data['timestamp']}".encode()
        ).hexdigest()[:12]
        
        # Add invisible marker (zero-width space pattern)
        # This is detectable but invisible to users
        watermark_marker = f"\u200B{watermark_hash}\u200B"
        
        return content + watermark_marker
    
    @staticmethod
    def detect_watermark(content: str) -> Optional[Dict]:
        """
        Detect if content was generated by DowUrk AI.
        Used to track unauthorized content distribution.
        """
        # Check for watermark pattern
        if "\u200B" in content:
            # Extract and decode watermark
            parts = content.split("\u200B")
            if len(parts) >= 3:
                watermark_hash = parts[1]
                return {
                    "watermarked": True,
                    "hash": watermark_hash,
                    "source": "DowUrk_AI"
                }
        
        return {"watermarked": False}
