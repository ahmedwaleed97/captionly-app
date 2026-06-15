'use client';

import { useState } from 'react';

const NICHES = [
  'Food & Cooking 🍳', 'Fitness 💪', 'Travel ✈️',
  'Fashion 👗', 'Tech 💻', 'Business 📈',
  'Lifestyle 🌿', 'Beauty 💄', 'Other',
];

const UI = {
  English: {
    logoName: 'Captionly ✨',
    tagline: 'AI-powered captions & hashtags in seconds',
    platformLabel: 'Platform',
    nicheLabel: 'Niche',
    descLabel: 'Describe your post',
    placeholder: 'Example: Morning coffee next to a book in a cozy café, warm lighting',
    btnText: '✨ Generate Caption',
    warnText: '⚠️ Please describe your post first!',
    spinText: '⏳ Crafting your caption...',
    copyLabel: '📋 Copy Result',
  },
  Arabic: {
    logoName: 'كابشنلي ✨',
    tagline: 'اصنع تعليقاً احترافياً في ثوانٍ',
    platformLabel: 'المنصة',
    nicheLabel: 'التخصص',
    descLabel: 'وصف المنشور',
    placeholder: 'مثال: صورة لقهوتي الصباحية بجانب كتاب في مقهى هادئ',
    btnText: '✨ أنشئ التعليق',
    warnText: '⚠️ من فضلك اكتب وصف المنشور أولاً',
    spinText: '⏳ جارٍ الإبداع...',
    copyLabel: '📋 انسخ النتيجة',
  },
};

const select = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  color: '#e8e8f0',
  padding: '0.6rem 0.8rem',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  outline: 'none',
  cursor: 'pointer',
};

const textarea = {
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color: '#ffffff',
  padding: '0.75rem',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  outline: 'none',
  resize: 'none',
};

export default function Home() {
  const [language, setLanguage] = useState('English');
  const [platform, setPlatform] = useState('Instagram');
  const [niche, setNiche] = useState('Food & Cooking 🍳');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const t = UI[language];
  const isArabic = language === 'Arabic';

  const handleGenerate = async () => {
    if (!description.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, platform, niche, language }),
      });
      const data = await res.json();
      setResult(data.result || data.error || 'Something went wrong.');
    } catch {
      setResult('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Language toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['English', 'Arabic'].map(lang => (
          <button
            key={lang}
            onClick={() => { setLanguage(lang); setResult(''); setShowWarning(false); }}
            style={{
              background: language === lang ? 'rgba(124,58,237,0.3)' : 'transparent',
              border: `1px solid ${language === lang ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: 8,
              color: language === lang ? '#a78bfa' : '#9ca3af',
              padding: '0.4rem 1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            {lang === 'Arabic' ? 'العربية' : 'English'}
          </button>
        ))}
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {t.logoName}
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>{t.tagline}</p>
      </div>

      {/* Platform & Niche */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            {t.platformLabel}
          </label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} style={select}>
            <option>Instagram</option>
            <option>TikTok</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            {t.nicheLabel}
          </label>
          <select value={niche} onChange={e => setNiche(e.target.value)} style={select}>
            {NICHES.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          {t.descLabel}
        </label>
        <textarea
          value={description}
          onChange={e => { setDescription(e.target.value); setShowWarning(false); }}
          placeholder={t.placeholder}
          rows={5}
          dir={isArabic ? 'rtl' : 'ltr'}
          style={textarea}
        />
      </div>

      {/* Warning */}
      {showWarning && (
        <div style={{
          background: 'rgba(234,179,8,0.15)',
          border: '1px solid rgba(234,179,8,0.3)',
          borderRadius: 10,
          padding: '0.75rem 1rem',
          color: '#fbbf24',
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}>
          {t.warnText}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          padding: '0.85rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '1rem',
          fontFamily: 'inherit',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? t.spinText : t.btnText}
      </button>

      {/* Result */}
      {result && (
        <>
          <div style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 16,
            padding: '1.5rem 2rem',
            marginTop: '1.5rem',
            lineHeight: isArabic ? 2.2 : 1.8,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            direction: isArabic ? 'rtl' : 'ltr',
            textAlign: isArabic ? 'right' : 'left',
            fontSize: isArabic ? '1.05rem' : '1rem',
          }}>
            {result}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              {t.copyLabel}
            </label>
            <textarea
              readOnly
              value={result}
              rows={7}
              style={{ ...textarea, resize: 'vertical' }}
            />
          </div>
        </>
      )}
    </main>
  );
}
