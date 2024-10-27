import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { getAllServices } from "../services/serviceService";
import {
  getAllNonExpirableInventory,
  getAllExpirableInventory,
} from "../services/inventoryService";

interface ServiceFromAPI {
  service_id?: number;
  name: string;
  description: string;
  default_price: string;
}

interface InventoryItem {
  inventory_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  expiry_date?: string;
}

interface Service {
  service_id?: number;
  custom_service_name?: string;
  custom_service_price?: number;
  quantity: number;
  price: number;
}

interface ServiceTableProps {
  onServiceChange: (services: Service[]) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ onServiceChange }) => {
  const [allServices, setAllServices] = useState<ServiceFromAPI[]>([]);
  const [nonExpirableItems, setNonExpirableItems] = useState<InventoryItem[]>(
    []
  );
  const [expirableItems, setExpirableItems] = useState<InventoryItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedInventoryId, setSelectedInventoryId] = useState<number | "">(
    ""
  );
  const [serviceRows, setServiceRows] = useState<Service[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [customService, setCustomService] = useState<{
    name: string;
    price: string;
  }>({ name: "", price: "" });
  const [discount, setDiscount] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setAllServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    const fetchInventory = async () => {
      try {
        const nonExpirableData = await getAllNonExpirableInventory();
        const expirableData = await getAllExpirableInventory();

        const validNonExpirableData = nonExpirableData.filter(
          (item) => item.inventory_id !== undefined
        ) as InventoryItem[];
        const validExpirableData = expirableData.filter(
          (item) => item.inventory_id !== undefined
        ) as InventoryItem[];

        setNonExpirableItems(validNonExpirableData);
        setExpirableItems(validExpirableData);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      }
    };

    fetchServices();
    fetchInventory();
  }, []);

  useEffect(() => {
    const newTotal = serviceRows.reduce(
      (acc, row) => acc + row.price * row.quantity,
      0
    );
    setTotal(newTotal);
    onServiceChange(serviceRows);
  }, [serviceRows, onServiceChange]);

  const handleServiceSelect = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    if (value !== "") {
      const selectedService = allServices.find(
        (service) => service.service_id === value
      );
      if (selectedService) {
        setServiceRows([
          ...serviceRows,
          {
            service_id: selectedService.service_id,
            custom_service_name: undefined,
            custom_service_price: undefined,
            quantity: 1,
            price: parseFloat(selectedService.default_price) || 0,
          },
        ]);
        setSelectedServiceId("");
      }
    }
  };

  const handleInventorySelect = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    if (value !== "") {
      const selectedInventory = [...nonExpirableItems, ...expirableItems].find(
        (item) => item.inventory_id === value
      );
      if (selectedInventory) {
        if (
          selectedInventory.quantity > 0 &&
          (!selectedInventory.expiry_date ||
            new Date(selectedInventory.expiry_date) > new Date())
        ) {
          setServiceRows([
            ...serviceRows,
            {
              service_id: undefined,
              custom_service_name: selectedInventory.name,
              custom_service_price: selectedInventory.unit_price,
              quantity: 1,
              //price: selectedInventory.unit_price,
              price: parseFloat(selectedInventory.unit_price.toString()) || 0,
            },
          ]);
        } else {
          console.error("Cannot add expired or out-of-stock items.");
        }
        setSelectedInventoryId("");
      }
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedRows = [...serviceRows];
    updatedRows[index].quantity = quantity;
    setServiceRows(updatedRows);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = serviceRows.filter((_, i) => i !== index);
    setServiceRows(updatedRows);
  };

  const handleCustomServiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setCustomService({ ...customService, [name]: value });
  };

  const handleAddCustomService = () => {
    if (customService.name && customService.price) {
      setServiceRows([
        ...serviceRows,
        {
          service_id: undefined,
          custom_service_name: customService.name,
          custom_service_price: parseFloat(customService.price),
          quantity: 1,
          price: parseFloat(customService.price),
        },
      ]);
      setCustomService({ name: "", price: "" });
    } else {
      console.error("Custom service name and price cannot be empty.");
    }
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (parseFloat(value) <= total) {
      setDiscount(value);
    } else {
      console.error("Discount cannot exceed the total amount.");
    }
  };

  const discountedTotal = total - (parseFloat(discount) || 0);

  return (
    <Box>
      <Select
        value={selectedServiceId}
        onChange={handleServiceSelect}
        displayEmpty
      >
        <MenuItem value="">Select a Service</MenuItem>
        {allServices.map((service) => (
          <MenuItem key={service.service_id} value={service.service_id}>
            {service.name}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={selectedInventoryId}
        onChange={handleInventorySelect}
        displayEmpty
      >
        <MenuItem value="">Select an Inventory Item</MenuItem>
        {[...nonExpirableItems, ...expirableItems].map((item) => (
          <MenuItem key={item.inventory_id} value={item.inventory_id}>
            {item.name} - {item.quantity} in stock
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  {row.custom_service_name ||
                    allServices.find(
                      (service) => service.service_id === row.service_id
                    )?.name ||
                    "N/A"}
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    size="small"
                    inputProps={{ min: 1 }}
                  />
                </TableCell>
                {/* <TableCell>{row.price.toFixed(2)}</TableCell> */}
                <TableCell>{Number(row.price).toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteRow(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>
                <TextField
                  label="Custom Service Name"
                  name="name"
                  value={customService.name}
                  onChange={handleCustomServiceChange}
                  size="small"
                />
                <TextField
                  label="Custom Service Price"
                  name="price"
                  value={customService.price}
                  onChange={handleCustomServiceChange}
                  size="small"
                />
              </TableCell>
              <TableCell colSpan={2}>
                <Button onClick={handleAddCustomService}>Add Custom</Button>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell colSpan={2}>{total.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <TextField
                  label="Discount"
                  value={discount}
                  onChange={handleDiscountChange}
                  size="small"
                  type="number"
                />
              </TableCell>
              <TableCell colSpan={2}>
                Total After Discount: {discountedTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ServiceTable;
