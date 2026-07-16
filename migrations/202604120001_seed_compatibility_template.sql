-- Seed: compatibility report template (compat-en).
-- Second purchasable report product ($4.99 USD).
--
-- template_json defines report STRUCTURE (section keys + order).
-- Section CONTENT is assembled at generation time from pair data
-- sent by the frontend (animal traits, relationship type, elements).

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
  'tpl_compat_en_v1',
  'compat-en',
  'Zodiac Compatibility — Detailed Analysis',
  'Comprehensive 8–10 page compatibility analysis covering relationship dynamics, element interactions, personality, love, career, communication, and growth areas for any zodiac pairing.',
  'en',
  'compatibility',
  1,
  499,
  'USD',
  '{
    "reportTitle": "Zodiac Compatibility — Detailed Analysis",
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
        "fields": ["animalA", "animalB", "relLabel", "generatedAt"]
      },
      {
        "key": "relationship-overview",
        "title": "Relationship Overview",
        "order": 2,
        "type": "narrative",
        "dataKey": "relType",
        "estimatedPages": 1.5,
        "description": "Classical relationship type analysis — Six Harmonies, Three Harmonies, Clashes, Harms, or Neutral dynamics."
      },
      {
        "key": "element-interaction",
        "title": "Element Interaction Analysis",
        "order": 3,
        "type": "narrative",
        "dataKey": "elInteraction",
        "estimatedPages": 1,
        "description": "How the fixed elements of each animal interact through the generating, overcoming, or same-element cycles."
      },
      {
        "key": "personality-dynamics",
        "title": "Personality Dynamics",
        "order": 4,
        "type": "narrative",
        "dataKey": "pairAnalysis",
        "estimatedPages": 1.5,
        "description": "In-depth personality analysis of both animals and how their traits interact in partnership."
      },
      {
        "key": "love-romance",
        "title": "Love & Romance",
        "order": 5,
        "type": "narrative",
        "dataKey": "loveStyle",
        "estimatedPages": 1,
        "description": "Romantic compatibility — how each animal expresses and receives love, and where styles align or conflict."
      },
      {
        "key": "career-business",
        "title": "Career & Business Partnership",
        "order": 6,
        "type": "narrative",
        "dataKey": "workStyle",
        "estimatedPages": 1,
        "description": "Professional dynamics — work styles, leadership preferences, and collaboration strengths."
      },
      {
        "key": "communication-guide",
        "title": "Communication Guide",
        "order": 7,
        "type": "narrative",
        "dataKey": "socialNeed",
        "estimatedPages": 1,
        "description": "Social needs, stress triggers, and practical strategies for effective communication."
      },
      {
        "key": "challenges-growth",
        "title": "Challenges & Growth Areas",
        "order": 8,
        "type": "narrative",
        "dataKey": "advice",
        "estimatedPages": 1,
        "description": "Potential friction points and actionable guidance for turning challenges into growth opportunities."
      },
      {
        "key": "key-dates",
        "title": "Key Dates & Timing",
        "order": 9,
        "type": "narrative",
        "dataKey": "timing",
        "estimatedPages": 1,
        "description": "Auspicious years, seasonal influences, and timing considerations for the pairing."
      }
    ]
  }',
  1
);
