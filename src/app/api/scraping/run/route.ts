import { NextRequest, NextResponse } from 'next/server';
import { advancedScraper } from '@/lib/advanced-scraper';

// POST /api/scraping/run - Esegue scraping manuale o schedulato
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key');
    
    // Verifica API key per sicurezza (per chiamate da cron job esterni)
    if (apiKey && apiKey !== process.env.SCRAPING_API_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    console.log('🚀 Starting manual scraping run...');
    
    const results = await advancedScraper.runScheduledScraping() || [];
    
    const summary = {
      timestamp: new Date().toISOString(),
      total_targets: results.length,
      successful_targets: results.filter(r => r.success).length,
      failed_targets: results.filter(r => !r.success).length,
      total_events_found: results.reduce((sum, r) => sum + r.events, 0),
      results: results
    };

    console.log('✅ Scraping completed:', summary);
    
    return NextResponse.json({ 
      message: 'Scraping completed successfully',
      summary 
    });

  } catch (error: any) {
    console.error('Scraping API error:', error);
    return NextResponse.json({ 
      error: 'Scraping failed', 
      details: error.message 
    }, { status: 500 });
  }
}

// GET /api/scraping/run - Status dello scraping
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      message: 'Scraping API is active',
      timestamp: new Date().toISOString(),
      endpoints: {
        'POST /api/scraping/run': 'Execute scraping',
        'GET /api/scraping/targets': 'Get scraping targets',
        'POST /api/scraping/targets': 'Add scraping target'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'API error', 
      details: error.message 
    }, { status: 500 });
  }
}
