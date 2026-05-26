# Captionly App

A simple Streamlit app that generates social media captions, hashtags, and posting tips using Google's Gemini API.

## Features

- English and Arabic caption generation
- Platform-specific prompts for Instagram and TikTok
- Styled Streamlit UI with copyable results
- Error handling for API failures

## Requirements

- Python 3.11+
- `GEMINI_API_KEY` set in a `.env` file

## Setup

```bash
cd /home/ahmed/projects/caption_generator
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file with your Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Run

```bash
streamlit run app.py
```

Then open the local URL shown in the terminal.

## Notes

- If the app returns an error or the generator fails, the Gemini API quota may be exhausted.
- This app currently uses `gemini-2.0-flash` for content generation.
