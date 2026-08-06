import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AlertConfig } from '@/types/alerts';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema di validazione per la creazione/aggiornamento alert
const AlertConfigSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  filters: z.object({
    categories: z.array(z.string()).default([]),
    locations: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    exclude_keywords: z.array(z.string()).default([]),
    date_range: z.object({
      start: z.string().optional(),
      end: z.string().optional()
    }).optional(),
    min_attendees: z.number().optional()
  }),
  notification_channels: z.object({
    email: z.object({
      enabled: z.boolean(),
      addresses: z.array(z.string().email()),
      template: z.enum(['summary', 'detailed', 'minimal'])
    }).optional(),
    telegram: z.object({
      enabled: z.boolean(),
      chat_id: z.string(),
      bot_token: z.string()
    }).optional(),
    webhook: z.object({
      enabled: z.boolean(),
      url: z.string().url(),
      headers: z.record(z.string()).optional()
    }).optional()
  }),
  frequency: z.object({
    type: z.enum(['immediate', 'daily', 'weekly', 'custom']),
    time: z.string().optional(),
    days: z.array(z.number().min(0).max(6)).optional(),
    custom_cron: z.string().optional()
  })
});

// GET /api/alerts - Ottieni tutti gli alert dell'utente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data: alerts, error } = await supabase
      .from('alert_configs')
      .select(`
        *,
        alert_logs (
          id,
          channel,
          status,
          sent_at,
          error_message
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('GET /api/alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/alerts - Crea nuovo alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, ...alertData } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Validazione dati
    const validatedData = AlertConfigSchema.parse(alertData);

    const { data: alert, error } = await supabase
      .from('alert_configs')
      .insert({
        user_id,
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        total_alerts_sent: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }

    console.error('POST /api/alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/alerts - Aggiorna alert esistente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user_id, ...alertData } = body;

    if (!id || !user_id) {
      return NextResponse.json({ error: 'Alert ID and User ID required' }, { status: 400 });
    }

    // Validazione dati
    const validatedData = AlertConfigSchema.parse(alertData);

    const { data: alert, error } = await supabase
      .from('alert_configs')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating alert:', error);
      return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
    }

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ alert });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }

    console.error('PUT /api/alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/alerts - Elimina alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Alert ID and User ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('alert_configs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting alert:', error);
      return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
