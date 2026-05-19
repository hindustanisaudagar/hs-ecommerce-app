'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminNewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    stock: '',
    tags: '',
    is_active: true,
  })
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setFormData({ ...formData, name: e.target.value, slug })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    setUploading(true)

    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'hindustani-saudagar')
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()

      if (data.secure_url) {
        setImages([...images, data.secure_url])
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          stock: parseInt(formData.stock) || 0,
          images,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create product')
      }

      router.push('/admin/products')
    } catch (error: any) {
      alert(error.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="font-serif text-2xl text-ink mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-cream rounded-2xl p-8 shadow-premium space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleSlugChange}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Slug (auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Category *
            </label>
            <select
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="original_price"
                min="0"
                step="0.01"
                value={formData.original_price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="handmade, ceramic, new"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Images
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
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
                  onChange={handleImageUpload}
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
              Upload product images (Cloudinary)
            </p>
          </div>

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
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="px-8 py-4 border border-border/50 rounded-xl text-sm text-ink hover:bg-warm-beige transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
