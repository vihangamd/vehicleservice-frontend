// // src/pages/CustomerPage.tsx
// import React from "react";
// import CustomerForm from "../components/CustomerForm";

// const CustomerPage: React.FC<{ id?: string }> = ({ id }) => {
//   const handleSuccess = () => {
//     // Handle success logic, e.g., redirect or show a notification
//     console.log("Customer successfully saved!");
//   };

//   return (
//     <div>
//       <h1>{id ? "Edit Customer" : "Add Customer"}</h1>
//       <CustomerForm customerId={id} onClose={handleSuccess} />
//     </div>
//   );
// };

// export default CustomerPage;

// import React from "react";
// import CustomerForm from "../components/CustomerForm";

// const CustomerPage: React.FC = () => {
//   const [id, setId] = React.useState<string | undefined>(undefined);
//   const [dialogOpen, setDialogOpen] = React.useState(false);

//   const handleSuccess = () => {
//     setDialogOpen(false);
//     // Add any additional success handling logic here
//   };

//   return (
//     <div>
//       <h1>{id ? "Edit Customer" : "Add Customer"}</h1>
//       <CustomerForm customerId={id} onClose={handleSuccess} />
//     </div>
//   );
// };

// export default CustomerPage;

import React from "react";

export {};
