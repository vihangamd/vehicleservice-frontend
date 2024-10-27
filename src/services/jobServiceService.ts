// src/services/jobServiceService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/jobServices";

interface JobService {
  job_service_id?: number;
  job_id: number;
  service_id?: number;
  custom_service_name?: string | null;
  custom_service_price?: number | null;
  quantity: number;
  price: number;
  employee_id: number;
  created_date?: string;
  updated_date?: string;
}

// Get job services by job ID
export const fetchJobServicesByJobId = async (
  jobId: number
): Promise<JobService[]> => {
  try {
    const response = await axios.get<JobService[]>(`${BASE_URL}/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch job services by job ID: ${error}`);
  }
};

// Create a new job service
export const createJobService = async (
  jobService: JobService
): Promise<JobService> => {
  try {
    const response = await axios.post<JobService>(`${BASE_URL}/`, jobService);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create job service: ${error}`);
  }
};

// Update a job service by ID
export const updateJobServiceById = async (
  id: number,
  jobService: JobService
): Promise<JobService> => {
  try {
    const response = await axios.put<JobService>(
      `${BASE_URL}/${id}`,
      jobService
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update job service by ID: ${error}`);
  }
};

// Delete a job service by ID
export const deleteJobServiceById = async (id: number): Promise<JobService> => {
  try {
    const response = await axios.delete<JobService>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete job service by ID: ${error}`);
  }
};
