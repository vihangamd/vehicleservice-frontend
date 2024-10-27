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
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
} from "../services/employeeService";

export interface EmployeeOptionType {
  inputValue?: string;
  employee_id?: number;
  name: string;
  position?: string;
  email?: string;
  phone_number?: string;
  address?: string;
}

interface EmployeeFormProps {
  employeeId?: string;
  onClose: () => void;
  onDataChange: (employee: EmployeeOptionType | null) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employeeId,
  onClose,
  onDataChange,
}) => {
  const [employees, setEmployees] = useState<EmployeeOptionType[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOptionType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employeeId) {
      const fetchEmployee = async () => {
        try {
          const data = await getEmployeeById(Number(employeeId));
          setFormData({
            name: data.name,
            position: data.position || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
          });
          setSelectedEmployee({
            employee_id: data.employee_id,
            name: data.name,
            position: data.position || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
          });
        } catch (error) {
          console.error("Failed to fetch employee:", error);
        }
      };
      fetchEmployee();
    }
  }, [employeeId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (employeeId) {
        await updateEmployeeById(Number(employeeId), formData);
      } else {
        const newEmployee = await createEmployee(formData);
        setEmployees([...employees, newEmployee]);
        onDataChange(newEmployee);
      }
      onClose();
    } catch (error) {
      console.error("Failed to submit employee:", error);
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
      const newEmployee = await createEmployee(formData);
      setEmployees([...employees, newEmployee]);
      setSelectedEmployee(newEmployee);
      onDataChange(newEmployee);
      onClose();
    } catch (error) {
      console.error("Failed to submit new employee:", error);
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handleEmployeeChange = (newValue: EmployeeOptionType | null) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      setFormData({
        name: newValue.name || "",
        position: newValue.position || "",
        email: newValue.email || "",
        phone_number: newValue.phone_number || "",
        address: newValue.address || "",
      });
    } else {
      setFormData({
        name: "",
        position: "",
        email: "",
        phone_number: "",
        address: "",
      });
    }
    onDataChange(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedEmployee}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setDialogOpen(true);
                handleEmployeeChange({ name: newValue });
              } else if (newValue && newValue.inputValue) {
                setDialogOpen(true);
                handleEmployeeChange({ name: newValue.inputValue });
              } else {
                handleEmployeeChange(newValue);
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
            options={employees}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Employee"
                variant="standard"
              />
            )}
          />
          {selectedEmployee && (
            <List sx={{ width: "100%", mt: 2 }}>
              <ListItem>
                <ListItemText primary={`Name: ${formData.name}`} />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary={`Position: ${formData.position}`} />
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
          )}
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {employeeId ? "Edit Employee" : "Add Employee"}
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
              label="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              fullWidth
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
                {employeeId ? "Update" : "Add"}
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeeForm;
