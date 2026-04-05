-- Seed: initial BaZi report template (bazi-basic-en).
-- This is the first purchasable report product ($8.99 USD).
--
-- template_json defines report STRUCTURE (section keys + order).
-- Actual section CONTENT is resolved at generation time by
-- worker-report/src/templates/*.js content modules keyed by
-- the user's chart data (Day Master element, pillar branches, etc.).

INSERT INTO report_templates (
  id,
  slug,
  title,
  description,
  locale,
  category,
  version,
  price_cents,
  currency,
  template_json,
  is_active
) VALUES (
  'tpl_bazi_basic_en_v1',
  'bazi-basic-en',
  'BaZi Four Pillars of Destiny — Personal Analysis',
  'Comprehensive 15-page BaZi chart analysis with Day Master profile, Five Elements balance, career guidance, relationship insights, health tendencies, and 10-year luck cycle forecast. Generated from your exact birth data using True Solar Time.',
  'en',
  'bazi',
  1,
  899,
  'USD',
  '{
    "reportTitle": "BaZi Four Pillars of Destiny — Personal Analysis",
    "pageSize": "A4",
    "margins": { "top": 60, "right": 60, "bottom": 60, "left": 60 },
    "theme": {
      "primaryColour": "#8B1A1A",
      "accentColour": "#C5A55A",
      "bodyFont": "Helvetica",
      "headingFont": "Helvetica-Bold",
      "bodySize": 11,
      "headingSize": 16
    },
    "sections": [
      {
        "key": "cover",
        "title": "Cover Page",
        "order": 1,
        "type": "cover",
        "fields": ["birthDate", "birthTime", "dayMaster", "generatedAt"]
      },
      {
        "key": "day-master",
        "title": "Your Day Master",
        "order": 2,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 2,
        "description": "In-depth profile of your Day Master stem — personality archetype, strengths, weaknesses, and life approach."
      },
      {
        "key": "pillars",
        "title": "The Four Pillars Breakdown",
        "order": 3,
        "type": "mixed",
        "dataKey": "pillars",
        "estimatedPages": 2,
        "description": "Analysis of each pillar (Year, Month, Day, Hour) with stem-branch interactions, hidden stems, and Na Yin."
      },
      {
        "key": "five-elements",
        "title": "Five Elements Balance",
        "order": 4,
        "type": "narrative",
        "dataKey": "fiveElements",
        "estimatedPages": 1.5,
        "description": "Elemental composition analysis — dominant and deficient elements, strong vs weak Day Master assessment."
      },
      {
        "key": "personality",
        "title": "Personality Profile",
        "order": 5,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 1.5,
        "description": "Character traits derived from Day Master element and yin/yang polarity, modulated by pillar interactions."
      },
      {
        "key": "career",
        "title": "Career & Wealth",
        "order": 6,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 1.5,
        "description": "Career aptitudes, wealth patterns, and professional guidance based on your elemental profile."
      },
      {
        "key": "relationships",
        "title": "Relationships & Compatibility",
        "order": 7,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 1.5,
        "description": "Relationship tendencies, ideal partner elements, and compatibility dynamics from your chart."
      },
      {
        "key": "health",
        "title": "Health Tendencies",
        "order": 8,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 1,
        "description": "Five Elements organ correspondences and health vulnerabilities based on elemental balance."
      },
      {
        "key": "luck-cycles",
        "title": "Major Luck Cycles (Da Yun)",
        "order": 9,
        "type": "mixed",
        "dataKey": "daYun",
        "estimatedPages": 1.5,
        "description": "Your 10-year luck periods with stem-branch analysis and transition guidance."
      },
      {
        "key": "current-year",
        "title": "2026 Year of the Fire Horse Forecast",
        "order": 10,
        "type": "narrative",
        "dataKey": "dayMaster.element",
        "estimatedPages": 1.5,
        "description": "How the 2026 Fire Horse year energy interacts with your Day Master, with monthly highlights."
      }
    ]
  }',
  1
);
