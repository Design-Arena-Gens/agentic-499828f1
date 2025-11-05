import { analyzeTrends, generateDesignConcept } from './trendAnalyzer';
import { generateImage } from './imageGenerator';
import { generateSEOContent } from './seoOptimizer';
import { simulateUpload } from './redbubbleUploader';

interface DesignResult {
  success: boolean;
  title?: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  error?: string;
}

export async function generateAndUploadDesign(niche: string): Promise<DesignResult> {
  try {
    console.log(`[1/5] Analyzing trends for niche: ${niche}`);
    const trends = await analyzeTrends(niche);

    console.log(`[2/5] Generating design concept...`);
    const designConcept = await generateDesignConcept(niche, trends);

    console.log(`[3/5] Creating image with DALL-E...`);
    const { imageUrl, imageBuffer } = await generateImage(designConcept);

    console.log(`[4/5] Optimizing SEO content...`);
    const seoContent = await generateSEOContent(niche, designConcept, trends.keywords);

    console.log(`[5/5] Uploading to Redbubble...`);
    await simulateUpload({
      title: seoContent.title,
      description: seoContent.description,
      tags: seoContent.tags,
      imageBuffer,
    });

    console.log('✓ Design successfully generated and uploaded!');

    return {
      success: true,
      title: seoContent.title,
      description: seoContent.description,
      tags: seoContent.tags,
      imageUrl,
    };
  } catch (error) {
    console.error('Error in automation pipeline:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function runDailyAutomation(niche: string, uploadsPerDay: number = 3) {
  console.log(`Starting daily automation: ${uploadsPerDay} uploads for niche "${niche}"`);

  const results = [];

  for (let i = 0; i < uploadsPerDay; i++) {
    console.log(`\n=== Upload ${i + 1}/${uploadsPerDay} ===`);

    try {
      const result = await generateAndUploadDesign(niche);
      results.push(result);

      // Add delay between uploads to avoid rate limiting
      if (i < uploadsPerDay - 1) {
        console.log('Waiting 30 seconds before next upload...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    } catch (error) {
      console.error(`Failed upload ${i + 1}:`, error);
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✓ Daily automation complete: ${successCount}/${uploadsPerDay} successful uploads`);

  return results;
}
