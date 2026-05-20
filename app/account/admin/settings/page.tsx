'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Shield, TestTube2, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saved, setSaved] = useState(false)
  
  const [settings, setSettings] = useState({
    backend_provider: 'supabase',
    woocommerce_url: '',
    woocommerce_consumer_key: '',
    woocommerce_consumer_secret: '',
  })
  
  useEffect(() => {
    fetchSettings()
  }, [])
  
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }
  
  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    setSaved(false)
    
    try {
      const res = await fetch('/api/admin/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      const data = await res.json()
      setTestResult(data)
    } catch (error: any) {
      setTestResult({ success: false, message: error.message })
    } finally {
      setTesting(false)
    }
  }
  
  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    setTestResult(null)
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to save settings')
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-warm-beige/30">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-terracotta" />
          <h1 className="font-serif text-3xl text-ink">Backend Configuration</h1>
        </div>
        
        <div className="bg-cream rounded-2xl shadow-premium p-8 space-y-8">
          {/* Backend Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-ink mb-3">
              Backend Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'supabase', label: 'Supabase', desc: 'Current database' },
                { value: 'woocommerce', label: 'WooCommerce', desc: 'Headless mode' },
                { value: 'both', label: 'Both', desc: 'Sync mode' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSettings({ ...settings, backend_provider: option.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    settings.backend_provider === option.value
                      ? 'border-terracotta bg-terracotta/10'
                      : 'border-border/50 hover:border-terracotta/50'
                  }`}
                >
                  <div className="font-medium text-ink">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {settings.backend_provider === 'supabase' && 'Using Supabase database for all operations'}
              {settings.backend_provider === 'woocommerce' && 'Using WooCommerce REST API for all operations'}
              {settings.backend_provider === 'both' && 'Supabase primary, WooCommerce secondary (auto-sync)'}
            </p>
          </div>
          
          {/* WooCommerce Configuration */}
          {settings.backend_provider !== 'supabase' && (
            <div className="space-y-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-terracotta" />
                <h2 className="font-medium text-ink">WooCommerce Configuration</h2>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Store URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={settings.woocommerce_url}
                  onChange={(e) => setSettings({ ...settings, woocommerce_url: e.target.value })}
                  placeholder="https://your-store.com"
                  className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Consumer Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.woocommerce_consumer_key}
                    onChange={(e) => setSettings({ ...settings, woocommerce_consumer_key: e.target.value })}
                    placeholder="ck_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Consumer Secret <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={settings.woocommerce_consumer_secret}
                    onChange={(e) => setSettings({ ...settings, woocommerce_consumer_secret: e.target.value })}
                    placeholder="cs_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-mono text-sm"
                  />
                </div>
              </div>
              
              {/* Test Connection */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={testConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-6 py-3 border border-border/50 rounded-xl text-sm text-ink hover:bg-warm-beige transition-colors disabled:opacity-50"
                >
                  <TestTube2 className="w-4 h-4" />
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
                
                {testResult && (
                  <span className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult.message}
                  </span>
                )}
              </div>
              
              <div className="bg-warm-beige/30 rounded-xl p-4 text-sm text-muted-foreground">
                <p className="font-medium text-ink mb-2">How to get API keys:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to WooCommerce → Settings → Advanced → REST API</li>
                  <li>Click "Add Key"</li>
                  <li>Select user and permissions (Read/Write)</li>
                  <li>Copy Consumer Key and Secret</li>
                </ol>
              </div>
            </div>
          )}
          
          {/* Save Button */}
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 flex-1 bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
              
              {saved && (
                <span className="text-green-600 text-sm">Settings saved successfully!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
