import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapingTarget } from '@/types/alerts';
import { alertManager } from './alert-manager';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapedEvent {
  title: string;
  date: string;
  location: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  source_url: string;
  category: string;
  image_url?: string;
}

export class AdvancedScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async runScheduledScraping() {
    console.log('🚀 Starting scheduled scraping...');
    
    // Ottieni tutti i target di scraping attivi
    const { data: targets, error } = await supabase
      .from('scraping_targets')
      .select('*')
      .eq('enabled', true);

    if (error) {
      console.error('Error fetching scraping targets:', error);
      return [];
    }

    const results = [];
    for (const target of targets || []) {
      try {
        const events = await this.scrapeTarget(target);
        results.push({ target: target.name, events: events.length, success: true });
        
        if (events.length > 0) {
          await this.saveEvents(events, target);
          // Trigger alert processing per nuovi eventi
          await alertManager.processNewEvents(events);
        }
        
        // Aggiorna statistiche target
        await this.updateTargetStats(target.id, true);
        
      } catch (error: any) {
        console.error(`Error scraping ${target.name}:`, error);
        results.push({ target: target.name, events: 0, success: false, error: error.message });
        await this.updateTargetStats(target.id, false);
      }
    }

    console.log('✅ Scraping completed:', results);
    return results;
  }

  private async scrapeTarget(target: ScrapingTarget): Promise<ScrapedEvent[]> {
    console.log(`🔍 Scraping ${target.name} (${target.url})`);
    
    const response = await axios.get(target.url, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // Strategia di scraping basata sul sito
    switch (target.category) {
      case 'eventi':
        return this.scrapeEventiGenerici($, target);
      case 'concerti':
        return this.scrapeConcerti($, target);
      case 'sagre':
        return this.scrapeSagre($, target);
      case 'festival':
        return this.scrapeFestival($, target);
      case 'mercatini':
        return this.scrapeMercatini($, target);
      case 'aperture':
        return this.scrapeAperture($, target);
      default:
        return this.scrapeGenerico($, target);
    }
  }

  private scrapeEventiGenerici($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    // Trova tutti gli elementi evento
    const eventElements = $(config.title).parent().parent();
    
    eventElements.each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title);
        const date = this.extractDate($el, config.date);
        const location = this.extractText($el, config.location);
        const description = config.description ? this.extractText($el, config.description) : '';
        const link = config.link ? this.extractLink($el, config.link, target.url) : target.url;
        const image = config.image ? this.extractImage($el, config.image, target.url) : '';

        if (title && date && location) {
          events.push({
            title: this.cleanText(title),
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: link,
            category: target.category,
            image_url: image,
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing event ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeConcerti($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    $('.event-item, .concert-item, .show-item').each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title || '.event-title, .concert-title, h3, h2');
        const date = this.extractDate($el, config.date || '.event-date, .concert-date, .date');
        const location = this.extractText($el, config.location || '.venue, .location, .event-venue');
        const description = this.extractText($el, config.description || '.description, .event-description');
        const link = this.extractLink($el, config.link || 'a', target.url);

        if (title && date && location) {
          events.push({
            title: `🎵 ${this.cleanText(title)}`,
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: link,
            category: 'concerti',
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing concert ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeSagre($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    $('.sagra-item, .festa-item, .event-item').each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title || '.sagra-title, .festa-title, h3');
        const date = this.extractDate($el, config.date || '.sagra-date, .festa-date, .date');
        const location = this.extractText($el, config.location || '.sagra-location, .location');
        const description = this.extractText($el, config.description || '.description');

        if (title && date && location) {
          events.push({
            title: `🍝 ${this.cleanText(title)}`,
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: target.url,
            category: 'sagre',
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing sagra ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeFestival($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    $('.festival-item, .event-item, .rassegna-item').each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title || '.festival-title, h2, h3');
        const date = this.extractDate($el, config.date || '.festival-date, .date');
        const location = this.extractText($el, config.location || '.festival-location, .location');
        const description = this.extractText($el, config.description || '.description, .festival-description');

        if (title && date && location) {
          events.push({
            title: `🎪 ${this.cleanText(title)}`,
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: target.url,
            category: 'festival',
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing festival ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeMercatini($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    $('.mercatino-item, .market-item, .event-item').each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title || '.mercatino-title, .market-title, h3');
        const date = this.extractDate($el, config.date || '.mercatino-date, .market-date, .date');
        const location = this.extractText($el, config.location || '.mercatino-location, .location');
        const description = this.extractText($el, config.description || '.description');

        if (title && date && location) {
          events.push({
            title: `🛍️ ${this.cleanText(title)}`,
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: target.url,
            category: 'mercatini',
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing mercatino ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeAperture($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    const events: ScrapedEvent[] = [];
    const config = target.selector_config;

    $('.news-item, .apertura-item, .inaugurazione-item').each((index, element) => {
      try {
        const $el = $(element);
        
        const title = this.extractText($el, config.title || '.news-title, .apertura-title, h3');
        const date = this.extractDate($el, config.date || '.news-date, .apertura-date, .date');
        const location = this.extractText($el, config.location || '.news-location, .location');
        const description = this.extractText($el, config.description || '.news-content, .description');

        // Filtra solo aperture/inaugurazioni
        const titleLower = title.toLowerCase();
        if (titleLower.includes('apertura') || titleLower.includes('inaugurazione') || 
            titleLower.includes('nuovo') || titleLower.includes('apre')) {
          
          events.push({
            title: `🏪 ${this.cleanText(title)}`,
            date: this.normalizeDate(date),
            location: this.cleanText(location),
            description: this.cleanText(description),
            source_url: target.url,
            category: 'aperture',
            contact_email: this.extractEmail(description),
            contact_phone: this.extractPhone(description)
          });
        }
      } catch (error) {
        console.warn(`Error parsing apertura ${index}:`, error);
      }
    });

    return events;
  }

  private scrapeGenerico($: cheerio.CheerioAPI, target: ScrapingTarget): ScrapedEvent[] {
    return this.scrapeEventiGenerici($, target);
  }

  // Utility methods
  private extractText($el: cheerio.Cheerio<any>, selector: string): string {
    return $el.find(selector).first().text().trim() || $el.filter(selector).text().trim();
  }

  private extractDate($el: cheerio.Cheerio<any>, selector: string): string {
    const dateText = this.extractText($el, selector);
    return this.normalizeDate(dateText);
  }

  private extractLink($el: cheerio.Cheerio<any>, selector: string, baseUrl: string): string {
    const href = $el.find(selector).first().attr('href') || $el.filter(selector).attr('href');
    if (!href) return baseUrl;
    
    if (href.startsWith('http')) return href;
    if (href.startsWith('/')) return new URL(href, baseUrl).toString();
    return new URL(href, baseUrl).toString();
  }

  private extractImage($el: cheerio.Cheerio<any>, selector: string, baseUrl: string): string {
    const src = $el.find(selector).first().attr('src') || $el.find('img').first().attr('src');
    if (!src) return '';
    
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) return new URL(src, baseUrl).toString();
    return new URL(src, baseUrl).toString();
  }

  private extractEmail(text: string): string | undefined {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  private extractPhone(text: string): string | undefined {
    const phoneRegex = /(\+39\s?)?(\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/;
    const match = text.match(phoneRegex);
    return match ? match[0] : undefined;
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private normalizeDate(dateStr: string): string {
    // Prova a parsare vari formati di data italiani
    const cleanDate = dateStr.replace(/[^\d\/\-\.\s]/g, '').trim();
    
    try {
      // Formato DD/MM/YYYY o DD-MM-YYYY
      const parts = cleanDate.split(/[\/\-\.]/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        
        if (day <= 31 && month <= 12 && year >= 2024) {
          return new Date(year, month - 1, day).toISOString().split('T')[0];
        }
      }
      
      // Fallback: prova parsing diretto
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Date parsing failed:', dateStr);
    }
    
    // Fallback: data di oggi
    return new Date().toISOString().split('T')[0];
  }

  private async saveEvents(events: ScrapedEvent[], target: ScrapingTarget) {
    console.log(`💾 Saving ${events.length} events from ${target.name}`);
    
    for (const event of events) {
      try {
        // Controlla se l'evento esiste già
        const { data: existing } = await supabase
          .from('eventi')
          .select('id')
          .eq('title', event.title)
          .eq('date', event.date)
          .eq('location', event.location)
          .single();

        if (!existing) {
          await supabase
            .from('eventi')
            .insert({
              ...event,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.warn('Error saving event:', error);
      }
    }
  }

  private async updateTargetStats(targetId: string, success: boolean) {
    const { data: target } = await supabase
      .from('scraping_targets')
      .select('success_rate')
      .eq('id', targetId)
      .single();

    if (target) {
      // Calcola nuovo success rate (media mobile semplice)
      const currentRate = target.success_rate || 100;
      const newRate = success ? 
        Math.min(100, currentRate + 1) : 
        Math.max(0, currentRate - 5);

      await supabase
        .from('scraping_targets')
        .update({
          last_scraped: new Date().toISOString(),
          success_rate: newRate
        })
        .eq('id', targetId);
    }
  }
}

export const advancedScraper = new AdvancedScraper();
