// src/services/inventoryService.ts
import axios from "axios";

// Base URLs for non-expirable and expirable inventory
const NON_EXPIRABLE_BASE_URL = "http://localhost:3000/inventory/non-expirable";
const EXPIRABLE_BASE_URL = "http://localhost:3000/inventory/expirable";

interface NonExpirableInventory {
  inventory_id?: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  created_date?: string;
  updated_date?: string;
}

interface ExpirableInventory {
  inventory_id?: number;
  name: string;
  description: string;
  batch_code: string;
  quantity: number;
  unit_price: number;
  expiry_date: string;
  created_date?: string;
  updated_date?: string;
}

// Get all non-expirable inventory items
export const getAllNonExpirableInventory = async (): Promise<
  NonExpirableInventory[]
> => {
  try {
    const response = await axios.get<NonExpirableInventory[]>(
      `${NON_EXPIRABLE_BASE_URL}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch non-expirable inventory: ${error}`);
  }
};

// Get a non-expirable inventory item by ID
export const getNonExpirableInventoryById = async (
  id: number
): Promise<NonExpirableInventory> => {
  try {
    const response = await axios.get<NonExpirableInventory>(
      `${NON_EXPIRABLE_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch non-expirable inventory by ID: ${error}`);
  }
};

// Create a new non-expirable inventory item
export const createNonExpirableInventory = async (
  inventory: NonExpirableInventory
): Promise<NonExpirableInventory> => {
  try {
    const response = await axios.post<NonExpirableInventory>(
      `${NON_EXPIRABLE_BASE_URL}/`,
      inventory
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create non-expirable inventory item: ${error}`);
  }
};

// Update a non-expirable inventory item by ID
export const updateNonExpirableInventoryById = async (
  id: number,
  inventory: NonExpirableInventory
): Promise<NonExpirableInventory> => {
  try {
    const response = await axios.put<NonExpirableInventory>(
      `${NON_EXPIRABLE_BASE_URL}/${id}`,
      inventory
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update non-expirable inventory by ID: ${error}`);
  }
};

// Delete a non-expirable inventory item by ID
export const deleteNonExpirableInventoryById = async (
  id: number
): Promise<NonExpirableInventory> => {
  try {
    const response = await axios.delete<NonExpirableInventory>(
      `${NON_EXPIRABLE_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete non-expirable inventory by ID: ${error}`);
  }
};

// Expirable inventory services

// Get all expirable inventory items
export const getAllExpirableInventory = async (): Promise<
  ExpirableInventory[]
> => {
  try {
    const response = await axios.get<ExpirableInventory[]>(
      `${EXPIRABLE_BASE_URL}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch expirable inventory: ${error}`);
  }
};

// Get an expirable inventory item by ID
export const getExpirableInventoryById = async (
  id: number
): Promise<ExpirableInventory> => {
  try {
    const response = await axios.get<ExpirableInventory>(
      `${EXPIRABLE_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch expirable inventory by ID: ${error}`);
  }
};

// Create a new expirable inventory item
export const createExpirableInventory = async (
  inventory: ExpirableInventory
): Promise<ExpirableInventory> => {
  try {
    const response = await axios.post<ExpirableInventory>(
      `${EXPIRABLE_BASE_URL}/`,
      inventory
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create expirable inventory item: ${error}`);
  }
};

// Update an expirable inventory item by ID
export const updateExpirableInventoryById = async (
  id: number,
  inventory: ExpirableInventory
): Promise<ExpirableInventory> => {
  try {
    const response = await axios.put<ExpirableInventory>(
      `${EXPIRABLE_BASE_URL}/${id}`,
      inventory
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update expirable inventory by ID: ${error}`);
  }
};

// Delete an expirable inventory item by ID
export const deleteExpirableInventoryById = async (
  id: number
): Promise<ExpirableInventory> => {
  try {
    const response = await axios.delete<ExpirableInventory>(
      `${EXPIRABLE_BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete expirable inventory by ID: ${error}`);
  }
};
