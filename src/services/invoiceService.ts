// src/services/invoiceService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/invoices";

interface Invoice {
  invoice_id?: number;
  invoice_code?: string;
  job_id?: number;
  total_amount: number;
  is_paid: boolean;
  created_date?: string;
  updated_date?: string;
}

// Get all invoices
export const fetchAllInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get<Invoice[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch all invoices: ${error}`);
  }
};

// Get an invoice by ID
export const fetchInvoiceById = async (id: number): Promise<Invoice> => {
  try {
    const response = await axios.get<Invoice>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch invoice by ID: ${error}`);
  }
};

// Get an invoice by invoice_code
export const getInvoiceByCode = async (
  invoice_code: string
): Promise<Invoice> => {
  try {
    const response = await axios.get<Invoice>(
      `${BASE_URL}/code/${invoice_code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch invoice by code: ${error}`);
  }
};

// Get invoices by job ID
export const getInvoicesByJobId = async (jobId: number): Promise<Invoice[]> => {
  try {
    const response = await axios.get<Invoice[]>(`${BASE_URL}/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch invoices by job ID: ${error}`);
  }
};

export const createInvoice = async (
  job_id: number,
  services: { price: number; quantity: number }[], // Pass services array
  is_paid: boolean
): Promise<Invoice> => {
  try {
    const response = await axios.post<Invoice>(`${BASE_URL}/`, {
      job_id,
      services,
      is_paid,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create invoice: ${error}`);
  }
};

// // Create a new invoice
// export const createInvoice = async (invoice: Invoice): Promise<Invoice> => {
//   try {
//     const response = await axios.post<Invoice>(`${BASE_URL}/`, invoice);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to create invoice: ${error}`);
//   }
// };

// Update an invoice by ID
export const updateInvoiceById = async (
  id: number,
  invoice: Invoice
): Promise<Invoice> => {
  try {
    const response = await axios.put<Invoice>(`${BASE_URL}/${id}`, invoice);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update invoice by ID: ${error}`);
  }
};

// Update an invoice by invoice_code
export const updateInvoiceByCode = async (
  invoice_code: string,
  invoice: Invoice
): Promise<Invoice> => {
  try {
    const response = await axios.put<Invoice>(
      `${BASE_URL}/code/${invoice_code}`,
      invoice
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update invoice by code: ${error}`);
  }
};

// Delete an invoice by ID
export const deleteInvoiceById = async (id: number): Promise<Invoice> => {
  try {
    const response = await axios.delete<Invoice>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete invoice by ID: ${error}`);
  }
};

// Delete an invoice by invoice_code
export const deleteInvoiceByCode = async (
  invoice_code: string
): Promise<Invoice> => {
  try {
    const response = await axios.delete<Invoice>(
      `${BASE_URL}/code/${invoice_code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete invoice by code: ${error}`);
  }
};
