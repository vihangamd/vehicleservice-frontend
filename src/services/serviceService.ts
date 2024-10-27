// src/services/serviceService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/services";

interface Service {
  service_id?: number;
  name: string;
  description: string;
  default_price: string;
  created_date?: string;
  updated_date?: string;
}

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get<Service[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error}`);
  }
};

// Get a service by ID
export const getServiceById = async (id: number): Promise<Service> => {
  try {
    const response = await axios.get<Service>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch service by ID: ${error}`);
  }
};

// Create a new service
export const createService = async (service: Service): Promise<Service> => {
  try {
    const response = await axios.post<Service>(`${BASE_URL}/`, service);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create service: ${error}`);
  }
};

// Update a service by ID
export const updateServiceById = async (
  id: number,
  service: Service
): Promise<Service> => {
  try {
    const response = await axios.put<Service>(`${BASE_URL}/${id}`, service);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update service by ID: ${error}`);
  }
};

// Delete a service by ID
export const deleteServiceById = async (id: number): Promise<Service> => {
  try {
    const response = await axios.delete<Service>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete service by ID: ${error}`);
  }
};
