// src/services/paymentService.ts
import axios from "axios";

const BASE_URL = "http://localhost:3000/payments";

interface Payment {
  payment_id?: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  created_date?: string;
  updated_date?: string;
}

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axios.get<Payment[]>(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch payments: ${error}`);
  }
};

// Get a payment by ID
export const getPaymentById = async (id: number): Promise<Payment> => {
  try {
    const response = await axios.get<Payment>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch payment by ID: ${error}`);
  }
};

// Get payments by invoice ID
export const fetchPaymentsByInvoiceId = async (
  invoiceId: number
): Promise<Payment[]> => {
  try {
    const response = await axios.get<Payment[]>(
      `${BASE_URL}/invoice/${invoiceId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch payments by invoice ID: ${error}`);
  }
};

// Create a new payment
export const createPayment = async (payment: Payment): Promise<Payment> => {
  try {
    const response = await axios.post<Payment>(`${BASE_URL}/`, payment);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create payment: ${error}`);
  }
};

// Update a payment by ID
export const updatePaymentById = async (
  id: number,
  payment: Payment
): Promise<Payment> => {
  try {
    const response = await axios.put<Payment>(`${BASE_URL}/${id}`, payment);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update payment by ID: ${error}`);
  }
};

// Delete a payment by ID
export const deletePaymentById = async (id: number): Promise<Payment> => {
  try {
    const response = await axios.delete<Payment>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete payment by ID: ${error}`);
  }
};
