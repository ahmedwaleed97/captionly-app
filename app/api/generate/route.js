import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
    }

    const { description, platform, niche, language } = await request.json();

    if (!description?.trim()) {
      return Response.json({ error: 'Description is required.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let prompt;
    if (language?.toLowerCase().startsWith('ar')) {
      prompt = `أنت خبير في وسائل التواصل الاجتماعي متخصص في تنمية الحسابات على منصة ${platform} للجمهور العربي.

صانع محتوى في مجال "${niche}" يريد نشر المحتوى التالي:
"${description}"

اكتب المحتوى باللغة العربية الفصحى المبسطة المناسبة لوسائل التواصل الاجتماعي (وليس اللهجة العامية الضيقة).
إذا كان الوصف بلغة أخرى، ترجمه أولاً وأنشئ المحتوى عربياً.

قدّم ما يلي:

التعليق:
اكتب تعليقاً جذاباً من 2-3 جمل يناسب ${platform}، بأسلوب حيوي وودّي، واختمه بسؤال يشجع المتابعين على التعليق. استخدم الإيموجي بشكل طبيعي وغير مبالغ فيه.

الهاشتاغات:
أعطِ 20 هاشتاغاً — مزيج من:
- هاشتاغات عربية شائعة (أكثر من 1M منشور)
- هاشتاغات عربية متوسطة (100K-1M)
- هاشتاغات عربية متخصصة في مجال ${niche} (أقل من 100K)
- 4-5 هاشتاغات إنجليزية تكميلية لزيادة الوصول

النصيحة:
نصيحة واحدة عملية ومحددة عن أفضل وقت أو طريقة لنشر هذا المحتوى على ${platform} للجمهور العربي.`;
    } else {
      prompt = `You are a social media growth expert specializing in ${platform} content strategy.

A creator in the "${niche}" niche wants to post the following:
"${description}"

Please provide:

CAPTION:
Write an engaging 2-3 sentence caption with a conversational, authentic tone that fits ${platform}'s culture. Use 1-2 relevant emojis naturally. End with a question that genuinely invites followers to comment.

HASHTAGS:
Provide exactly 20 hashtags in this mix:
- 5 broad/popular tags (over 1M posts) for reach
- 10 medium tags (100K–1M posts) for targeted reach
- 5 niche-specific tags (under 100K posts) for community engagement
List them on one line separated by spaces.

TIP:
One specific, actionable tip about the best time, format, or strategy for posting this content on ${platform}.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return Response.json({ result: response.text });
  } catch (error) {
    console.error('Gemini API error:', error);
    const msg = error?.message ?? '';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      return Response.json(
        { error: '⚠️ Gemini API quota exceeded. Your free tier daily limit is used up — wait until tomorrow or add billing at https://ai.google.dev' },
        { status: 429 }
      );
    }
    if (msg.includes('API_KEY') || msg.includes('401') || msg.includes('403')) {
      return Response.json({ error: '⚠️ Invalid Gemini API key. Check your GEMINI_API_KEY.' }, { status: 401 });
    }
    return Response.json({ error: `Error: ${msg || 'Something went wrong.'}` }, { status: 500 });
  }
}
