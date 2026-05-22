import { NextResponse } from 'next/server';
import { createClient } from '@/lib/backend/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('wholesale_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('wholesale_settings')
    .upsert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
