'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Save, Upload, Loader2, Layout, Image as ImageIcon, Type, Settings, Plus } from 'lucide-react'

const sections = [
  { id: 'hero', label: 'Hero', icon: Layout },
  { id: 'studio_banner', label: 'Studio Banner', icon: ImageIcon },
  { id: 'brand_story', label: 'Brand Story', icon: Type },
  { id: 'instagram', label: 'Instagram', icon: ImageIcon },
  { id: 'marketplaces', label: 'Marketplaces', icon: Settings },
  { id: 'categories', label: 'Categories', icon: Layout },
  { id: 'bestsellers', label: 'Bestsellers', icon: Layout },
  { id: 'reviews', label: 'Reviews', icon: Type },
  { id: 'newsletter', label: 'Newsletter', icon: Type },
  { id: 'footer', label: 'Footer', icon: Settings },
]

export default function AdminLandingPage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadField, setUploadField] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/landing-page')
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch landing page content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const sectionData = content[activeSection]
      const res = await fetch('/api/admin/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeSection, content: sectionData }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error: any) {
      alert(error.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file')
      return
    }
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File size should be less than ${isVideo ? '20MB' : '5MB'}`)
      return
    }
    setUploading(true)
    setUploadField(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'landing-page')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }
      const data = await res.json()
      setContent((prev: any) => {
        const section = prev[activeSection] || {}
        if (field === 'images') {
          const images = [...(section.images || [])]
          const index = parseInt(e.target.dataset.index || '0')
          images[index] = { src: data.url, alt: images[index]?.alt || 'Image', type: data.resource_type || 'image' }
          return { ...prev, [activeSection]: { ...section, images } }
        } else if (field === 'logos') {
          const items = [...(section.items || [])]
          const index = parseInt(e.target.dataset.index || '0')
          items[index] = { ...items[index], logo: data.url }
          return { ...prev, [activeSection]: { ...section, items } }
        } else if (field === 'slides') {
          const slides = [...(section.slides || [])]
          const index = parseInt(e.target.dataset.index || '0')
          slides[index] = { ...slides[index], image: data.url, type: data.resource_type || 'image' }
          return { ...prev, [activeSection]: { ...section, slides } }
        } else if (field === 'cat_images') {
          const items = [...(section.items || [])]
          const index = parseInt(e.target.dataset.index || '0')
          items[index] = { ...items[index], image: data.url }
          return { ...prev, [activeSection]: { ...section, items } }
        } else {
          return { ...prev, [activeSection]: { ...section, [field]: data.url, media_type: data.resource_type || 'image' } }
        }
      })
    } catch (error: any) {
      alert(error.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadField('')
      if (e.target) e.target.value = ''
    }
  }

  const updateField = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [activeSection]: { ...(prev[activeSection] || {}), [field]: value },
    }))
  }

  const updateNestedField = (parentField: string, index: number, field: string, value: any) => {
    setContent((prev: any) => {
      const section = prev[activeSection] || {}
      const items = [...(section[parentField] || [])]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, [activeSection]: { ...section, [parentField]: items } }
    })
  }

  const renderImageUpload = (field: string, label: string, recommended: string) => {
    const data = content[activeSection] || {}
    return (
      <div>
        <label className="block text-sm text-muted-foreground mb-2">{label}</label>
        <div className="flex items-start gap-4">
          {data[field] && (
            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-warm-beige">
              <Image src={data[field]} alt="" fill className="object-cover" />
            </div>
          )}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(field, e)} disabled={uploading && uploadField === field} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading && uploadField === field} className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-sm hover:bg-warm-beige transition-colors disabled:opacity-50">
              {uploading && uploadField === field ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading && uploadField === field ? 'Uploading...' : 'Upload Image'}
            </button>
            <p className="text-xs text-muted-foreground mt-1">{recommended}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderTextField = (field: string, label: string, type = 'text', rows?: number) => {
    const data = content[activeSection] || {}
    const Component = rows ? 'textarea' : 'input'
    return (
      <div>
        <label className="block text-sm text-muted-foreground mb-2">{label}</label>
        <Component
          type={type}
          rows={rows}
          value={data[field] || ''}
          onChange={(e: any) => updateField(field, e.target.value)}
          className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
        />
      </div>
    )
  }

  const renderGridFields = (fields: { field: string; label: string; type?: string }[]) => {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.field}>
            <label className="block text-sm text-muted-foreground mb-2">{f.label}</label>
            <input
              type={f.type || 'text'}
              value={(content[activeSection] || {})[f.field] || ''}
              onChange={(e) => updateField(f.field, e.target.value)}
              className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
          </div>
        ))}
      </div>
    )
  }

  const renderHeroSection = () => {
    const data = content.hero || {}
    const slides = data.slides || [data]
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Hero Section (Slider)</h3>
        <p className="text-sm text-muted-foreground">Add multiple slides for the hero carousel. Each slide has its own image/video and text.</p>
        
        {slides.map((slide: any, index: number) => (
          <div key={index} className="p-6 bg-warm-beige/30 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-ink">Slide {index + 1}</h4>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newSlides = slides.filter((_: any, i: number) => i !== index)
                    updateField('slides', newSlides)
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Image/Video</label>
              <div className="flex items-start gap-4">
                {slide.image && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-warm-beige">
                    {slide.type === 'video' ? (
                      <video src={slide.image} className="w-full h-full object-cover" muted loop />
                    ) : (
                      <Image src={slide.image} alt="" fill className="object-cover" />
                    )}
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*,video/*" onChange={(e) => handleImageUpload('slides', e)} disabled={uploading && uploadField === 'slides'} className="hidden" id={`slide-${index}`} data-index={index} />
                  <button type="button" onClick={() => document.getElementById(`slide-${index}`)?.click()} disabled={uploading && uploadField === 'slides'} className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-sm hover:bg-warm-beige transition-colors disabled:opacity-50">
                    {uploading && uploadField === 'slides' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading && uploadField === 'slides' ? 'Uploading...' : 'Upload Image/Video'}
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1920x1080px, Max 5MB (images) or 20MB (videos)</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Title Hindi (Part 1)</label>
                <input type="text" value={slide.title_hindi || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], title_hindi: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Title Hindi (Highlight)</label>
                <input type="text" value={slide.title_hindi_highlight || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], title_hindi_highlight: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Title Hindi (Suffix)</label>
                <input type="text" value={slide.title_hindi_suffix || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], title_hindi_suffix: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Subtitle (English)</label>
              <input type="text" value={slide.subtitle || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], subtitle: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Description</label>
              <textarea rows={2} value={slide.description || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], description: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">CTA Button Text</label>
                <input type="text" value={slide.cta_text || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], cta_text: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">CTA Button Link</label>
                <input type="text" value={slide.cta_link || ''} onChange={(e) => { const newSlides = [...slides]; newSlides[index] = { ...newSlides[index], cta_link: e.target.value }; updateField('slides', newSlides) }} className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const newSlides = [...slides, {}]
            updateField('slides', newSlides)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-lg text-sm hover:bg-ink/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Stats (3 items)</label>
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Value" value={data.stats?.[index]?.value || ''} onChange={(e) => { const stats = [...(data.stats || [{}, {}, {}])]; stats[index] = { ...stats[index], value: e.target.value }; updateField('stats', stats) }} className="px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
                <input type="text" placeholder="Label" value={data.stats?.[index]?.label || ''} onChange={(e) => { const stats = [...(data.stats || [{}, {}, {}])]; stats[index] = { ...stats[index], label: e.target.value }; updateField('stats', stats) }} className="px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderStudioBannerSection = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Studio Banner Section</h3>
        {renderImageUpload('image', 'Banner Image', 'Recommended: 1920x800px, Max 2MB')}
        {renderTextField('label', 'Label')}
        {renderTextField('title', 'Title')}
        {renderTextField('description', 'Description', 'text', 2)}
        {renderGridFields([{ field: 'cta_text', label: 'CTA Text' }, { field: 'cta_link', label: 'CTA Link' }])}
      </div>
    )
  }

  const renderBrandStorySection = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Brand Story Section</h3>
        {renderImageUpload('image', 'Story Image', 'Recommended: 800x1000px, Max 2MB')}
        {renderTextField('label', 'Label')}
        {renderTextField('title', 'Title')}
        {renderTextField('description_1', 'Description 1', 'text', 3)}
        {renderTextField('description_2', 'Description 2', 'text', 3)}
        {renderGridFields([{ field: 'hindi_quote', label: 'Hindi Quote' }, { field: 'hindi_quote_translation', label: 'English Translation' }])}
        {renderGridFields([{ field: 'stat_value', label: 'Stat Value' }, { field: 'stat_label', label: 'Stat Label' }])}
        {renderGridFields([{ field: 'cta_text', label: 'CTA Text' }, { field: 'cta_link', label: 'CTA Link' }])}
      </div>
    )
  }

  const renderInstagramSection = () => {
    const data = content.instagram || {}
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Instagram Gallery</h3>
        {renderGridFields([{ field: 'label', label: 'Label' }, { field: 'title', label: 'Title' }])}
        {renderTextField('follow_link', 'Instagram URL', 'url')}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Gallery Images (6 images)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-warm-beige border border-border/50">
                  {data.images?.[index]?.src ? <Image src={data.images[index].src} alt="" fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No image</div>}
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload('images', e)} disabled={uploading && uploadField === 'images'} className="hidden" id={`ig-${index}`} data-index={index} />
                <button type="button" onClick={() => document.getElementById(`ig-${index}`)?.click()} disabled={uploading && uploadField === 'images'} className="w-full px-3 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-xs hover:bg-warm-beige transition-colors disabled:opacity-50">{uploading && uploadField === 'images' ? 'Uploading...' : 'Upload'}</button>
                <input type="text" placeholder="Alt text" value={data.images?.[index]?.alt || ''} onChange={(e) => updateNestedField('images', index, 'alt', e.target.value)} className="w-full px-3 py-1.5 bg-warm-beige/50 border border-border/50 rounded text-xs text-ink focus:outline-none focus:ring-1 focus:ring-terracotta/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderMarketplacesSection = () => {
    const data = content.marketplaces || {}
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Marketplaces</h3>
        {renderGridFields([{ field: 'label', label: 'Label' }, { field: 'title', label: 'Title' }])}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Marketplace Logos & Links</label>
          <div className="space-y-4">
            {(data.items || []).map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-warm-beige/30 rounded-lg">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                  {item.logo ? <Image src={item.logo} alt="" fill className="object-contain p-2" /> : <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No logo</div>}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="text" placeholder="Name" value={item.name || ''} onChange={(e) => updateNestedField('items', index, 'name', e.target.value)} className="w-full px-3 py-2 bg-white/50 border border-border/50 rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
                  <input type="url" placeholder="URL" value={item.url || ''} onChange={(e) => updateNestedField('items', index, 'url', e.target.value)} className="w-full px-3 py-2 bg-white/50 border border-border/50 rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logos', e)} disabled={uploading && uploadField === 'logos'} className="hidden" id={`mp-${index}`} data-index={index} />
                  <button type="button" onClick={() => document.getElementById(`mp-${index}`)?.click()} disabled={uploading && uploadField === 'logos'} className="px-3 py-1.5 bg-white/50 border border-border/50 rounded-lg text-xs hover:bg-white transition-colors disabled:opacity-50">{uploading && uploadField === 'logos' ? 'Uploading...' : 'Upload Logo'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderFooterSection = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Footer</h3>
        {renderGridFields([{ field: 'brand_name', label: 'Brand Name' }, { field: 'brand_initials', label: 'Brand Initials' }])}
        {renderTextField('description', 'Description', 'text', 2)}
        {renderTextField('hindi_tagline', 'Hindi Tagline')}
        {renderGridFields([{ field: 'email', label: 'Email', type: 'email' }, { field: 'phone', label: 'Phone' }])}
        {renderTextField('address', 'Address', 'text', 2)}
        {renderGridFields([{ field: 'instagram_url', label: 'Instagram URL', type: 'url' }, { field: 'facebook_url', label: 'Facebook URL', type: 'url' }, { field: 'twitter_url', label: 'Twitter URL', type: 'url' }])}
        {renderTextField('copyright', 'Copyright Text')}
      </div>
    )
  }

  const renderCategoriesSection = () => {
    const data = content.categories || {}
    const items = data.items || []
    return (
      <div className="space-y-6">
        <h3 className="font-medium text-ink text-lg">Categories Section (Independent)</h3>
        <p className="text-sm text-muted-foreground">Add custom categories for the homepage. These are independent from the main categories database.</p>
        
        {renderGridFields([{ field: 'label', label: 'Section Label' }, { field: 'title', label: 'Section Title' }])}
        {renderTextField('view_all_link', 'View All Link', 'url')}
        {renderTextField('view_all_text', 'View All Text')}

        <div className="space-y-4 pt-4 border-t border-border/50">
          <h4 className="font-medium text-ink">Category Items</h4>
          {items.map((item: any, index: number) => (
            <div key={index} className="p-4 bg-warm-beige/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = items.filter((_: any, i: number) => i !== index)
                    updateField('items', newItems)
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Name</label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => updateNestedField('items', index, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Link URL</label>
                  <input
                    type="text"
                    value={item.link || ''}
                    onChange={(e) => updateNestedField('items', index, 'link', e.target.value)}
                    className="w-full px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Image</label>
                <div className="flex items-start gap-4">
                  {item.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-warm-beige">
                      <Image src={item.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cat_images', e)} disabled={uploading && uploadField === 'cat_images'} className="hidden" id={`cat-img-${index}`} data-index={index} />
                    <button type="button" onClick={() => document.getElementById(`cat-img-${index}`)?.click()} disabled={uploading && uploadField === 'cat_images'} className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-lg text-sm hover:bg-warm-beige transition-colors disabled:opacity-50">
                      {uploading && uploadField === 'cat_images' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading && uploadField === 'cat_images' ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newItems = [...items, { name: '', link: '', image: '' }]
              updateField('items', newItems)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category Item
          </button>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'hero': return renderHeroSection()
      case 'studio_banner': return renderStudioBannerSection()
      case 'brand_story': return renderBrandStorySection()
      case 'instagram': return renderInstagramSection()
      case 'marketplaces': return renderMarketplacesSection()
      case 'footer': return renderFooterSection()
      case 'categories': return renderCategoriesSection()
      case 'bestsellers': return renderSimpleTextSection('bestsellers', 'Bestsellers Section')
      case 'reviews': return renderSimpleTextSection('reviews', 'Reviews Section')
      case 'newsletter': return renderSimpleTextSection('newsletter', 'Newsletter Section')
      default: return null
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-terracotta" /></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-2xl text-ink">Landing Page Content</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all sections of your homepage</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && <span className="text-green-600 text-sm">Saved successfully!</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-border/50">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id ? 'bg-ink text-cream' : 'text-muted-foreground hover:bg-warm-beige/50'}`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-cream rounded-2xl p-8 shadow-premium">
        {renderSection()}
      </div>
    </div>
  )
}
