import streamlit as st
from generator import generate_caption

# ─────────────────────────────────────────────
#  Page config — must be the very first Streamlit call
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Captionly",
    page_icon="✨",
    layout="centered"   # centered feels cleaner than wide for this use case
)

# ─────────────────────────────────────────────
#  Global CSS — this is where the modern look comes from
#  We inject raw CSS into the page using st.markdown
#  unsafe_allow_html=True lets us write actual HTML/CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
    /* Import a clean modern font from Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Apply the font to everything */
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Dark gradient background — gives that premium AI-tool feel */
    .stApp {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
        color: #e8e8f0;
    }



    /* The app logo/name at the top */
    .app-logo {
        text-align: center;
        padding: 2rem 0 1rem 0;
    }

    .app-logo h1 {
        font-size: 2.8rem;
        font-weight: 700;
        /* Purple to pink gradient on the text itself */
        background: linear-gradient(135deg, #a78bfa, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
    }

    .app-logo p {
        color: #9ca3af;
        font-size: 1rem;
        margin-top: 0.5rem;
    }

    /* Style the generate button */
    .stButton > button {
        background: linear-gradient(135deg, #7c3aed, #db2777) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 0.75rem 2rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        width: 100% !important;
        transition: opacity 0.2s ease !important;
    }

    .stButton > button:hover {
        opacity: 0.85 !important;
    }

    /* Style all dropdown selects */
    .stSelectbox > div > div {
        background: rgba(255,255,255,0.07) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 10px !important;
        color: white !important;
    }

    /* Text areas — typed text and placeholder both visible on a black box */
    .stTextArea textarea,
    .stTextArea textarea:focus,
    .stTextArea textarea:hover {
        background: rgba(0, 0, 0, 0.95) !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        border-radius: 10px !important;
        color: #ffffff !important;
        opacity: 1 !important;
        caret-color: #a78bfa !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        line-height: 1.6 !important;
    }

    /* Placeholder text — slightly dimmer than real text */
    .stTextArea textarea::placeholder {
        color: rgba(255, 255, 255, 0.6) !important;
        opacity: 1 !important;
    }

    /* Fix selectbox dropdown text color too */
    .stSelectbox > div > div > div {
        color: #e8e8f0 !important;
    }

    /* The result card that appears after generation */
    .result-card {
        background: rgba(124, 58, 237, 0.15);
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 16px;
        padding: 1.5rem 2rem;
        margin: 1rem 0;
        line-height: 1.8;
    }

    /* Arabic result card — right to left */
    .result-card-ar {
        background: rgba(124, 58, 237, 0.15);
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 16px;
        padding: 1.5rem 2rem;
        margin: 1rem 0;
        line-height: 2.2;       /* Arabic text needs more line height */
        direction: rtl;
        text-align: right;
        font-size: 1.05rem;
    }

    /* Section labels inside the result (CAPTION:, HASHTAGS:, TIP:) */
    .section-label {
        color: #a78bfa;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-top: 1rem;
    }

    /* Hide Streamlit's default header and footer for a cleaner look */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  Language Toggle
# ─────────────────────────────────────────────
lang_choice = st.radio(
    "🌐",
    options=["English", "العربية"],
    index=0,
    horizontal=True,
    label_visibility="collapsed"  # hides the "🌐" label, keeps the radio clean
)
language = "Arabic" if lang_choice == "العربية" else "English"

# ─────────────────────────────────────────────
#  UI Text — English and Arabic versions
# ─────────────────────────────────────────────
if language == "Arabic":
    logo_name     = "كابشنلي ✨"
    tagline       = "اصنع تعليقاً احترافياً في ثوانٍ"
    platform_label   = "المنصة"
    niche_label      = "التخصص"
    desc_label       = "وصف المنشور"
    placeholder      = "مثال: صورة لقهوتي الصباحية بجانب كتاب في مقهى هادئ"
    btn_text         = "✨ أنشئ التعليق"
    warn_text        = "⚠️ من فضلك اكتب وصف المنشور أولاً"
    spin_text        = "⏳ جارٍ الإبداع..."
    copy_label       = "📋 انسخ النتيجة"
    tip_label        = "💡 نصيحة النشر"
else:
    logo_name     = "Captionly ✨"
    tagline       = "AI-powered captions & hashtags in seconds"
    platform_label   = "Platform"
    niche_label      = "Niche"
    desc_label       = "Describe your post"
    placeholder      = "Example: Morning coffee next to a book in a cozy café, warm lighting"
    btn_text         = "✨ Generate Caption"
    warn_text        = "⚠️ Please describe your post first!"
    spin_text        = "⏳ Crafting your caption..."
    copy_label       = "📋 Copy Result"
    tip_label        = "💡 Posting Tip"

# ─────────────────────────────────────────────
#  App Header / Logo
# ─────────────────────────────────────────────
st.markdown(f"""
<div class='app-logo'>
    <h1>{logo_name}</h1>
    <p>{tagline}</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────

# ─────────────────────────────────────────────


col1, col2 = st.columns(2)
with col1:
    platform = st.selectbox(platform_label, ["Instagram", "TikTok"])
with col2:
    niche = st.selectbox(niche_label, [
        "Food & Cooking 🍳", "Fitness 💪", "Travel ✈️",
        "Fashion 👗", "Tech 💻", "Business 📈",
        "Lifestyle 🌿", "Beauty 💄", "Other"
    ])

description = st.text_area(
    desc_label,
    placeholder=placeholder,
    height=160,
    key="description_input",
    label_visibility="visible",
    value=st.session_state.get("description_input", "")
)

st.markdown("</div>", unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  Generate Button + Results
# ─────────────────────────────────────────────
if st.button(btn_text, type="primary"):
    if not description.strip():
        st.warning(warn_text)
    else:
        with st.spinner(spin_text):
            result = generate_caption(description, platform, niche, language=language)

        # Display result in the styled card
        if language == "Arabic":
            st.markdown(f"<div class='result-card-ar'>{result}</div>", unsafe_allow_html=True)
        else:
            st.markdown(f"<div class='result-card'>{result}</div>", unsafe_allow_html=True)

        # Copy-friendly plain text box below the styled result
        st.text_area(copy_label, value=result, height=180)
