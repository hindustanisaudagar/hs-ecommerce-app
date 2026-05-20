import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateAppSettings, getAppSettings } from '@/lib/backend/settings'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Direct query to see what's in the database
    const { data: settingsData, error: settingsError } = await supabase
      .from('app_settings')
      .select('key, value')
    
    console.log(' GET /api/admin/settings - Raw DB data:', JSON.stringify(settingsData, null, 2))
    
    const settings = await getAppSettings()
    console.log(' GET /api/admin/settings - Parsed settings:', JSON.stringify(settings, null, 2))
    
    return NextResponse.json(settings)
  } catch (error: any) {
    console.error(' GET /api/admin/settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const body = await request.json()
    console.log('Saving settings:', JSON.stringify(body, null, 2))
    
    await updateAppSettings(body)
    
    console.log('Settings saved successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Settings save error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to save settings',
      details: error.toString()
    }, { status: 500 })
  }
}
