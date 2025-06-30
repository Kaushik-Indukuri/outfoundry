import { supabase } from './supabase'

export interface Template {
  id: string
  user_id: string
  name: string
  description?: string
  subject: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateTemplateData {
  name: string
  description?: string
  subject: string
  content: string
}

export interface UpdateTemplateData {
  name?: string
  description?: string
  subject?: string
  content?: string
}

// Templates CRUD operations
export const templatesService = {
  // Get all templates for the current user
  async getAll(): Promise<{ data: Template[] | null; error: any }> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get a single template by ID
  async getById(id: string): Promise<{ data: Template | null; error: any }> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create a new template
  async create(templateData: CreateTemplateData): Promise<{ data: Template | null; error: any }> {
    const { data, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select()
      .single()
    
    return { data, error }
  },

  // Update an existing template
  async update(id: string, templateData: UpdateTemplateData): Promise<{ data: Template | null; error: any }> {
    const { data, error } = await supabase
      .from('templates')
      .update({ ...templateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a template
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // Duplicate a template
  async duplicate(id: string): Promise<{ data: Template | null; error: any }> {
    // First get the original template
    const { data: original, error: getError } = await this.getById(id)
    if (getError) return { data: null, error: getError }

    if (!original) return { data: null, error: new Error('Template not found') }

    // Create a copy with "Copy" appended to the name
    const copyData: CreateTemplateData = {
      name: `${original.name} (Copy)`,
      description: original.description,
      subject: original.subject,
      content: original.content
    }

    return await this.create(copyData)
  }
} 