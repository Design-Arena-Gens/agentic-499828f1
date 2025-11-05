import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
  });
}

interface TrendAnalysis {
  ideas: string[];
  keywords: string[];
  popularThemes: string[];
}

export async function analyzeTrends(niche: string): Promise<TrendAnalysis> {
  try {
    // Use OpenAI to analyze trends and generate ideas
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a Redbubble design trend analyst. Analyze current trends and provide design ideas for the given niche. Focus on what's currently popular on print-on-demand platforms and social media.`
        },
        {
          role: 'user',
          content: `Analyze trending design ideas for the "${niche}" niche on Redbubble. Provide:
1. 5 specific design ideas that would perform well
2. 15 high-ranking keywords for this niche
3. 5 popular themes currently trending

Format as JSON with keys: ideas (array), keywords (array), popularThemes (array)`
        }
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return {
      ideas: parsed.ideas || [],
      keywords: parsed.keywords || [],
      popularThemes: parsed.popularThemes || [],
    };
  } catch (error) {
    console.error('Error analyzing trends:', error);

    // Fallback to generic ideas
    return {
      ideas: [
        `${niche} typography design`,
        `Minimalist ${niche} illustration`,
        `Vintage ${niche} aesthetic`,
        `Modern ${niche} pattern`,
        `Abstract ${niche} art`
      ],
      keywords: [
        niche,
        `${niche} design`,
        `${niche} art`,
        `${niche} gift`,
        `${niche} merch`
      ],
      popularThemes: [
        'Typography',
        'Minimalist',
        'Vintage',
        'Modern',
        'Abstract'
      ]
    };
  }
}

export async function generateDesignConcept(niche: string, trends: TrendAnalysis): Promise<string> {
  // Select a random idea from trends
  const randomIdea = trends.ideas[Math.floor(Math.random() * trends.ideas.length)];

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a creative designer for Redbubble. Generate unique design concepts that will sell well.'
        },
        {
          role: 'user',
          content: `Create a detailed design concept based on this idea: "${randomIdea}" in the ${niche} niche. Include visual elements, colors, style, and composition. Keep it concise but descriptive for DALL-E image generation.`
        }
      ],
      temperature: 0.9,
    });

    return completion.choices[0].message.content || randomIdea;
  } catch (error) {
    console.error('Error generating design concept:', error);
    return randomIdea;
  }
}
