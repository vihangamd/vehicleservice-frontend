import React, { useState, useEffect } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";

import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
} from "../services/customerService";
import {
  getVehiclesByCustomerId,
  createVehicle,
} from "../services/vehicleService";

interface CustomerOptionType {
  inputValue?: string;
  customer_id?: number;
  name: string;
  phone_number?: string;
  email?: string;
  address?: string;
}

interface VehicleOptionType {
  inputValue?: string;
  vehicle_id?: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CustomerForm: React.FC<{
  customerId?: string;
  onClose: () => void;
  onCustomerSelect: (id: number | null) => void;
  onVehicleSelect: (id: number | null) => void;
}> = ({ customerId, onClose, onCustomerSelect, onVehicleSelect }) => {
  const [customers, setCustomers] = useState<CustomerOptionType[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOptionType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const [vehicles, setVehicles] = useState<VehicleOptionType[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleOptionType | null>(null);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleFormData, setVehicleFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    color: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          const data = await getCustomerById(Number(customerId));
          setFormData({
            name: data.name,
            phone_number: data.phone_number || "",
            email: data.email || "",
            address: data.address || "",
          });
          if (data.customer_id) {
            const vehicleData = await getVehiclesByCustomerId(data.customer_id);
            setVehicles(vehicleData);
          }
        } catch (error) {
          console.error("Failed to fetch customer:", error);
        }
      };
      fetchCustomer();
    }
  }, [customerId]);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (selectedCustomer && selectedCustomer.customer_id) {
        try {
          const data = await getVehiclesByCustomerId(
            selectedCustomer.customer_id
          );
          setVehicles(data);
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      }
    };
    fetchVehicles();
  }, [selectedCustomer]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (customerId) {
        await updateCustomerById(Number(customerId), formData);
      } else {
        const newCustomer = await createCustomer(formData);
        onCustomerSelect(newCustomer.customer_id || null);
      }
      onClose();
    } catch (error) {
      console.error("Failed to submit customer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => setDialogOpen(false);

  const handleDialogSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      const newCustomer = await createCustomer(formData);
      setCustomers([...customers, newCustomer]);
      setSelectedCustomer(newCustomer);
      onCustomerSelect(newCustomer.customer_id || null);
      onClose();
    } catch (error) {
      console.error("Failed to submit new customer:", error);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleVehicleDialogOpen = () => setVehicleDialogOpen(true);

  const handleVehicleDialogClose = () => setVehicleDialogOpen(false);

  const handleVehicleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (selectedCustomer?.customer_id) {
        const newVehicle = await createVehicle({
          ...vehicleFormData,
          customer_id: selectedCustomer.customer_id,
          year: Number(vehicleFormData.year),
          mileage: Number(vehicleFormData.mileage),
        });
        setVehicles([...vehicles, newVehicle]);
        setVehicleFormData({
          make: "",
          model: "",
          year: "",
          mileage: "",
          color: "",
        });
        onVehicleSelect(newVehicle.vehicle_id || null);
        setVehicleDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to submit vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={selectedCustomer}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setDialogOpen(true);
                setSelectedCustomer({ name: newValue });
              } else if (newValue && newValue.inputValue) {
                setDialogOpen(true);
                setSelectedCustomer({ name: newValue.inputValue });
              } else {
                setSelectedCustomer(newValue);
                if (newValue) {
                  setFormData({
                    name: newValue.name,
                    phone_number: newValue.phone_number || "",
                    email: newValue.email || "",
                    address: newValue.address || "",
                  });
                  onCustomerSelect(newValue.customer_id || null);
                }
              }
            }}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) =>
                option.name
                  .toLowerCase()
                  .includes(params.inputValue.toLowerCase())
              );
              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }
              return filtered;
            }}
            options={customers}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Customer"
                variant="standard"
              />
            )}
          />
          {selectedCustomer && (
            <>
              <List sx={{ width: "100%", mt: 2 }}>
                <ListItem>
                  <ListItemText primary={`Name: ${formData.name}`} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary={`Phone: ${formData.phone_number}`} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary={`Email: ${formData.email}`} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText primary={`Address: ${formData.address}`} />
                </ListItem>
              </List>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            value={selectedVehicle}
            onChange={(event, newValue) => {
              setSelectedVehicle(newValue);
              onVehicleSelect(newValue?.vehicle_id || null);
            }}
            options={vehicles}
            getOptionLabel={(option) =>
              `${option.make} ${option.model} (${option.year})`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Vehicle"
                variant="standard"
              />
            )}
          />
          {selectedVehicle && (
            <List sx={{ width: "100%", mt: 2 }}>
              <ListItem>
                <ListItemText primary={`Make: ${selectedVehicle.make}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary={`Model: ${selectedVehicle.model}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary={`Year: ${selectedVehicle.year}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary={`Mileage: ${selectedVehicle.mileage}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary={`Color: ${selectedVehicle.color}`} />
              </ListItem>
            </List>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleVehicleDialogOpen}
            sx={{ mt: 2 }}
          >
            Add Vehicle
          </Button>
        </Grid>
      </Grid>

      {/* Customer Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {customerId ? "Edit Customer" : "Add Customer"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleDialogSubmit}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Phone Number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={loading}
                variant="contained"
                color="primary"
              >
                {customerId ? "Update" : "Add"}
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vehicle Dialog */}
      <Dialog open={vehicleDialogOpen} onClose={handleVehicleDialogClose}>
        <DialogTitle>Add Vehicle</DialogTitle>
        <DialogContent>
          <form onSubmit={handleVehicleSubmit}>
            <TextField
              label="Make"
              value={vehicleFormData.make}
              onChange={(e) =>
                setVehicleFormData({ ...vehicleFormData, make: e.target.value })
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Model"
              value={vehicleFormData.model}
              onChange={(e) =>
                setVehicleFormData({
                  ...vehicleFormData,
                  model: e.target.value,
                })
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Year"
              type="number"
              value={vehicleFormData.year}
              onChange={(e) =>
                setVehicleFormData({ ...vehicleFormData, year: e.target.value })
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Mileage"
              type="number"
              value={vehicleFormData.mileage}
              onChange={(e) =>
                setVehicleFormData({
                  ...vehicleFormData,
                  mileage: e.target.value,
                })
              }
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Color"
              value={vehicleFormData.color}
              onChange={(e) =>
                setVehicleFormData({
                  ...vehicleFormData,
                  color: e.target.value,
                })
              }
              fullWidth
              required
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleVehicleDialogClose} color="primary">
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={loading}
                variant="contained"
                color="primary"
              >
                Add Vehicle
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerForm;
