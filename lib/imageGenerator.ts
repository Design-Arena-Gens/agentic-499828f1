import OpenAI from 'openai';
import axios from 'axios';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
  });
}

export async function generateImage(designConcept: string): Promise<{ imageUrl: string; imageBuffer: Buffer }> {
  try {
    // Generate image using DALL-E 3
    const openai = getOpenAIClient();
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a high-quality, professional design for print-on-demand products. ${designConcept}. The design should be eye-catching, commercially viable, and suitable for t-shirts, stickers, and other merchandise. Ensure the design has good contrast and no text unless specified. Style: modern, clean, professional.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from DALL-E');
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(imageResponse.data);

    return {
      imageUrl,
      imageBuffer,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image');
  }
}
