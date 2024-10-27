// src/pages/InvoicePage.tsx
import React, { useState, useRef } from "react";
import { Grid, Box, Button } from "@mui/material";
import CustomerForm from "../components/CustomerForm";
import EmployeeForm, { EmployeeOptionType } from "../components/EmployeeForm";
import ServiceTable from "../components/ServiceTable";
import { createJob } from "../services/jobService";
import { createJobService } from "../services/jobServiceService";
import { createInvoice, updateInvoiceById } from "../services/invoiceService";
import { createPayment } from "../services/paymentService";

interface Service {
  service_id?: number;
  custom_service_name?: string;
  custom_service_price?: number;
  quantity: number;
  price: number;
  employee_id?: number;
}

const InvoicePage: React.FC = () => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOptionType | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [paymentId, setpaymentId] = useState<number | null>(null);
  const [invoiceMade, setInvoiceMade] = useState<boolean>(false);
  const [paymentMade, setPaymentMade] = useState<boolean>(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleCustomerSelect = (id: number | null) => {
    setCustomerId(id);
  };

  const handleVehicleSelect = (id: number | null) => {
    setVehicleId(id);
  };

  const handleEmployeeSelect = (employee: EmployeeOptionType | null) => {
    setSelectedEmployee(employee);
  };

  const handleServiceChange = (newServices: Service[]) => {
    setServices(newServices);
  };

  const handleCreateInvoice = async () => {
    try {
      if (
        !customerId ||
        !vehicleId ||
        !selectedEmployee ||
        services.length === 0
      ) {
        console.error("Please complete all necessary fields.");
        return;
      }

      // Step 1: Create Job
      const job = await createJob({
        customer_id: customerId,
        vehicle_id: vehicleId,
        status: "Pending",
      });

      // Step 2: Add Job Services
      const jobServicePromises = services.map((service) =>
        createJobService({
          job_id: job.job_id!,
          service_id: service.service_id,
          custom_service_name: service.custom_service_name || null,
          custom_service_price: service.custom_service_price || null,
          quantity: service.quantity,
          price: service.price,
          employee_id: selectedEmployee?.employee_id!,
        })
      );
      await Promise.all(jobServicePromises);

      // Step 3: Remove frontend total calculation and pass services directly
      const invoice = await createInvoice(job.job_id!, services, false); // Pass services array here

      // Set the invoice ID for later payment
      setInvoiceId(invoice.invoice_id ?? null);
      setInvoiceMade(true);
      console.log("Invoice created successfully", invoice);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  // const handleCreateInvoice = async () => {
  //   try {
  //     if (
  //       !customerId ||
  //       !vehicleId ||
  //       !selectedEmployee ||
  //       services.length === 0
  //     ) {
  //       console.error("Please complete all necessary fields.");
  //       return;
  //     }

  //     // Step 1: Create Job
  //     const job = await createJob({
  //       customer_id: customerId,
  //       vehicle_id: vehicleId,
  //       status: "Pending",
  //     });

  //     // Step 2: Add Job Services
  //     const jobServicePromises = services.map((service) =>
  //       createJobService({
  //         job_id: job.job_id!,
  //         service_id: service.service_id,
  //         custom_service_name: service.custom_service_name || null,
  //         custom_service_price: service.custom_service_price || null,
  //         quantity: service.quantity,
  //         price: service.price,
  //         employee_id: selectedEmployee?.employee_id!,
  //       })
  //     );
  //     await Promise.all(jobServicePromises);

  //     // Step 3: Calculate Total Amount
  //     const totalAmount = services.reduce(
  //       (acc, service) => acc + (service.price ?? 0) * service.quantity,
  //       0
  //     );

  //     // Step 4: Create Invoice
  //     const invoice = await createInvoice({
  //       job_id: job.job_id!,
  //       total_amount: totalAmount,
  //       is_paid: false,
  //     });

  //     // Set the invoice ID for later payment
  //     setInvoiceId(invoice.invoice_id ?? null);
  //     setInvoiceMade(true);
  //     console.log("Invoice created successfully", invoice);
  //   } catch (error) {
  //     console.error("Failed to create invoice:", error);
  //   }
  // };

  const handleCreatePayment = async () => {
    if (invoiceId) {
      try {
        const totalAmount = services.reduce(
          (acc, service) => acc + (service.price ?? 0) * service.quantity,
          0
        );
        const paymentd = await createPayment({
          invoice_id: invoiceId,
          amount: totalAmount,
          payment_date: new Date().toISOString().split("T")[0],
          payment_method: "Credit Card",
        });

        // Set the payment ID for later update
        setpaymentId(paymentd.payment_id ?? null);
        // Update the invoice status to paid

        await updateInvoiceById(invoiceId, {
          total_amount: totalAmount,
          is_paid: true,
        });

        // Set payment made flag to true
        setPaymentMade(true);
        console.log("Payment created and invoice updated successfully");
      } catch (error) {
        console.error("Failed to create payment or update invoice:", error);
      }
    } else {
      console.error("No invoice found to associate with the payment.");
    }
  };

  const consoleLogsPayment = async () => {
    console.log("Payment Details:");

    console.log(`invoice_id: ${invoiceId} (${typeof invoiceId})`);

    const totalAmount = services.reduce(
      (acc, service) => acc + (service.price ?? 0) * service.quantity,
      0
    );
    console.log(`amount: ${totalAmount} (${typeof totalAmount})`);

    const paymentDate = new Date().toISOString().split("T")[0];
    console.log(`payment_date: ${paymentDate} (${typeof paymentDate})`);

    const paymentMethod = "Credit Card";
    console.log(`payment_method: ${paymentMethod} (${typeof paymentMethod})`);

    console.log("Invoice Status Update:");
    console.log(`total_amount: ${totalAmount} (${typeof totalAmount})`);
    console.log(`is_paid: true (${typeof true})`);

    console.log("Success Message:");
    console.log(
      `Message: "Payment created and invoice updated successfully" (${typeof "Payment created and invoice updated successfully"})`
    );
  };

  const consoleLogsInvoice = async () => {
    console.log("Services (Type and Value):");
    services.forEach((service, index) => {
      console.log(`Row ${index + 1}:`);
      console.log(`Type: Service`);
      console.log(`Value:`);
      console.log(
        `service_id: ${service.service_id} (${typeof service.service_id})`
      );
      console.log(
        `custom_service_name: ${
          service.custom_service_name
        } (${typeof service.custom_service_name})`
      );
      console.log(
        `custom_service_price: ${
          service.custom_service_price
        } (${typeof service.custom_service_price})`
      );
      console.log(`quantity: ${service.quantity} (${typeof service.quantity})`);
      console.log(`price: ${service.price} (${typeof service.price})`);
    });

    console.log("Selected Employee:");
    console.log(`Type: ${selectedEmployee ? "Employee" : "null"}`);
    console.log(`Value: ${selectedEmployee}`);
    console.log(
      `employee_id: ${
        selectedEmployee?.employee_id
      } (${typeof selectedEmployee?.employee_id})`
    );

    console.log("Vehicle ID:");
    console.log(`Type: ${vehicleId ? "number" : "null"}`);
    console.log(`Value: ${vehicleId} (${typeof vehicleId})`);

    console.log("Customer ID:");
    console.log(`Type: ${customerId ? "number" : "null"}`);
    console.log(`Value: ${customerId} (${typeof customerId})`);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open("", "", "width=800,height=600");
      newWindow?.document.write(`
        <html>
          <head>
            <title>Invoice Print</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              table, th, td { border: 1px solid black; }
              th, td { padding: 10px; text-align: left; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <h1>Invoice Management</h1>
      <Grid container spacing={2}>
        {/* CustomerForm */}
        <Grid item xs={12} md={8}>
          <CustomerForm
            customerId={customerId?.toString()}
            onClose={() => {}}
            onCustomerSelect={handleCustomerSelect}
            onVehicleSelect={handleVehicleSelect}
          />
        </Grid>

        {/* EmployeeForm */}
        <Grid item xs={12} md={4}>
          <EmployeeForm
            employeeId={selectedEmployee?.employee_id?.toString()}
            onClose={() => {}}
            onDataChange={handleEmployeeSelect}
          />
        </Grid>

        {/* ServiceTable */}
        <Grid item xs={12}>
          <ServiceTable onServiceChange={handleServiceChange} />
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateInvoice}
            sx={{ mr: 3 }}
            disabled={
              !customerId ||
              !vehicleId ||
              invoiceMade ||
              !selectedEmployee ||
              services.length === 0
            }
          >
            Create Invoice
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={consoleLogsInvoice}
            disabled={
              !customerId ||
              !vehicleId ||
              !invoiceId ||
              !selectedEmployee ||
              services.length === 0
            }
          >
            Console Logs Create Invoice
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreatePayment}
            sx={{ mr: 3 }}
            disabled={!invoiceId || paymentMade}
          >
            Create Payment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={consoleLogsPayment}
            sx={{ mr: 3 }}
            disabled={!invoiceId || !paymentId}
          >
            Console Logs Payment
          </Button>
        </Grid>

        {/* Print Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            sx={{ mt: 3 }}
          >
            Print Invoice
          </Button>
        </Grid>
      </Grid>

      {/* Printable Content */}
      <div style={{ display: "none" }} ref={printRef}>
        <h2>Invoice Details</h2>
        <p>
          <strong>Customer ID:</strong> {customerId}
        </p>
        <p>
          <strong>Vehicle ID:</strong> {vehicleId}
        </p>
        <p>
          <strong>Employee:</strong> {selectedEmployee?.employee_id}
        </p>

        <h3>Services</h3>
        <table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>
                  {service.custom_service_name ||
                    `Service ${service.service_id}`}
                </td>
                <td>{service.quantity}</td>
                <td>{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total Amount</h3>
        <p>
          {services.reduce(
            (acc, service) => acc + (service.price ?? 0) * service.quantity,
            0
          )}
        </p>
      </div>
    </Box>
  );
};

export default InvoicePage;
