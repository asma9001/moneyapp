'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import RichTextEditor from '@/components/RichTextEditor'
import ImageUpload from '@/components/ImageUpload'
import { blogAPI, sitesAPI } from '@/lib/api'
import { Save, Eye, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sites, setSites] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    status: 'draft',
    targetSites: []
  })

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchSites()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await blogAPI.getPost(postId)
      const post = response.data
      setFormData({
        title: post.title || '',
        content: post.content || '',
        slug: post.slug || '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        featuredImage: post.featuredImage || '',
        status: post.status || 'draft',
        targetSites: post.targetSites || []
      })
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('Failed to load post')
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  const fetchSites = async () => {
    try {
      const response = await sitesAPI.getSites()
      setSites(response.data || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
      // Mock data for development
      setSites([
        { id: 1, name: 'Tech Blog', url: 'https://techblog.com' },
        { id: 2, name: 'Lifestyle Blog', url: 'https://lifestyle.com' },
        { id: 3, name: 'Business Blog', url: 'https://business.com' },
        { id: 4, name: 'News Blog', url: 'https://news.com' }
      ])
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !prev.slug ? { slug: generateSlug(value) } : {})
    }))
  }

  const handleSiteToggle = (siteId) => {
    setFormData(prev => ({
      ...prev,
      targetSites: prev.targetSites.includes(siteId)
        ? prev.targetSites.filter(id => id !== siteId)
        : [...prev.targetSites, siteId]
    }))
  }

  const handleSubmit = async (status = formData.status) => {
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      alert('Please enter content')
      return
    }

    try {
      setSaving(true)
      const postData = {
        ...formData,
        status,
        slug: formData.slug || generateSlug(formData.title)
      }

      await blogAPI.updatePost(postId, postData)
      router.push('/posts')
    } catch (error) {
      console.error('Failed to update post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      await blogAPI.deletePost(postId)
      router.push('/posts')
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center py-8">
            <div className="spinner"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/posts"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="text-sm text-gray-500">Update your blog post</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <div className="spinner w-4 h-4 border-2 border-red-700 border-t-transparent"></div>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1 inline" />
                    Delete
                  </>
                )}
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update & Publish'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                />
              </div>

              {/* Featured Image */}
              <ImageUpload
                onImageUpload={(url) => handleInputChange('featuredImage', url)}
                currentImage={formData.featuredImage}
                onRemove={() => handleInputChange('featuredImage', '')}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SEO Settings */}
              <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="post-url-slug"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="SEO title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder="SEO description..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Target Sites */}
              <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Target WordPress Sites</h3>
                
                <div className="space-y-2">
                  {sites.map((site) => (
                    <label key={site.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.targetSites.includes(site.id)}
                        onChange={() => handleSiteToggle(site.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {site.name}
                        <span className="text-gray-500 text-xs block">{site.url}</span>
                      </span>
                    </label>
                  ))}
                </div>
                
                {formData.targetSites.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Select at least one site to publish to
                  </p>
                )}
              </div>

              {/* Post Status */}
              <div className="bg-white p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Draft</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
