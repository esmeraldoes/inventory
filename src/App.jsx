// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddCompany from './components/AddCompany';
import AddProduct from './components/AddProduct';
import Billings from './components/Bills';
import Inventory from './components/Inventory';
import NewBill from './components/CreateBills';
import NewCase from './components/CreateCase';
import RealCase from './components/Case';
import Challan from './components/PrintBills';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import MemoBill from './components/PrintChallan';
import Notification from './components/Notification';


const App = () => {
    return (
       
      
        <Router>
        <AuthProvider>
            <Routes>
                

                {/* Public Routes */}
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/company" element={<AddCompany />} />
                    <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/invoice" element={<Billings />} />
                    <Route path="/new-bill" element={<NewBill />} />
                    <Route path="/notifications" element={<Notification />} />
                    <Route path="/new-case" element={<NewCase />} />
                    <Route path="/cash-received" element={<RealCase />} />
                    <Route path="/challan/:challanId" element={<Challan />} />
                    <Route path="/bill/:challanId" element={<MemoBill />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Route>
            </Routes>
        </AuthProvider>
    </Router>
    
    );
};

export default App;
