// src/services/customerService.ts
import axios from "axios";
const BASE_URL = "http://localhost:3000/customers";

interface Customer {
  customer_id?: number;
  customer_code?: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  created_date?: string;
  updated_date?: string;
}

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await axios.get<Customer[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch customers: ${error}`);
  }
};

// Get a customer by ID
export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await axios.get<Customer>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch customer by ID: ${error}`);
  }
};

// Get a customer by customer_code
export const getCustomerByCode = async (
  customer_code: string
): Promise<Customer> => {
  try {
    const response = await axios.get<Customer>(
      `${BASE_URL}/code/${customer_code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch customer by code: ${error}`);
  }
};

// Create a new customer
export const createCustomer = async (customer: Customer): Promise<Customer> => {
  try {
    const response = await axios.post<Customer>(`${BASE_URL}/`, customer);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create customer: ${error}`);
  }
};

// Update a customer by ID
export const updateCustomerById = async (
  id: number,
  customer: Customer
): Promise<Customer> => {
  try {
    const response = await axios.put<Customer>(`${BASE_URL}/${id}`, customer);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update customer by ID: ${error}`);
  }
};

// Update a customer by customer_code
export const updateCustomerByCode = async (
  customer_code: string,
  customer: Customer
): Promise<Customer> => {
  try {
    const response = await axios.put<Customer>(
      `${BASE_URL}/code/${customer_code}`,
      customer
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update customer by code: ${error}`);
  }
};

// Delete a customer by ID
export const deleteCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await axios.delete<Customer>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete customer by ID: ${error}`);
  }
};

// Delete a customer by customer_code
export const deleteCustomerByCode = async (
  customer_code: string
): Promise<Customer> => {
  try {
    const response = await axios.delete<Customer>(
      `${BASE_URL}/code/${customer_code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete customer by code: ${error}`);
  }
};
