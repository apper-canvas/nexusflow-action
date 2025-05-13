// Singleton ApperClient service
let instance = null;

class ApperClientService {
  constructor() {
    if (instance) {
      return instance;
    }

    this.client = null;
    instance = this;
    this.initialize();
  }

  initialize() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } else {
      console.error('ApperSDK not found. Make sure it is loaded properly.');
    }
  }

  getClient() {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }
}

export default new ApperClientService();