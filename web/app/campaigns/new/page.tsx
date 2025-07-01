'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Check, Loader2, Mail, Users, Settings, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { campaignsService, CreateCampaignData } from "@/lib/campaigns"
import { templatesService, Template } from "@/lib/templates"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LeadUpload } from "@/components/LeadUpload"

export default function NewCampaignPage() {
  return (
    <ProtectedRoute>
      <NewCampaignContent />
    </ProtectedRoute>
  )
}

function NewCampaignContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    template_id: ''
  })
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const [uploadedLeads, setUploadedLeads] = useState<any[]>([])

  const steps = [
    { id: 1, title: 'Campaign Details', icon: Mail },
    { id: 2, title: 'Template Selection', icon: Eye },
    { id: 3, title: 'Lead Upload', icon: Users },
    { id: 4, title: 'Review & Launch', icon: Settings }
  ]

  // Load templates on component mount
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await templatesService.getAll()
      
      if (error) {
        toast.error("Failed to load templates")
        console.error("Error loading templates:", error)
        return
      }

      setTemplates(data || [])
    } catch (error) {
      toast.error("Failed to load templates")
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep === 1 && !campaignData.name.trim()) {
      toast.error("Campaign name is required")
      return
    }
    if (currentStep === 2 && !campaignData.template_id) {
      toast.error("Please select a template")
      return
    }
    if (currentStep === 3 && uploadedLeads.length === 0) {
      toast.error("Please upload leads before proceeding")
      return
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSave = async () => {
    if (!campaignData.name.trim()) {
      toast.error("Campaign name is required")
      return
    }

    if (!campaignData.template_id) {
      toast.error("Please select a template")
      return
    }

    try {
      setSaving(true)
      const { data, error } = await campaignsService.create(campaignData)
      
      if (error) {
        toast.error("Failed to create campaign")
        console.error("Error creating campaign:", error)
        return
      }

      toast.success("Campaign created successfully")
      router.push('/campaigns')
    } catch (error) {
      toast.error("Failed to create campaign")
      console.error("Error creating campaign:", error)
    } finally {
      setSaving(false)
    }
  }

  const selectedTemplate = templates.find(t => t.id === campaignData.template_id)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground">
              Set up your email campaign step by step
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="py-4">
          <div className="relative">
            <div className="relative mx-4">
                {/* Gray background line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300"></div>
                {/* Blue progress line */}
                <div
                className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-700"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 z-10
                        ${isCompleted 
                          ? "bg-primary text-white" 
                          : isActive 
                            ? "bg-primary text-white ring-4 ring-primary/20"
                            : "bg-white text-gray-400 border-2 border-gray-300"
                        }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className={`text-xs font-medium mt-2 max-w-16 text-center leading-tight
                      ${isCompleted || isActive ? "text-primary" : "text-gray-400"}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input 
                    id="campaign-name" 
                    placeholder="e.g., Q1 Sales Outreach"
                    value={campaignData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea 
                    id="campaign-description" 
                    placeholder="Brief description of this campaign"
                    value={campaignData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading templates...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select an email template for your campaign
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {templates.map((template) => (
                        <Card 
                          key={template.id}
                          className={`cursor-pointer transition-colors ${
                            campaignData.template_id === template.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-muted-foreground/50'
                          }`}
                          onClick={() => handleInputChange('template_id', template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description || "No description"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Subject: {template.subject}
                                </p>
                              </div>
                              {campaignData.template_id === template.id && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {templates.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No templates available</p>
                        <Button asChild>
                          <Link href="/templates/new">
                            Create Template
                          </Link>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <LeadUpload onLeadsReady={leads => setUploadedLeads(leads)} />
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Campaign Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Name:</span> {campaignData.name}
                    </div>
                    {campaignData.description && (
                      <div>
                        <span className="font-medium">Description:</span> {campaignData.description}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Template:</span> {selectedTemplate?.name}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Leads Uploaded</h4>
                  {uploadedLeads.length > 0 ? (
                    <div className="border rounded p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">
                        {uploadedLeads.length} leads uploaded
                      </p>
                      <ul className="text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1">
                        {uploadedLeads.slice(0, 10).map((lead, idx) => (
                          <li key={idx}>{lead.email} {lead.name && `- ${lead.name}`}</li>
                        ))}
                      </ul>
                      {uploadedLeads.length > 10 && (
                        <p className="text-xs text-muted-foreground mt-2">...and {uploadedLeads.length - 10} more</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No leads uploaded yet.</p>
                  )}
                </div>

                {selectedTemplate && (
                  <div>
                    <h4 className="font-medium mb-2">Template Preview</h4>
                    <Card className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <span className="font-medium">Subject:</span> {selectedTemplate.subject}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedTemplate.content}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Creating...' : 'Launch Campaign'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 