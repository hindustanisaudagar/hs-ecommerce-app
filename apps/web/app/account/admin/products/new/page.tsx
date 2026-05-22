'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Palette, Shield, BookOpen, Tag, Globe, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { RichTextEditor } from '@/components/rich-text-editor'
import Select from 'react-select'
import { HexColorPicker } from 'react-colorful'
import { ProductVariation, ProductFeature } from '@/types'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

interface FlatCategory {
  id: string
  name: string
  label: string
}

interface VariationFormData {
  color_name: string
  color_hex: string
  sku: string
  price: string
  stock: string
  image_url: string
}

export default function AdminNewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploading, setUploading] = useState(false)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    categories: true,
    pricing: true,
    inventory: true,
    specifications: false,
    safety: false,
    features: false,
    richContent: false,
    images: true,
    seo: false,
    variations: false,
    status: true,
  })

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    brand: '',
    short_description: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    tags: '',
    material: '',
    contents: '',
    capacity: '',
    dimensions: '',
    weight: '',
    color: '',
    package_includes: '',
    safety_features: [] as string[],
    product_story: '',
    tradition_section: '',
    made_in_india_section: '',
    handmade_disclaimer: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    is_comparable: true,
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [sectionImages, setSectionImages] = useState<string[]>([])
  const [bannerImage, setBannerImage] = useState('')
  const [productStoryBanner, setProductStoryBanner] = useState('')
  const [traditionBanner, setTraditionBanner] = useState('')
  const [madeInIndiaBanner, setMadeInIndiaBanner] = useState('')
  const [localHandsBanner, setLocalHandsBanner] = useState('')
  const [features, setFeatures] = useState<ProductFeature[]>([])
  const [variations, setVariations] = useState<VariationFormData[]>([])
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : (data.categories || []))
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const flatCategories: FlatCategory[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    label: cat.parent_id ? `  ↳ ${cat.name}` : cat.name,
  }))

  const categoryOptions = flatCategories.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }))

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setFormData({ ...formData, name: value, slug })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      })
    }
  }

  const handleSafetyFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      safety_features: prev.safety_features.includes(feature)
        ? prev.safety_features.filter((f) => f !== feature)
        : [...prev.safety_features, feature],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'section' | 'banner' | 'feature' | 'variation' = 'product', index?: number) => {
    if (!e.target.files?.length) return

    setUploading(true)

    try {
      const file = e.target.files[0]
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'products')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()

      if (data.url) {
        if (type === 'product') {
          setImages([...images, data.url])
        } else if (type === 'section') {
          setSectionImages([...sectionImages, data.url])
        } else if (type === 'banner') {
          setBannerImage(data.url)
        } else if (type === 'feature' && index !== undefined) {
          const newFeatures = [...features]
          newFeatures[index].icon_url = data.url
          setFeatures(newFeatures)
        } else if (type === 'variation' && index !== undefined) {
          const newVariations = [...variations]
          newVariations[index].image_url = data.url
          setVariations(newVariations)
        }
      }
    } catch (error: any) {
      console.error('Failed to upload image:', error)
      alert(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number, type: 'product' | 'section' = 'product') => {
    if (type === 'product') {
      setImages(images.filter((_, i) => i !== index))
    } else {
      setSectionImages(sectionImages.filter((_, i) => i !== index))
    }
  }

  const addFeature = () => {
    setFeatures([...features, { title: '', icon_url: '', description: '' }])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, field: keyof ProductFeature, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFeatures(newFeatures)
  }

  const addVariation = () => {
    setVariations([
      ...variations,
      { color_name: '', color_hex: '#000000', sku: '', price: '', stock: '', image_url: '' },
    ])
  }

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index))
  }

  const updateVariation = (index: number, field: keyof VariationFormData, value: string) => {
    const newVariations = [...variations]
    newVariations[index] = { ...newVariations[index], [field]: value }
    setVariations(newVariations)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sanitize function to remove undefined/null/empty values
      const sanitize = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined
        if (typeof obj === 'string') {
          const trimmed = obj.trim()
          if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return undefined
          return trimmed
        }
        if (Array.isArray(obj)) {
          const cleaned = obj.map(item => sanitize(item)).filter(item => item !== undefined)
          return cleaned.length > 0 ? cleaned : undefined
        }
        if (typeof obj === 'object') {
          const cleaned: any = {}
          for (const [key, value] of Object.entries(obj)) {
            const cleanValue = sanitize(value)
            if (cleanValue !== undefined) {
              cleaned[key] = cleanValue
            }
          }
          return Object.keys(cleaned).length > 0 ? cleaned : undefined
        }
        return obj
      }

      const specifications = {
        material: formData.material,
        contents: formData.contents,
        capacity: formData.capacity,
        dimensions: formData.dimensions,
        weight: formData.weight,
        color: formData.color,
        package_includes: formData.package_includes,
      }

      const { material, contents, capacity, dimensions, weight, color, package_includes, ...restFormData } = formData

      // Filter category IDs to only valid UUIDs
      const validCategoryIds = selectedCategories
        .filter(c => {
          if (!c || typeof c !== 'string') return false
          const trimmed = c.trim()
          return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)
        })
        .map(c => c.trim())

      const cleanData = {
        ...restFormData,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        stock: parseInt(formData.stock) || 0,
        images: images.length > 0 ? images : undefined,
        section_images: sectionImages.length > 0 ? sectionImages : undefined,
        banner_image: bannerImage || undefined,
        product_story_banner: productStoryBanner || undefined,
        tradition_banner: traditionBanner || undefined,
        made_in_india_banner: madeInIndiaBanner || undefined,
        local_hands_banner: localHandsBanner || undefined,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        specifications,
        features: features
          .filter(f => f.title)
          .map(f => ({
            title: f.title,
            icon_url: f.icon_url || undefined,
            description: f.description || undefined,
          })),
        has_variations: variations.length > 0,
        variations: variations.length > 0 ? variations
          .filter(v => v.color_name || v.sku || v.price)
          .map((v) => ({
            color_name: v.color_name || undefined,
            color_hex: v.color_hex || '#000000',
            sku: v.sku || undefined,
            price: v.price ? parseFloat(v.price) : undefined,
            stock: parseInt(v.stock) || 0,
            image_url: v.image_url || undefined,
          })) : undefined,
      }

      // Only include category_ids if there are valid ones
      if (validCategoryIds.length > 0) {
        cleanData.category_ids = validCategoryIds
      }

      // Sanitize the entire payload
      const finalData = sanitize(cleanData)

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create product')
      }

      router.push('/account/admin/products')
    } catch (error: any) {
      alert(error.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const safetyFeaturesList = [
    'Microwave Safe',
    'Dishwasher Safe',
    'Freezer Safe',
    'Hand Wash Only',
    'Oven Safe',
    'Food Grade',
  ]

  const SectionHeader = ({
    icon: Icon,
    title,
    section,
    badge,
  }: {
    icon: any
    title: string
    section: string
    badge?: string
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-6 hover:bg-warm-beige/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-terracotta" />
        <h2 className="font-serif text-lg text-ink">{title}</h2>
        {badge && (
          <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  )

  const SectionContent = ({ section, children }: { section: string; children: React.ReactNode }) => {
    if (!expandedSections[section]) return null
    return <div className="p-6 pt-0 space-y-6">{children}</div>
  }

  const InputField = ({
    label,
    name,
    type = 'text',
    placeholder,
    required = false,
    step,
    min,
  }: {
    label: string
    name: string
    type?: string
    placeholder?: string
    required?: boolean
    step?: string
    min?: string
  }) => (
    <div>
      <label className="block text-sm text-muted-foreground mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        step={step}
        min={min}
        value={(formData as any)[name] || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
      />
    </div>
  )

  return (
    <div className="pb-24">
      <Link
        href="/account/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="font-serif text-2xl text-ink mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={BookOpen} title="Basic Information" section="basic" />
          <SectionContent section="basic">
            <InputField label="Product Name" name="name" required placeholder="e.g., Blue Umrao Coffee Mug Set" />
            <InputField label="Slug (auto-generated)" name="slug" placeholder="blue-umrao-coffee-mug-set" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="SKU" name="sku" required placeholder="HS62" />
              <InputField label="Brand" name="brand" placeholder="Hindustani Saudagar" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">Shown in "About the items" section on product page</p>
              <RichTextEditor
                content={formData.short_description}
                onChange={(content) => setFormData({ ...formData, short_description: content })}
                placeholder="Add bullet points about material, contents, capacity, etc."
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Full Description
              </label>
              <RichTextEditor
                content={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Detailed product description..."
              />
            </div>
          </SectionContent>
        </div>

        {/* Categories */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Tag} title="Categories" section="categories" badge={`Selected: ${selectedCategories.length}/5`} />
          <SectionContent section="categories">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Select Categories <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">Maximum 5 categories per product</p>
              <Select
                isMulti
                options={categoryOptions}
                value={categoryOptions.filter((opt) => selectedCategories.includes(opt.value))}
                onChange={(selected) => {
                  if (selected.length <= 5) {
                    setSelectedCategories(selected.map((s) => s.value))
                  } else {
                    alert('Maximum 5 categories allowed')
                  }
                }}
                placeholder="Search and select categories..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(245, 240, 235, 0.5)',
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    padding: '4px',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#FFF8F0',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }),
                }}
              />
            </div>
          </SectionContent>
        </div>

        {/* Pricing */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon="₹" title="Pricing" section="pricing" />
          <SectionContent section="pricing">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Selling Price (₹)" name="price" type="number" required step="0.01" min="0" placeholder="339" />
              <InputField label="Original Price / MRP (₹)" name="original_price" type="number" step="0.01" min="0" placeholder="800" />
            </div>
            {formData.price && formData.original_price && parseFloat(formData.original_price) > parseFloat(formData.price) && (
              <div className="bg-terracotta/10 text-terracotta px-4 py-2 rounded-xl text-sm">
                Discount: {Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100)}% OFF
              </div>
            )}
          </SectionContent>
        </div>

        {/* Inventory */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Eye} title="Inventory" section="inventory" />
          <SectionContent section="inventory">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Stock Quantity" name="stock" type="number" required min="0" placeholder="10" />
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  name="is_comparable"
                  checked={formData.is_comparable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border/50"
                />
                <label className="text-sm text-ink">Allow in Compare</label>
              </div>
            </div>
          </SectionContent>
        </div>

        {/* Specifications */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Shield} title="Product Specifications" section="specifications" />
          <SectionContent section="specifications">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Material" name="material" placeholder="Ceramic" />
              <InputField label="Contents" name="contents" placeholder="2 coffee mugs" />
              <InputField label="Capacity" name="capacity" placeholder="275ml" />
              <InputField label="Dimensions (L x W x H)" name="dimensions" placeholder="10cm x 8cm x 12cm" />
              <InputField label="Weight" name="weight" placeholder="500g" />
              <InputField label="Color" name="color" placeholder="Blue & White" />
            </div>
            <InputField label="Package Includes" name="package_includes" placeholder="2 mugs, gift box" />
          </SectionContent>
        </div>

        {/* Safety Features */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Shield} title="Safety Features" section="safety" />
          <SectionContent section="safety">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {safetyFeaturesList.map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    formData.safety_features.includes(feature)
                      ? 'bg-terracotta/10 border-terracotta/50'
                      : 'bg-warm-beige/30 border-border/50 hover:border-terracotta/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.safety_features.includes(feature)}
                    onChange={() => handleSafetyFeatureToggle(feature)}
                    className="w-4 h-4 rounded border-border/50"
                  />
                  <span className="text-sm text-ink">{feature}</span>
                </label>
              ))}
            </div>
          </SectionContent>
        </div>

        {/* Product Features */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Palette} title="Product Features" section="features" badge={features.length.toString()} />
          <SectionContent section="features">
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-2 text-terracotta hover:text-terracotta/80 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
            {features.map((feature, index) => (
              <div key={index} className="bg-warm-beige/30 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink">Feature {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <InputField label="Feature Title" name={`feature_title_${index}`} placeholder="Microwave Safe" value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} />
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Feature Icon</label>
                  <div className="flex items-center gap-4">
                    {feature.icon_url && (
                      <img src={feature.icon_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      {feature.icon_url ? 'Change Icon' : 'Upload Icon'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'feature', index)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Description</label>
                  <RichTextEditor
                    content={feature.description}
                    onChange={(content) => updateFeature(index, 'description', content)}
                    placeholder="Feature description..."
                  />
                </div>
              </div>
            ))}
          </SectionContent>
        </div>

        {/* Rich Content Sections */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={BookOpen} title="Rich Content Sections" section="richContent" />
          <SectionContent section="richContent">
            {/* Product Description Section */}
            <div className="space-y-4 pb-6 border-b border-border/50">
              <h3 className="font-medium text-ink">Product Description</h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
                <div className="flex items-center gap-4">
                  {bannerImage && (
                    <img src={bannerImage} alt="Product Description Banner" className="w-40 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    {bannerImage ? 'Change Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          uploadFormData.append('folder', 'products')
                          setUploading(true)
                          fetch('/api/upload', { method: 'POST', body: uploadFormData })
                            .then(res => res.json())
                            .then(data => {
                              if (data.url) setBannerImage(data.url)
                            })
                            .catch(err => console.error('Upload failed:', err))
                            .finally(() => setUploading(false))
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {bannerImage && (
                    <button type="button" onClick={() => setBannerImage('')} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Description Content</label>
                <RichTextEditor
                  content={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Detailed product description..."
                />
              </div>
            </div>

            {/* Product Story Section */}
            <div className="space-y-4 pt-6 pb-6 border-b border-border/50">
              <h3 className="font-medium text-ink">Product Story <span className="text-xs text-muted-foreground font-normal">("Tradition in Form, Art in Soul")</span></h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
                <div className="flex items-center gap-4">
                  {productStoryBanner && (
                    <img src={productStoryBanner} alt="Product Story Banner" className="w-40 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    {productStoryBanner ? 'Change Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          uploadFormData.append('folder', 'products')
                          setUploading(true)
                          fetch('/api/upload', { method: 'POST', body: uploadFormData })
                            .then(res => res.json())
                            .then(data => {
                              if (data.url) setProductStoryBanner(data.url)
                            })
                            .catch(err => console.error('Upload failed:', err))
                            .finally(() => setUploading(false))
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {productStoryBanner && (
                    <button type="button" onClick={() => setProductStoryBanner('')} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Story Content</label>
                <RichTextEditor
                  content={formData.product_story}
                  onChange={(content) => setFormData({ ...formData, product_story: content })}
                  placeholder="Tell the story behind this product..."
                />
              </div>
            </div>

            {/* Tradition Section */}
            <div className="space-y-4 pt-6 pb-6 border-b border-border/50">
              <h3 className="font-medium text-ink">Tradition & Craftsmanship</h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
                <div className="flex items-center gap-4">
                  {traditionBanner && (
                    <img src={traditionBanner} alt="Tradition Banner" className="w-40 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    {traditionBanner ? 'Change Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          uploadFormData.append('folder', 'products')
                          setUploading(true)
                          fetch('/api/upload', { method: 'POST', body: uploadFormData })
                            .then(res => res.json())
                            .then(data => {
                              if (data.url) setTraditionBanner(data.url)
                            })
                            .catch(err => console.error('Upload failed:', err))
                            .finally(() => setUploading(false))
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {traditionBanner && (
                    <button type="button" onClick={() => setTraditionBanner('')} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tradition Content</label>
                <RichTextEditor
                  content={formData.tradition_section}
                  onChange={(content) => setFormData({ ...formData, tradition_section: content })}
                  placeholder="About the tradition and craftsmanship..."
                />
              </div>
            </div>

            {/* Made in India Section */}
            <div className="space-y-4 pt-6">
              <h3 className="font-medium text-ink">Made in India</h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
                <div className="flex items-center gap-4">
                  {madeInIndiaBanner && (
                    <img src={madeInIndiaBanner} alt="Made in India Banner" className="w-40 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    {madeInIndiaBanner ? 'Change Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          uploadFormData.append('folder', 'products')
                          setUploading(true)
                          fetch('/api/upload', { method: 'POST', body: uploadFormData })
                            .then(res => res.json())
                            .then(data => {
                              if (data.url) setMadeInIndiaBanner(data.url)
                            })
                            .catch(err => console.error('Upload failed:', err))
                            .finally(() => setUploading(false))
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {madeInIndiaBanner && (
                    <button type="button" onClick={() => setMadeInIndiaBanner('')} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Made in India Content</label>
                <RichTextEditor
                  content={formData.made_in_india_section}
                  onChange={(content) => setFormData({ ...formData, made_in_india_section: content })}
                  placeholder="About Indian craftsmanship..."
                />
              </div>
            </div>

            {/* Local Hands Global Elegance Banner */}
            <div className="space-y-4 pt-6 border-t border-border/50">
              <h3 className="font-medium text-ink">Local Hands, Global Elegance Banner</h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
                <div className="flex items-center gap-4">
                  {localHandsBanner && (
                    <img src={localHandsBanner} alt="Local Hands Banner" className="w-40 h-20 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                    <ImageIcon className="w-4 h-4" />
                    {localHandsBanner ? 'Change Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          uploadFormData.append('folder', 'products')
                          setUploading(true)
                          fetch('/api/upload', { method: 'POST', body: uploadFormData })
                            .then(res => res.json())
                            .then(data => {
                              if (data.url) setLocalHandsBanner(data.url)
                            })
                            .catch(err => console.error('Upload failed:', err))
                            .finally(() => setUploading(false))
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {localHandsBanner && (
                    <button type="button" onClick={() => setLocalHandsBanner('')} className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
              </div>
            </div>

            {/* Handmade Disclaimer */}
            <div className="pt-6 border-t border-border/50">
              <label className="block text-sm text-muted-foreground mb-2">Handmade Disclaimer</label>
              <textarea
                name="handmade_disclaimer"
                rows={3}
                value={formData.handmade_disclaimer}
                onChange={handleChange}
                placeholder="As this is a handmade product there might be slightly colour and design variation..."
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
          </SectionContent>
        </div>

        {/* Images */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={ImageIcon} title="Images" section="images" badge={`${images.length} uploaded`} />
          <SectionContent section="images">
            {/* Product Gallery */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Product Gallery Images <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">Upload 12 images for complete product listing. First image will be main display.</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-ink/70 text-cream text-[10px] px-1.5 py-0.5 rounded">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(index, 'product')}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-terracotta transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'product')}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-terracotta border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  )}
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                {images.length}/12 images uploaded
              </p>
            </div>

            {/* Section Images */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Section Images</label>
              <p className="text-xs text-muted-foreground mb-3">Images for description sections</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {sectionImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index, 'section')}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-terracotta transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'section')}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </label>
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Banner Image</label>
              <p className="text-xs text-muted-foreground mb-3">"Local Hands, Global Elegance" banner</p>
              <div className="flex items-center gap-4">
                {bannerImage && (
                  <img src={bannerImage} alt="Banner" className="w-40 h-20 rounded-lg object-cover" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                  <ImageIcon className="w-4 h-4" />
                  {bannerImage ? 'Change Banner' : 'Upload Banner'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </SectionContent>
        </div>

        {/* SEO */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Globe} title="SEO" section="seo" />
          <SectionContent section="seo">
            <InputField label="Meta Title" name="meta_title" placeholder="Product name for search engines" />
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Meta Description</label>
              <textarea
                name="meta_description"
                rows={3}
                value={formData.meta_description}
                onChange={handleChange}
                placeholder="Brief description for search engines (160 characters max)"
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
          </SectionContent>
        </div>

        {/* Variations */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={Palette} title="Color Variations" section="variations" badge={variations.length.toString()} />
          <SectionContent section="variations">
            <p className="text-sm text-muted-foreground mb-4">
              Add color variations for this product. Each variation can have its own price, stock, and image.
            </p>
            <button
              type="button"
              onClick={addVariation}
              className="flex items-center gap-2 text-terracotta hover:text-terracotta/80 text-sm mb-4"
            >
              <Plus className="w-4 h-4" />
              Add Color Variation
            </button>
            {variations.map((variation, index) => (
              <div key={index} className="bg-warm-beige/30 rounded-xl p-6 space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink">Variation {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Color Name</label>
                    <input
                      type="text"
                      value={variation.color_name}
                      onChange={(e) => updateVariation(index, 'color_name', e.target.value)}
                      placeholder="Blue"
                      className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Color Swatch</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(showColorPicker === index ? null : index)}
                        className="w-full h-12 rounded-xl border border-border/50 flex items-center gap-3 px-4"
                        style={{ backgroundColor: variation.color_hex }}
                      >
                        <span className={`text-sm ${parseInt(variation.color_hex.replace('#', ''), 16) > 0xffffff / 2 ? 'text-ink' : 'text-cream'}`}>
                          {variation.color_hex}
                        </span>
                      </button>
                      {showColorPicker === index && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-cream border border-border/50 rounded-xl shadow-premium z-50">
                          <HexColorPicker
                            color={variation.color_hex}
                            onChange={(color) => updateVariation(index, 'color_hex', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InputField label="SKU" name={`var_sku_${index}`} placeholder="HS62-BLUE" value={variation.sku} onChange={(e) => updateVariation(index, 'sku', e.target.value)} />
                  <InputField label="Price (₹)" name={`var_price_${index}`} type="number" step="0.01" placeholder="339" value={variation.price} onChange={(e) => updateVariation(index, 'price', e.target.value)} />
                  <InputField label="Stock" name={`var_stock_${index}`} type="number" min="0" placeholder="10" value={variation.stock} onChange={(e) => updateVariation(index, 'stock', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Variation Image</label>
                  <div className="flex items-center gap-4">
                    {variation.image_url && (
                      <img src={variation.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-warm-beige/50 border border-border/50 rounded-xl cursor-pointer hover:border-terracotta/50 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      {variation.image_url ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'variation', index)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </SectionContent>
        </div>

        {/* Status */}
        <div className="bg-cream rounded-2xl shadow-premium overflow-hidden">
          <SectionHeader icon={formData.is_active ? Eye : EyeOff} title="Status" section="status" />
          <SectionContent section="status">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border/50"
              />
              <label className="text-sm text-ink">Active (visible on store)</label>
            </div>
          </SectionContent>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/account/admin/products"
            className="px-8 py-4 border border-border/50 rounded-xl text-sm text-ink hover:bg-warm-beige transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
