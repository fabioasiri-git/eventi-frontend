import { createClient } from '@supabase/supabase-js';
// import { Resend } from 'resend';
// import { Telegraf } from 'telegraf';
import { AlertConfig, EventMatch, AlertLog } from '@/types/alerts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// const resend = new Resend(process.env.RESEND_API_KEY);

export class AlertManager {
  private telegramBots: Map<string, any> = new Map();

  async processNewEvents(events: any[]) {
    console.log(`Processing ${events.length} new events for alerts`);
    
    // Ottieni tutte le configurazioni alert attive
    const { data: alertConfigs, error } = await supabase
      .from('alert_configs')
      .select('*')
      .eq('enabled', true);

    if (error) {
      console.error('Error fetching alert configs:', error);
      return;
    }

    for (const config of alertConfigs || []) {
      const matchingEvents = this.filterEventsForAlert(events, config);
      
      if (matchingEvents.length > 0) {
        await this.triggerAlert(config, matchingEvents);
      }
    }
  }

  private filterEventsForAlert(events: any[], config: AlertConfig): any[] {
    return events.filter(event => {
      // Filtro per categoria
      if (config.filters.categories.length > 0) {
        const eventCategory = this.categorizeEvent(event);
        if (!config.filters.categories.includes(eventCategory)) {
          return false;
        }
      }

      // Filtro per location
      if (config.filters.locations.length > 0) {
        const matchesLocation = config.filters.locations.some(location => 
          event.location?.toLowerCase().includes(location.toLowerCase()) ||
          event.title?.toLowerCase().includes(location.toLowerCase())
        );
        if (!matchesLocation) return false;
      }

      // Filtro per keywords
      if (config.filters.keywords.length > 0) {
        const eventText = `${event.title} ${event.description} ${event.location}`.toLowerCase();
        const hasKeyword = config.filters.keywords.some(keyword => 
          eventText.includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      // Filtro per parole da escludere
      if (config.filters.exclude_keywords.length > 0) {
        const eventText = `${event.title} ${event.description} ${event.location}`.toLowerCase();
        const hasExcludedKeyword = config.filters.exclude_keywords.some(keyword => 
          eventText.includes(keyword.toLowerCase())
        );
        if (hasExcludedKeyword) return false;
      }

      // Filtro per data
      if (config.filters.date_range) {
        const eventDate = new Date(event.date);
        if (config.filters.date_range.start && eventDate < new Date(config.filters.date_range.start)) {
          return false;
        }
        if (config.filters.date_range.end && eventDate > new Date(config.filters.date_range.end)) {
          return false;
        }
      }

      return true;
    });
  }

  private categorizeEvent(event: any): string {
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const text = `${title} ${description}`;

    if (text.includes('concerto') || text.includes('musica') || text.includes('band')) {
      return 'concerti';
    }
    if (text.includes('sagra') || text.includes('festa') || text.includes('palio')) {
      return 'sagre';
    }
    if (text.includes('festival') || text.includes('rassegna')) {
      return 'festival';
    }
    if (text.includes('mercatino') || text.includes('mercato') || text.includes('natale')) {
      return 'mercatini';
    }
    if (text.includes('apertura') || text.includes('inaugurazione') || text.includes('nuovo')) {
      return 'aperture';
    }
    
    return 'eventi';
  }

  private async triggerAlert(config: AlertConfig, events: any[]) {
    console.log(`Triggering alert ${config.name} for ${events.length} events`);

    const promises = [];

    // Email alert
    if (config.notification_channels.email?.enabled) {
      promises.push(this.sendEmailAlert(config, events));
    }

    // Telegram alert
    if (config.notification_channels.telegram?.enabled) {
      promises.push(this.sendTelegramAlert(config, events));
    }

    // Webhook alert
    if (config.notification_channels.webhook?.enabled) {
      promises.push(this.sendWebhookAlert(config, events));
    }

    await Promise.allSettled(promises);

    // Aggiorna statistiche
    await supabase
      .from('alert_configs')
      .update({
        last_triggered: new Date().toISOString(),
        total_alerts_sent: config.total_alerts_sent + 1
      })
      .eq('id', config.id);
  }

  private async sendEmailAlert(config: AlertConfig, events: any[]) {
    try {
      const emailConfig = config.notification_channels.email!;
      const subject = `🎯 ${config.name} - ${events.length} nuovi eventi trovati`;
      
      let htmlContent = this.generateEmailTemplate(config, events, emailConfig.template);

      for (const email of emailConfig.addresses) {
        // TODO: Implementare invio email con Resend
        console.log(`Sending email to ${email}: ${subject}`);
        // await resend.emails.send({
        //   from: 'Eventi Toscana <noreply@eventi-toscana.com>',
        //   to: email,
        //   subject,
        //   html: htmlContent
        // });
      }

      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'email', 'sent');
    } catch (error: any) {
      console.error('Email alert failed:', error);
      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'email', 'failed', error?.message || 'Unknown error');
    }
  }

