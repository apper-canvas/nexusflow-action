import apperClient from './apperClient';
import { toast } from 'react-toastify';

export const SUPPORT_TICKET_TABLE = 'support_ticket';

export async function fetchSupportTickets(filters = {}, page = 1, limit = 20) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const params = {
      fields: [
        { field: { name: 'Id' } },
        { field: { name: 'Name' } },
        { field: { name: 'subject' } },
        { field: { name: 'customer' } },
        { field: { name: 'company' } },
        { field: { name: 'status' } },
        { field: { name: 'priority' } },
        { field: { name: 'description' } },
        { field: { name: 'assignedTo' } },
        { field: { name: 'CreatedOn' } },
        { field: { name: 'ModifiedOn' } }
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
          fieldName: 'subject',
          operator: 'Contains',
          values: [filters.searchTerm]
        }
      ];
    }

    if (filters.status && filters.status !== 'all') {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filters.status]
      });
    }

    if (filters.priority) {
      params.where = params.where || [];
      params.where.push({
        fieldName: 'priority',
        operator: 'ExactMatch',
        values: [filters.priority]
      });
    }

    const response = await client.fetchRecords(SUPPORT_TICKET_TABLE, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return { 
      data: response.data, 
      total: response.totalRecords || response.data.length 
    };
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    toast.error('Failed to load support tickets');
    return { data: [], total: 0 };
  }
}

export async function getSupportTicketById(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.getRecordById(SUPPORT_TICKET_TABLE, id);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching support ticket with ID ${id}:`, error);
    toast.error('Failed to load support ticket details');
    return null;
  }
}

export async function createSupportTicket(ticketData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.createRecord(SUPPORT_TICKET_TABLE, { record: ticketData });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create support ticket');
    }
    
    toast.success('Support ticket created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    toast.error(error.message || 'Failed to create support ticket');
    return null;
  }
}

export async function updateSupportTicket(id, ticketData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    // Make sure to include the ID in the update data
    const dataToUpdate = { ...ticketData, Id: id };
    
    const response = await client.updateRecord(SUPPORT_TICKET_TABLE, { record: dataToUpdate });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update support ticket');
    }
    
    toast.success('Support ticket updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating support ticket with ID ${id}:`, error);
    toast.error(error.message || 'Failed to update support ticket');
    return null;
  }
}

export async function deleteSupportTicket(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.deleteRecord(SUPPORT_TICKET_TABLE, { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete support ticket');
    }
    
    toast.success('Support ticket deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting support ticket with ID ${id}:`, error);
    toast.error(error.message || 'Failed to delete support ticket');
    return false;
  }
}