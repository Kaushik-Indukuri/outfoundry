import { supabase } from './supabase'

export type EmailStatus = 'pending' | 'sent' | 'bounced' | 'opened' | 'clicked'

export interface CampaignLead {
  id: string
  campaign_id: string
  lead_id: string
  status: EmailStatus
  sent_at?: string
  opened_at?: string
  clicked_at?: string
}

export interface CreateCampaignLeadData {
  campaign_id: string
  lead_id: string
  status?: EmailStatus
}

export interface UpdateCampaignLeadData {
  status?: EmailStatus
  sent_at?: string
  opened_at?: string
  clicked_at?: string
}

// Campaign-Leads CRUD operations
export const campaignLeadsService = {
  // Get all campaign leads for a specific campaign
  async getByCampaignId(campaignId: string): Promise<{ data: CampaignLead[] | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .select(`
        *,
        leads (
          id,
          email,
          name,
          company,
          title,
          industry
        )
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get campaign lead by ID
  async getById(id: string): Promise<{ data: CampaignLead | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create a new campaign lead relationship
  async create(campaignLeadData: CreateCampaignLeadData): Promise<{ data: CampaignLead | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .insert([{
        ...campaignLeadData,
        status: campaignLeadData.status || 'pending'
      }])
      .select()
      .single()
    
    return { data, error }
  },

  // Create multiple campaign lead relationships (bulk insert)
  async createMany(campaignLeadsData: CreateCampaignLeadData[]): Promise<{ data: CampaignLead[] | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .insert(campaignLeadsData.map(item => ({
        ...item,
        status: item.status || 'pending'
      })))
      .select()
    
    return { data, error }
  },

  // Update campaign lead status
  async update(id: string, campaignLeadData: UpdateCampaignLeadData): Promise<{ data: CampaignLead | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .update(campaignLeadData)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Update campaign lead status by campaign and lead IDs
  async updateByCampaignAndLead(campaignId: string, leadId: string, campaignLeadData: UpdateCampaignLeadData): Promise<{ data: CampaignLead | null; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .update(campaignLeadData)
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete a campaign lead relationship
  async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('campaign_leads')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // Get campaign statistics
  async getCampaignStats(campaignId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase
      .from('campaign_leads')
      .select('status')
      .eq('campaign_id', campaignId)
    
    if (error) return { data: null, error }

    const stats = {
      total: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      sent: data.filter(item => item.status === 'sent').length,
      bounced: data.filter(item => item.status === 'bounced').length,
      opened: data.filter(item => item.status === 'opened').length,
      clicked: data.filter(item => item.status === 'clicked').length
    }

    return { data: stats, error: null }
  },

  // Mark email as sent
  async markAsSent(campaignId: string, leadId: string): Promise<{ data: CampaignLead | null; error: any }> {
    return this.updateByCampaignAndLead(campaignId, leadId, {
      status: 'sent',
      sent_at: new Date().toISOString()
    })
  },

  // Mark email as opened
  async markAsOpened(campaignId: string, leadId: string): Promise<{ data: CampaignLead | null; error: any }> {
    return this.updateByCampaignAndLead(campaignId, leadId, {
      status: 'opened',
      opened_at: new Date().toISOString()
    })
  },

  // Mark email as clicked
  async markAsClicked(campaignId: string, leadId: string): Promise<{ data: CampaignLead | null; error: any }> {
    return this.updateByCampaignAndLead(campaignId, leadId, {
      status: 'clicked',
      clicked_at: new Date().toISOString()
    })
  },

  // Mark email as bounced
  async markAsBounced(campaignId: string, leadId: string): Promise<{ data: CampaignLead | null; error: any }> {
    return this.updateByCampaignAndLead(campaignId, leadId, {
      status: 'bounced'
    })
  }
} 