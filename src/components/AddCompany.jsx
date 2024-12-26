// src/pages/AddCompany.js

import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FaPlus } from "react-icons/fa";
import StatusButton from "../utils/StatusButton";
import ActionButton from "../utils/ActionButton";
import Pagination from "../utils/Pagination";
import Layout from "./Layout";
import { DashboardIcon, CompanyIcon, ProductIcon, CashIcon, InvoiceIcon, StocksIcon, NotificationIcon } from "../utils/Icons";

const AddCompany = () => {
  const [activeItem, setActiveItem] = useState("Add Company");
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Track the open menu ID

  useEffect(() => {
    loadCompanies(currentPage);
  }, [currentPage]);

  const loadCompanies = async (page = 1) => {
    try {
      const data = await invoke("get_all_companies");
      setCompanies(data.data); 
      setTotalPages(Math.ceil(data.data.length / 10));
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
  };

  const handleAddCompany = async (event) => {
    event.preventDefault();
    if (!companyName.trim()) {
      alert("Company name cannot be empty.");
      return;
    }
    try {
      await invoke("create_company", { newCompany: { name: companyName } });
      setCompanyName("");
      loadCompanies();
    } catch (error) {
      console.error("Failed to add company:", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await invoke("update_company", { id, update: { status: newStatus } });
      loadCompanies();
    } catch (error) {
      console.error("Failed to update company status:", error);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      await invoke("delete_company", { id });
      loadCompanies();
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Add Company", icon: <CompanyIcon />, path: "/company" },
    { label: "Add Product", icon: <ProductIcon />, path: "/addproduct" },
    { label: "Cash Received", icon: <CashIcon />, path: "/cash-received" },
    { label: "Invoice", icon: <InvoiceIcon />, path: "/invoice" },
    { label: "Stocks and Inventory", icon: <StocksIcon />, path: "/inventory" },
    { label: "Notifications", icon: <NotificationIcon />, path: "/notifications" },
  ];

  const navbarButtons = [
    { label: "New Bill", icon: <FaPlus />, path: "/new-bill" },
    { label: "Cash Bill", icon: <FaPlus />, path: "/cash-bill" },
  ];

  return (
    <Layout
      buttons={navbarButtons}
      menuItems={menuItems}
      activeItem={activeItem}
      onSelect={(label) => setActiveItem(label)}
    >
      <div style={{ backgroundColor: "white", padding: "15px", marginLeft: "300px", marginRight: "32px" }}>
        <hr style={{ borderTop: "1px solid #e0e0e0", marginBottom: "20px" }} />
        <h3 style={{ fontFamily: "Nunito", fontWeight: 700, color: "#121212", fontSize: "24px", marginBottom: "20px" }}>
          Add New Company
        </h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            value={companyName}
            placeholder="Enter company name"
            onChange={(e) => setCompanyName(e.target.value)}
            style={{ width: "281px", height: "50px", borderRadius: "8px", paddingLeft: "10px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleAddCompany}
            style={{
              backgroundColor: "#1E88E5",
              color: "white",
              borderRadius: "8px",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaPlus /> Add
          </button>
        </div>
        <div style={{ marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", borderSpacing: 0 }}>
            <thead style={{ backgroundColor: "#1E88E5" }}>
              <tr>
                <th style={{ color: "white", padding: "10px", width: "55%", textAlign: "left" }}>Company Name</th>
                <th style={{ color: "white", padding: "10px", width: "22.5%", textAlign: "center" }}>Status</th>
                <th style={{ color: "white", padding: "10px", width: "22.5%", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: "10px", textAlign: "left" }}>{company.name}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <StatusButton status={company.status.charAt(0).toUpperCase() + company.status.slice(1)} />
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <ActionButton
                        company={company}
                        onEdit={(updated) => (company.id, company.status)}
                        onDelete={() => handleDeleteCompany(company.id)}
                        onToggleStatus={(id, status) => toggleStatus(id=company.id, status)}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No companies available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </Layout>
  );
};

export default AddCompany;