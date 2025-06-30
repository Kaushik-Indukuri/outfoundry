'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Edit, Trash2, Copy, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { templatesService, Template } from "@/lib/templates"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  return (
    <ProtectedRoute>
      <TemplatesContent />
    </ProtectedRoute>
  )
}

function TemplatesContent() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const { error } = await templatesService.delete(id)
      
      if (error) {
        toast.error("Failed to delete template")
        console.error("Error deleting template:", error)
        return
      }

      toast.success("Template deleted successfully")
      setTemplates(templates.filter(t => t.id !== id))
    } catch (error) {
      toast.error("Failed to delete template")
      console.error("Error deleting template:", error)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const { data, error } = await templatesService.duplicate(id)
      
      if (error) {
        toast.error("Failed to duplicate template")
        console.error("Error duplicating template:", error)
        return
      }

      toast.success("Template duplicated successfully")
      if (data) {
        setTemplates([data, ...templates])
      }
    } catch (error) {
      toast.error("Failed to duplicate template")
      console.error("Error duplicating template:", error)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/templates/edit/${id}`)
  }

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground">
              Create and manage email templates for your campaigns
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href="/templates/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search templates..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading templates...</span>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Template Cards */}
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(template.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDuplicate(template.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(template.id, template.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>Created {formatDate(template.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first email template to get started with campaigns
                </p>
                <Button asChild>
                  <Link href="/templates/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {!loading && templates.length > 0 && filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 