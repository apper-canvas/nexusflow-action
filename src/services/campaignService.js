import apperClient from './apperClient';
import { toast } from 'react-toastify';

export const CAMPAIGN_TABLE = 'campaign';

export async function fetchCampaigns(filters = {}, page = 1, limit = 20) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const params = {
      fields: [
        { field: { name: 'Id' } },
        { field: { name: 'Name' } },
        { field: { name: 'type' } },
        { field: { name: 'status' } },
        { field: { name: 'sent' } },
        { field: { name: 'opened' } },
        { field: { name: 'clicked' } },
        { field: { name: 'converted' } },
        { field: { name: 'startDate' } },
        { field: { name: 'endDate' } }
      ],
      pagingInfo: {
        limit,
        offset: (page - 1) * limit
      }
    };

    // Add filters if provided
    if (filters.searchTerm) {
      params.where = [
        {
          fieldName: 'Name',
          operator: 'Contains',
          values: [filters.searchTerm]
        }
      ];
    }

    if (filters.type) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'type',
        operator: 'ExactMatch',
        values: [filters.type]
      });
    }

    if (filters.status) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filters.status]
      });
    }

    const response = await client.fetchRecords(CAMPAIGN_TABLE, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return { 
      data: response.data, 
      total: response.totalRecords || response.data.length 
    };
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    toast.error('Failed to load campaigns');
    return { data: [], total: 0 };
  }
}

export async function getCampaignById(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.getRecordById(CAMPAIGN_TABLE, id);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign with ID ${id}:`, error);
    toast.error('Failed to load campaign details');
    return null;
  }
}

export async function createCampaign(campaignData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.createRecord(CAMPAIGN_TABLE, { record: campaignData });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create campaign');
    }
    
    toast.success('Campaign created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    toast.error(error.message || 'Failed to create campaign');
    return null;
  }
}

export async function updateCampaign(id, campaignData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    // Make sure to include the ID in the update data
    const dataToUpdate = { ...campaignData, Id: id };
    
    const response = await client.updateRecord(CAMPAIGN_TABLE, { record: dataToUpdate });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update campaign');
    }
    
    toast.success('Campaign updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating campaign with ID ${id}:`, error);
    toast.error(error.message || 'Failed to update campaign');
    return null;
  }
}

export async function deleteCampaign(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.deleteRecord(CAMPAIGN_TABLE, { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete campaign');
    }
    
    toast.success('Campaign deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting campaign with ID ${id}:`, error);
    toast.error(error.message || 'Failed to delete campaign');
    return false;
  }
}