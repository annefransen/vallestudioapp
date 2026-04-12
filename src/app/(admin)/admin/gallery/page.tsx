'use client'

import { Upload, Image as ImageIcon, Trash2, Plus, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'Haircuts', 'Color', 'Nails', 'Brows']

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMissing, setSchemaMissing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    async function loadGallery() {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
      if (error && error.code === '42P01') {
        setSchemaMissing(true)
      } else if (data) {
        setImages(data)
      }
      setLoading(false)
    }
    void loadGallery()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = activeCategory === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === activeCategory.toLowerCase())

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Gallery</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage portfolio and landing page assets</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
          <Upload className="w-4 h-4" /> Upload Photo
        </button>
      </div>

      {/* Schema missing notice */}
      {schemaMissing && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Database Table Needed</p>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">Run this SQL in Supabase to enable the gallery:</p>
              <code className="block mt-2 bg-blue-900/10 px-3 py-2 rounded-lg text-[11px] font-mono text-blue-950 select-all leading-relaxed">
                {`CREATE TABLE public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);`}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg w-fit overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap',
              activeCategory === cat ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((img, i) => (
            <div
              key={img.id || i}
              className="group relative bg-zinc-100 aspect-square rounded-xl overflow-hidden border border-zinc-200"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-zinc-300" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="Gallery item" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {img.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md w-fit">
                    {img.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 py-20 text-center hover:bg-zinc-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-sm font-semibold text-zinc-900">Gallery is empty</p>
          <p className="text-xs text-zinc-400 mt-1">Upload your first photo to showcase on the platform</p>
          <button className="mt-5 flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors mx-auto">
            <Upload className="w-4 h-4" /> Upload Photo
          </button>
        </div>
      )}
    </div>
  )
}
