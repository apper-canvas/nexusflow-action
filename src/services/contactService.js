import apperClient from './apperClient';
import { toast } from 'react-toastify';

export const CONTACT_TABLE = 'contact';

export async function fetchContacts(filters = {}, page = 1, limit = 20) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const params = {
      fields: [
        { field: { name: 'Id' } },
        { field: { name: 'Name' } },
        { field: { name: 'company' } },
        { field: { name: 'email' } },
        { field: { name: 'phone' } },
        { field: { name: 'type' } },
        { field: { name: 'location' } },
        { field: { name: 'status' } },
        { field: { name: 'favorite' } }
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

    if (filters.type && filters.type !== 'all') {
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

    const response = await client.fetchRecords(CONTACT_TABLE, params);
    
    if (!response || !response.data) {
      return { data: [], total: 0 };
    }
    
    return { 
      data: response.data, 
      total: response.totalRecords || response.data.length 
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    toast.error('Failed to load contacts');
    return { data: [], total: 0 };
  }
}

export async function getContactById(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.getRecordById(CONTACT_TABLE, id);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    toast.error('Failed to load contact details');
    return null;
  }
}

export async function createContact(contactData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.createRecord(CONTACT_TABLE, { record: contactData });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to create contact');
    }
    
    toast.success('Contact created successfully');
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    toast.error(error.message || 'Failed to create contact');
    return null;
  }
}

export async function updateContact(id, contactData) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    // Make sure to include the ID in the update data
    const dataToUpdate = { ...contactData, Id: id };
    
    const response = await client.updateRecord(CONTACT_TABLE, { record: dataToUpdate });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to update contact');
    }
    
    toast.success('Contact updated successfully');
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    toast.error(error.message || 'Failed to update contact');
    return null;
  }
}

export async function deleteContact(id) {
  try {
    const client = apperClient.getClient();
    if (!client) throw new Error('ApperClient not initialized');

    const response = await client.deleteRecord(CONTACT_TABLE, { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Failed to delete contact');
    }
    
    toast.success('Contact deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    toast.error(error.message || 'Failed to delete contact');
    return false;
  }
}