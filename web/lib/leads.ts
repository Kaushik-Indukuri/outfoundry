import { supabase } from './supabase'

export interface Lead {
  id: string
  email: string
  name?: string
  company?: string
  title?: string
  industry?: string
  created_at: string
  enriched_data?: any
}

export interface CreateLeadData {
  email: string
  name?: string
  company?: string
  title?: string
  industry?: string
  enriched_data?: any
}

export interface UpdateLeadData {
  email?: string
  name?: string
  company?: string
  title?: string
  industry?: string
  enriched_data?: any
}

// Leads CRUD operations
export const leadsService = {
  // Get all leads for the current user
  async getAll(): Promise<{ data: Lead[] | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get a single lead by ID
  async getById(id: string): Promise<{ data: Lead | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create a new lead
  async create(leadData: CreateLeadData): Promise<{ data: Lead | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()
    
    return { data, error }
  },

  // Create multiple leads (bulk insert)
  async createMany(leadsData: CreateLeadData[]): Promise<{ data: Lead[] | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .insert(leadsData)
      .select()
    
    return { data, error }
  },

  // Update an existing lead
  async update(id: string, leadData: UpdateLeadData): Promise<{ data: Lead | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a lead
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // Get leads by email (for deduplication)
  async getByEmail(email: string): Promise<{ data: Lead[] | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
    
    return { data, error }
  },

  // Update enrichment data for a lead
  async updateEnrichment(id: string, enrichedData: any): Promise<{ data: Lead | null; error: any }> {
    const { data, error } = await supabase
      .from('leads')
      .update({ enriched_data: enrichedData })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
} 