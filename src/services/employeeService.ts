// src/services/employeeService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/employees";

interface Employee {
  employee_id?: number;
  name: string;
  position: string;
  email: string;
  phone_number: string;
  address: string;
  created_date?: string;
  updated_date?: string;
}

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get<Employee[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch employees: ${error}`);
  }
};

// Get an employee by ID
export const getEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await axios.get<Employee>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch employee by ID: ${error}`);
  }
};

// Get an employee by name
export const getEmployeeByName = async (name: string): Promise<Employee[]> => {
  try {
    const response = await axios.get<Employee[]>(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch employee by name: ${error}`);
  }
};

// Create a new employee
export const createEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const response = await axios.post<Employee>(`${BASE_URL}/`, employee);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create employee: ${error}`);
  }
};

// Update an employee by ID
export const updateEmployeeById = async (
  id: number,
  employee: Employee
): Promise<Employee> => {
  try {
    const response = await axios.put<Employee>(`${BASE_URL}/${id}`, employee);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update employee by ID: ${error}`);
  }
};

// Delete an employee by ID
export const deleteEmployeeById = async (id: number): Promise<Employee> => {
  try {
    const response = await axios.delete<Employee>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete employee by ID: ${error}`);
  }
};
