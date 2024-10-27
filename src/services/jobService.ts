// src/services/jobService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/jobs";

interface Job {
  job_id?: number;
  customer_id: number;
  vehicle_id: number;
  status: string;
  created_date?: string;
  updated_date?: string;
}

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch jobs: ${error}`);
  }
};

// Get a job by ID
export const fetchJobById = async (id: number): Promise<Job> => {
  try {
    const response = await axios.get<Job>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch job by ID: ${error}`);
  }
};

// Get jobs by customer ID
export const getJobsByCustomerId = async (
  customerId: number
): Promise<Job[]> => {
  try {
    const response = await axios.get<Job[]>(
      `${BASE_URL}/customer/${customerId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch jobs by customer ID: ${error}`);
  }
};

// Create a new job
export const createJob = async (job: Job): Promise<Job> => {
  try {
    const response = await axios.post<Job>(`${BASE_URL}/`, job);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create job: ${error}`);
  }
};

// Update a job by ID
export const updateJobById = async (id: number, job: Job): Promise<Job> => {
  try {
    const response = await axios.put<Job>(`${BASE_URL}/${id}`, job);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update job by ID: ${error}`);
  }
};

// Delete a job by ID
export const deleteJobById = async (id: number): Promise<Job> => {
  try {
    const response = await axios.delete<Job>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete job by ID: ${error}`);
  }
};
