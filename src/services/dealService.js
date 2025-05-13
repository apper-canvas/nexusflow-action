import apperClient from './apperClient';
import { toast } from 'react-toastify';

export const DEAL_TABLE = 'deal';

export async function fetchDeals(filters = {}, page = 1, limit = 20) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const params = {
      fields: [
        { field: { name: 'Id' } },
        { field: { name: 'Name' } },
        { field: { name: 'title' } },
        { field: { name: 'customer' } },
        { field: { name: 'value' } },
        { field: { name: 'stage' } },
        { field: { name: 'probability' } },
        { field: { name: 'expectedCloseDate' } },
        { field: { name: 'type' } },
        { field: { name: 'contact' } },
        { field: { name: 'email' } },
        { field: { name: 'phone' } }
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
          fieldName: 'title',
          operator: 'Contains',
          values: [filters.searchTerm]
        }
      ];
    }

    if (filters.stage) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'stage',
        operator: 'ExactMatch',
        values: [filters.stage]
      });
    }

    if (filters.type) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'type',
        operator: 'ExactMatch',
        values: [filters.type]
      });
    }

    const response = await client.fetchRecords(DEAL_TABLE, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return { 
      data: response.data, 
      total: response.totalRecords || response.data.length 
    };
  } catch (error) {
    console.error('Error fetching deals:', error);
    toast.error('Failed to load deals');
    return { data: [], total: 0 };
  }
}

export async function getDealById(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.getRecordById(DEAL_TABLE, id);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching deal with ID ${id}:`, error);
    toast.error('Failed to load deal details');
    return null;
  }
}

export async function createDeal(dealData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.createRecord(DEAL_TABLE, { record: dealData });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create deal');
    }
    
    toast.success('Deal created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating deal:', error);
    toast.error(error.message || 'Failed to create deal');
    return null;
  }
}

export async function updateDeal(id, dealData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    // Make sure to include the ID in the update data
    const dataToUpdate = { ...dealData, Id: id };
    
    const response = await client.updateRecord(DEAL_TABLE, { record: dataToUpdate });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update deal');
    }
    
    toast.success('Deal updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating deal with ID ${id}:`, error);
    toast.error(error.message || 'Failed to update deal');
    return null;
  }
}

export async function deleteDeal(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.deleteRecord(DEAL_TABLE, { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete deal');
    }
    
    toast.success('Deal deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting deal with ID ${id}:`, error);
    toast.error(error.message || 'Failed to delete deal');
    return false;
  }
}