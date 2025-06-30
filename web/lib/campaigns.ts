import { supabase } from './supabase'

export interface Campaign {
  id: string
  user_id: string
  name: string
  description?: string
  template_id?: string
  created_at: string
}

export interface CreateCampaignData {
  name: string
  description?: string
  template_id?: string
}

export interface UpdateCampaignData {
  name?: string
  description?: string
  template_id?: string
}

// Campaigns CRUD operations
export const campaignsService = {
  // Get all campaigns for the current user
  async getAll(): Promise<{ data: Campaign[] | null; error: any }> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get a single campaign by ID
  async getById(id: string): Promise<{ data: Campaign | null; error: any }> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create a new campaign
  async create(campaignData: CreateCampaignData): Promise<{ data: Campaign | null; error: any }> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single()
    
    return { data, error }
  },

  // Update an existing campaign
  async update(id: string, campaignData: UpdateCampaignData): Promise<{ data: Campaign | null; error: any }> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(campaignData)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a campaign
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
    
    return { error }
  }
} 