import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllServices,
  createService,
  updateServiceById,
  deleteServiceById,
} from "../services/serviceService";

interface Service {
  service_id?: number;
  name: string;
  description: string;
  default_price: string;
  created_date?: string;
  updated_date?: string;
}

const ServiceAdmin = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    default_price: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const result = await getAllServices();
      setServices(result);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to fetch services");
      setSnackbarOpen(true);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setServiceId(service.service_id || null);
      setFormData({
        name: service.name,
        description: service.description,
        default_price: service.default_price,
      });
    } else {
      setServiceId(null);
      setFormData({
        name: "",
        description: "",
        default_price: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (serviceId) {
        await updateServiceById(serviceId, formData);
        setSnackbarMessage("Service updated successfully");
      } else {
        await createService(formData);
        setSnackbarMessage("Service created successfully");
      }
      setSnackbarSeverity("success");
      fetchServices();
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage("Failed to save service");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteServiceById(id);
      setSnackbarMessage("Service deleted successfully");
      setSnackbarSeverity("success");
      fetchServices();
    } catch (error) {
      setSnackbarMessage("Failed to delete service");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Create New Service
      </Button>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Default Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.service_id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.default_price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(service)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(service.service_id || 0)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {serviceId ? "Edit Service" : "Create New Service"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Service Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="default_price"
            label="Default Price"
            fullWidth
            type="number"
            value={formData.default_price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {serviceId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ServiceAdmin;
