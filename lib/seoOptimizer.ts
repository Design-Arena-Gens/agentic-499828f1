import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
  });
}

interface SEOContent {
  title: string;
  description: string;
  tags: string[];
}

export async function generateSEOContent(
  niche: string,
  designConcept: string,
  keywords: string[]
): Promise<SEOContent> {
  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert for Redbubble. Generate optimized titles, descriptions, and tags that will rank well in Redbubble search and attract buyers. Use clickbait techniques while remaining honest.`
        },
        {
          role: 'user',
          content: `Create SEO-optimized content for this Redbubble design:

Niche: ${niche}
Design: ${designConcept}
Keywords: ${keywords.join(', ')}

Generate:
1. A clickbait-style title (max 100 characters) that includes top keywords and attracts clicks
2. An SEO-optimized description (200-300 words) naturally incorporating keywords, describing the design, its uses, and why people should buy it
3. Exactly 15 high-ranking tags (each 2-3 words max) related to the design

Format as JSON with keys: title, description, tags (array of 15 strings)`
        }
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    // Ensure we have exactly 15 tags
    let tags = parsed.tags || [];
    if (tags.length < 15) {
      // Add more generic tags if needed
      const additionalTags = [
        niche,
        `${niche} design`,
        `${niche} art`,
        `${niche} gift`,
        `${niche} merch`,
        `${niche} tshirt`,
        `${niche} sticker`,
        'unique design',
        'trendy',
        'cool',
        'aesthetic',
        'gift idea',
        'merchandise',
        'print design',
        'graphic design'
      ];

      for (const tag of additionalTags) {
        if (tags.length >= 15) break;
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
    }

    tags = tags.slice(0, 15);

    return {
      title: parsed.title || `Amazing ${niche} Design - Unique & Trending`,
      description: parsed.description || `Check out this incredible ${niche} design! Perfect for anyone who loves ${niche}. High-quality print on various products. ${designConcept}`,
      tags,
    };
  } catch (error) {
    console.error('Error generating SEO content:', error);

    // Fallback SEO content
    return {
      title: `Amazing ${niche} Design - Must Have!`,
      description: `Discover this unique ${niche} design! ${designConcept}. Perfect for gifts, personal use, or showing your love for ${niche}. High-quality print on t-shirts, stickers, phone cases, and more. Stand out with this eye-catching design that everyone will love. Makes a great gift for birthdays, holidays, or any special occasion. Order yours today!`,
      tags: [
        niche,
        `${niche} design`,
        `${niche} art`,
        `${niche} gift`,
        `${niche} tshirt`,
        `${niche} merch`,
        'unique design',
        'cool',
        'trendy',
        'aesthetic',
        'gift idea',
        'graphic design',
        'print',
        'merchandise',
        'apparel'
      ]
    };
  }
}

export function optimizeTags(tags: string[]): string[] {
  // Remove duplicates and ensure proper formatting
  const uniqueTags = [...new Set(tags)];

  // Clean tags (lowercase, trim, remove special chars)
  const cleanedTags = uniqueTags.map(tag =>
    tag.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '')
  );

  return cleanedTags.filter(tag => tag.length > 0).slice(0, 15);
}
