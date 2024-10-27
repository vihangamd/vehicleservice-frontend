// src/services/vehicleService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/vehicles";

interface Vehicle {
  vehicle_id?: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  updated_date?: string;
}

// Get all vehicles
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<Vehicle[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles: ${error}`);
  }
};

// Get a vehicle by ID
export const getVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const response = await axios.get<Vehicle>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicle by ID: ${error}`);
  }
};

// Get vehicles by customer ID
export const getVehiclesByCustomerId = async (
  customerId: number
): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<Vehicle[]>(
      `${BASE_URL}/customer/${customerId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch vehicles by customer ID: ${error}`);
  }
};

// Create a new vehicle
export const createVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  try {
    const response = await axios.post<Vehicle>(`${BASE_URL}/`, vehicle);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create vehicle: ${error}`);
  }
};

// Update a vehicle by ID
export const updateVehicleById = async (
  id: number,
  vehicle: Vehicle
): Promise<Vehicle> => {
  try {
    const response = await axios.put<Vehicle>(`${BASE_URL}/${id}`, vehicle);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update vehicle by ID: ${error}`);
  }
};

// Delete a vehicle by ID
export const deleteVehicleById = async (id: number): Promise<Vehicle> => {
  try {
    const response = await axios.delete<Vehicle>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete vehicle by ID: ${error}`);
  }
};
