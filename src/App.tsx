// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import DashboardLayout from './Pages/Dashboard/layout/DashboardLayout';
import FrontPage from './Pages/Homepage/Home';
import Product from './Pages/product/Product';
import AddProduct from './Pages/product/AddProduct';
import CompanyForm from './Pages/Company/Companymaster';
import Frontcard from './Pages/Dashboard/Frontcard';
import PrivateRoute from './components/auth/PublicRoute';
import PublicRoute from './components/auth/Privateroute';
import Payment from './Pages/Payment/Payment';
import Invoice from './Pages/invoice/invoice';
import Report from './Pages/Report/Report';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EditInvoice from './Pages/Report/EditInvoice';
import ViewOrderPage from './Pages/Report/Vieworderdetails';
import ManageProductsPage from './Pages/product/Manageproduct';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<DashboardLayout/>}>
         <Route path="/front" element={<ProtectedRoute><Frontcard /></ProtectedRoute>} />
         <Route path="/company" element={<CompanyForm />} />
        <Route path="/product" element={<Product />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/edit" element={<EditInvoice />} />
        <Route path="/vieworder" element={<ViewOrderPage />} />
        <Route path="/manageproducts" element={<ManageProductsPage />} />
        <Route path="/addproduct" element={<AddProduct />} />
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/Home"
          element={
            <PrivateRoute> <FrontPage /> </PrivateRoute>
          }
        />
        
        <Route path="/bill" element={<Invoice />} />
       
       
      
      </Routes>
    </Router>
  );
};

export default App;
