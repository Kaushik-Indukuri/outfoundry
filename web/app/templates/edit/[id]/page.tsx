'use client'

import React from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { templatesService, Template } from "@/lib/templates"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EditTemplatePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const resolvedParams = React.use(params)
  
  return (
    <ProtectedRoute>
      <EditTemplateContent id={resolvedParams.id} />
    </ProtectedRoute>
  )
}

function EditTemplateContent({ id }: { id: string }) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    subject: '',
    content: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Load template data on component mount
  useEffect(() => {
    loadTemplate()
  }, [id])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      const { data, error } = await templatesService.getById(id)
      
      if (error) {
        toast.error("Failed to load template")
        console.error("Error loading template:", error)
        router.push('/templates')
        return
      }

      if (!data) {
        toast.error("Template not found")
        router.push('/templates')
        return
      }

      setTemplate(data)
      setTemplateData({
        name: data.name,
        description: data.description || '',
        subject: data.subject,
        content: data.content
      })
    } catch (error) {
      toast.error("Failed to load template")
      console.error("Error loading template:", error)
      router.push('/templates')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!templateData.name.trim()) {
      toast.error("Template name is required")
      return
    }

    if (!templateData.subject.trim()) {
      toast.error("Subject line is required")
      return
    }

    if (!templateData.content.trim()) {
      toast.error("Email content is required")
      return
    }

    try {
      setSaving(true)
      const { data, error } = await templatesService.update(id, templateData)
      
      if (error) {
        toast.error("Failed to update template")
        console.error("Error updating template:", error)
        return
      }

      toast.success("Template updated successfully")
      router.push('/templates')
    } catch (error) {
      toast.error("Failed to update template")
      console.error("Error updating template:", error)
    } finally {
      setSaving(false)
    }
  }

  // Sample data for preview
  const sampleData = {
    first_name: 'John',
    last_name: 'Doe',
    company: 'Acme Corp',
    job_title: 'CEO',
  }

  // Simple template variable replacement for preview
  const getPreviewContent = () => {
    let content = templateData.content
    Object.entries(sampleData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return content
  }

  const getPreviewSubject = () => {
    let subject = templateData.subject
    Object.entries(sampleData).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return subject
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading template...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Template</h1>
            <p className="text-muted-foreground">
              Update your email template
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Template Form */}
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name *</Label>
                  <Input 
                    id="template-name" 
                    placeholder="e.g., Cold Outreach"
                    value={templateData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Input 
                    id="template-description" 
                    placeholder="Brief description of this template"
                    value={templateData.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-subject">Email Subject Line *</Label>
                  <Input 
                    id="template-subject" 
                    placeholder="e.g., Quick question about {{company}}"
                    value={templateData.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('subject', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-content">Email Content *</Label>
                  <Textarea 
                    id="template-content" 
                    placeholder="Write your email content here..."
                    value={templateData.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('content', e.target.value)}
                    className="mt-1 min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold">Variables:</span> Use <span className="font-mono bg-muted px-1 rounded">{'{{...}}'}</span> to insert personalized fields. <br />
                    Available variables: <span className="font-mono bg-muted px-1 rounded">{'{{first_name}}'}</span>, <span className="font-mono bg-muted px-1 rounded">{'{{last_name}}'}</span>, <span className="font-mono bg-muted px-1 rounded">{'{{company}}'}</span>, <span className="font-mono bg-muted px-1 rounded">{'{{job_title}}'}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold">Prompts:</span> Use <span className="font-mono bg-muted px-1 rounded">{'{%...%}'}</span> to insert dynamic, AI-generated content. <br />
                    For example: <span className="font-mono bg-muted px-1 rounded">{'{%Write a personalized intro for {{first_name}} at {{company}} based on their job title {{job_title}}%}'}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Update Template'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h4 className="font-medium mb-2">
                    Subject: {getPreviewSubject() || 'No subject line'}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-2 whitespace-pre-wrap">
                    {getPreviewContent()}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p><strong>Sample data used:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>name: {sampleData.first_name}</li>
                    <li>email: {sampleData.last_name}</li>
                    <li>company: {sampleData.company}</li>
                    <li>title: {sampleData.job_title}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 