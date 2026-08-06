export interface AlertConfig {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  enabled: boolean;
  
  // Filtri eventi
  filters: {
    categories: string[]; // eventi, concerti, sagre, festival, mercatini, aperture
    locations: string[]; // province/città toscane
    keywords: string[];
    exclude_keywords: string[];
    date_range?: {
      start?: string;
      end?: string;
    };
    min_attendees?: number;
  };
  
  // Canali di notifica
  notification_channels: {
    email?: {
      enabled: boolean;
      addresses: string[];
      template: 'summary' | 'detailed' | 'minimal';
    };
    telegram?: {
      enabled: boolean;
      chat_id: string;
      bot_token: string;
    };
    webhook?: {
      enabled: boolean;
      url: string;
      headers?: Record<string, string>;
    };
  };
  
  // Frequenza
  frequency: {
    type: 'immediate' | 'daily' | 'weekly' | 'custom';
    time?: string; // HH:MM formato
    days?: number[]; // 0-6 (domenica-sabato)
    custom_cron?: string;
  };
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_triggered?: string;
  total_alerts_sent: number;
}

export interface EventMatch {
  event_id: string;
  alert_config_id: string;
  matched_filters: string[];
  confidence_score: number;
  created_at: string;
}

export interface AlertLog {
  id: string;
  alert_config_id: string;
  event_ids: string[];
  channel: 'email' | 'telegram' | 'webhook';
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  sent_at: string;
  metadata?: Record<string, any>;
}

export interface ScrapingTarget {
  id: string;
  name: string;
  url: string;
  category: 'eventi' | 'concerti' | 'sagre' | 'festival' | 'mercatini' | 'aperture' | 'generic';
  selector_config: {
    title: string;
    date: string;
    location: string;
    description?: string;
    contact?: string;
    image?: string;
    link?: string;
  };
  enabled: boolean;
  last_scraped?: string;
  scraping_frequency: number; // ore
  success_rate: number;
  created_at: string;
}
