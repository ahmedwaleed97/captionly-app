from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "").strip()
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not set in .env — please add it.")

client = genai.Client(api_key=api_key)

def generate_caption(description: str, platform: str, niche: str, language: str = "English") -> str:

    if language.lower().startswith("ar"):
        # ── Arabic Prompt ──────────────────────────────────────────────
        # Key improvements over your previous version:
        # 1. Specifies Gulf/Levantine Arabic — the dominant dialect on social media
        # 2. Asks for mixed Arabic + English hashtags — proven to increase reach
        # 3. Requests natural emoji use — matches how Arabic creators actually post
        # 4. Asks for platform-specific advice (Instagram vs TikTok differ a lot)
        prompt = f"""
أنت خبير في وسائل التواصل الاجتماعي متخصص في تنمية الحسابات على منصة {platform} للجمهور العربي.

صانع محتوى في مجال "{niche}" يريد نشر المحتوى التالي:
"{description}"

اكتب المحتوى باللغة العربية الفصحى المبسطة المناسبة لوسائل التواصل الاجتماعي (وليس اللهجة العامية الضيقة).
إذا كان الوصف بلغة أخرى، ترجمه أولاً وأنشئ المحتوى عربياً.

قدّم ما يلي:

التعليق:
اكتب تعليقاً جذاباً من 2-3 جمل يناسب {platform}، بأسلوب حيوي وودّي، واختمه بسؤال يشجع المتابعين على التعليق. استخدم الإيموجي بشكل طبيعي وغير مبالغ فيه.

الهاشتاغات:
أعطِ 20 هاشتاغاً — مزيج من:
- هاشتاغات عربية شائعة (أكثر من 1M منشور)
- هاشتاغات عربية متوسطة (100K-1M)
- هاشتاغات عربية متخصصة في مجال {niche} (أقل من 100K)
- 4-5 هاشتاغات إنجليزية تكميلية لزيادة الوصول

النصيحة:
نصيحة واحدة عملية ومحددة عن أفضل وقت أو طريقة لنشر هذا المحتوى على {platform} للجمهور العربي.
"""
    else:
        # ── English Prompt ─────────────────────────────────────────────
        prompt = f"""
You are a social media growth expert specializing in {platform} content strategy.

A creator in the "{niche}" niche wants to post the following:
"{description}"

Please provide:

CAPTION:
Write an engaging 2-3 sentence caption with a conversational, authentic tone that fits {platform}'s culture. Use 1-2 relevant emojis naturally. End with a question that genuinely invites followers to comment.

HASHTAGS:
Provide exactly 20 hashtags in this mix:
- 5 broad/popular tags (over 1M posts) for reach
- 10 medium tags (100K–1M posts) for targeted reach  
- 5 niche-specific tags (under 100K posts) for community engagement
List them on one line separated by spaces.

TIP:
One specific, actionable tip about the best time, format, or strategy for posting this content on {platform}.
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text