  private async sendTelegramAlert(config: AlertConfig, events: any[]) {
    try {
      const telegramConfig = config.notification_channels.telegram!;
      const message = this.generateTelegramMessage(config, events);
      
      const url = `https://api.telegram.org/bot${telegramConfig.bot_token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramConfig.chat_id,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Telegram API failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'telegram', 'sent');
    } catch (error: any) {
      console.error('Telegram alert failed:', error);
      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'telegram', 'failed', error?.message || 'Unknown error');
    }
  }

  private async sendWebhookAlert(config: AlertConfig, events: any[]) {
    try {
      const webhookConfig = config.notification_channels.webhook!;
      
      const payload = {
        alert_name: config.name,
        alert_id: config.id,
        events_count: events.length,
        events: events,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...webhookConfig.headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'webhook', 'sent');
    } catch (error: any) {
      console.error('Webhook alert failed:', error);
      await this.logAlert(config.id, events.map(e => e.id || e.evento_id), 'webhook', 'failed', error?.message || 'Unknown error');
    }
  }

  private generateEmailTemplate(config: AlertConfig, events: any[], template: string): string {
    const baseStyle = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .event { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
        .event-title { font-weight: bold; color: #2563eb; font-size: 18px; }
        .event-meta { color: #666; font-size: 14px; margin: 5px 0; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; margin-top: 20px; }
      </style>
    `;

    let content = `
      ${baseStyle}
      <div class="header">
        <h1>🎯 ${config.name}</h1>
        <p>${events.length} nuovi eventi trovati</p>
      </div>
    `;

    events.forEach(event => {
      if (template === 'minimal') {
        content += `
          <div class="event">
            <div class="event-title">${event.title}</div>
            <div class="event-meta">📅 ${event.date} | 📍 ${event.location}</div>
          </div>
        `;
      } else {
        content += `
          <div class="event">
            <div class="event-title">${event.title}</div>
            <div class="event-meta">📅 ${event.date} | 📍 ${event.location}</div>
            ${event.description ? `<p>${event.description}</p>` : ''}
            ${event.contact_email ? `<p>📧 ${event.contact_email}</p>` : ''}
            ${event.contact_phone ? `<p>📞 ${event.contact_phone}</p>` : ''}
            ${event.source_url ? `<p><a href="${event.source_url}">Vedi dettagli</a></p>` : ''}
          </div>
        `;
      }
    });

    content += `
      <div class="footer">
        <p>Alert configurato: ${config.name}</p>
        <p>Gestisci i tuoi alert su <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Eventi Toscana Dashboard</a></p>
      </div>
    `;

    return content;
  }

  private generateTelegramMessage(config: AlertConfig, events: any[]): string {
    let message = `🎯 <b>${config.name}</b>\n${events.length} nuovi eventi trovati!\n\n`;

    events.slice(0, 5).forEach((event, index) => {
      message += `<b>${index + 1}. ${event.title}</b>\n`;
      message += `📅 ${event.date}\n`;
      message += `📍 ${event.location}\n`;
      if (event.source_url) {
        message += `🔗 <a href="${event.source_url}">Dettagli</a>\n`;
      }
      message += '\n';
    });

    if (events.length > 5) {
      message += `... e altri ${events.length - 5} eventi\n\n`;
    }

    message += `⚙️ Gestisci alert: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    return message;
  }

  private async logAlert(alertConfigId: string, eventIds: string[], channel: string, status: string, errorMessage?: string) {
    await supabase
      .from('alert_logs')
      .insert({
        alert_config_id: alertConfigId,
        event_ids: eventIds,
        channel,
        status,
        error_message: errorMessage,
        sent_at: new Date().toISOString()
      });
  }
}

export const alertManager = new AlertManager();
