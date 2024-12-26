import React, { useState, useEffect, useCallback } from 'react';
import ActionProductButton from '../utils/ActionButtonProduct';
import Layout from './Layout';
import { FaSearch } from 'react-icons/fa';
import StatusButton from '../utils/StatusButton';
import Pagination from '../utils/Pagination';
import { menuItems, navbarButtons } from './navbarItems';
import { invoke } from "@tauri-apps/api/core";
import { listen } from '@tauri-apps/api/event';


const AddProduct = () => {
    const [activeItem, setActiveItem] = useState('Add Product');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [productName, setProductName] = useState('');
    const [productMeasurement, setProductMeasurement] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [notifications, setNotifications] = useState([]);

    
    const [openMenuId, setOpenMenuId] = useState(null); // Track the open menu ID

    const loadProducts = useCallback(async (page = 1, itemsPerPage = 10) => {
        try {
           
          const response = await invoke("get_all_products_with_companies", {   searchTerm,
            filterCompany,
            filterProduct,
            filterStatus,
            page,
            itemsPerPage });

            setProducts(response.data);
            setTotalPages(1);
            console.log("D NOTIFICATIONS: ", notifications)
            // setLoading(false);
          
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }, [searchTerm, filterCompany, filterProduct, filterStatus]);



    useEffect(() => {
        loadProducts();
    }, [loadProducts, searchTerm, filterCompany, filterProduct, filterStatus]);
    
    const loadCompanies = useCallback(async () => {
        try {
            const data = await invoke("get_all_companies");
            const activeCompanies = data.data.filter((company) => company.status === 'active');
            setCompanies(activeCompanies);
        } catch (error) {
            console.error('Failed to load companies:', error);
        }
    }, []);

      // Initial load of companies and products
      useEffect(() => {
        loadCompanies();
        
    }, [loadCompanies]);

  
    
 // Fetch products when page changes or filters are
 const handlePageChange = (page) => {
    loadProducts(page, 10); // Default 10 items per page
};

    
    const handleAddProduct = async (event) => {
        event.preventDefault();
        if (!productName.trim()) {
        alert("Product name cannot be empty.");
        return;
        }try {
            const companyId = parseInt(selectedCompany, 10);
        if (isNaN(companyId)) {
            throw new Error('Invalid company ID');
        }
            const newProduct = {
                name: productName,
                measurement: productMeasurement,
                company_id: companyId,
                status: 'active'
            };

            await invoke("create_product", { newProduct: newProduct });
            loadProducts(1, 10);

            const unlisten = listen('new_notification', (event) => {
                const { title, description } = event.payload;

                console.log("EVENT: ", event)
            
                // Add the new notification to the list
                setNotifications((prev) => [
                  ...prev,
                  { title, description, date: new Date().toLocaleString() },
                ]);
              });
              return () => {
                unlisten.then((fn) => fn()); // Clean up the listener
              };

        } catch (error) {
            console.error('Failed to add product:', error);
            alert(`Failed to add product: ${error}`);
        }
    };


    const handleDeleteProduct = async (productId) => {
        try {
            const result = await invoke('delete_product', { id: productId });

            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };
   


    const getCompanyNameById = async (companyId) => {
        try {
            // Call the Tauri command with the company ID
            const response = await invoke("get_company_by_id", { id: companyId });
            // Check if the backend responded successfully
            if (response.success) {
                return response.data.name; // Return the company name
            } else {
                console.error("Failed to fetch company:", response.error);
                return null;
            }
        } catch (error) {
            console.error("Error occurred while fetching company:", error);
            return null;
        }
    };

    const statusOptions = [
        'active',
        'inactive',
        'pending',
    ];

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // loadProducts();
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const result = await invoke('update_product', { id, update: { status: newStatus } });


            loadProducts();
        } catch (error) {
            console.error('Failed to update company status:', error);
        }
    };


    return (

        <Layout
        buttons={navbarButtons}
        menuItems={menuItems}
        activeItem={activeItem}
        onSelect={(label) => setActiveItem(label)}
      >
                        <div style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            marginLeft: '300px',
                            marginRight: '32px',
                        }}>
                            <h3 style={{
                                fontFamily: 'Nunito',
                                fontWeight: 700,
                                color: '#121212',
                                fontSize: '24px',
                                marginBottom: '20px',
                            }}>Select Company</h3>

                            <select
                                value={selectedCompany}
                                onChange={handleCompanyChange}
                                style={{
                                    width: '40%',
                                    padding: '10px',
                                    fontSize: '16px',
                                    color: '#666',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    outline: 'none',
                                    backgroundColor: '#fff',
                                    marginBottom: '1px',
                                }}
                            >
                                <option value="" disabled>Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>{company.name}</option> 
                                ))}
                                
                            </select>

                            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                                <div style={{ width: '40%' }}>
                                    <h4 style={{
                                        fontFamily: 'Nunito',
                                        fontWeight: 700,
                                        color: '#121212',
                                        fontSize: '18px',
                                        marginBottom: '10px',
                                    }}>Add New Product</h4>
                                    
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            fontSize: '16px',
                                            color: '#666',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                            marginBottom: '5px',
                                        }}
                                    />
                                </div>

                                {/* Product Measurement and Button */}
                                <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{
                                        fontFamily: 'Nunito',
                                        fontWeight: 700,
                                        color: '#121212',
                                        fontSize: '18px',
                                        marginBottom: '10px',
                                    }}>Product Measurement</h4>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter measurement"
                                            value={productMeasurement}
                                            onChange={(e) => setProductMeasurement(e.target.value)}
                                            style={{
                                                width: '50%',
                                                padding: '10px',
                                                fontSize: '16px',
                                                color: '#666',
                                                borderRadius: '8px',
                                                border: '1px solid #ccc',
                                                outline: 'none',
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                        <button onClick={handleAddProduct} style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: '#1E88E5',
                                            color: 'white',
                                            fontSize: '20px',
                                            borderRadius: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: 'none',
                                        }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Filter Section */}
                            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {/* Search Bar with Icon */}
                                <div style={{ position: 'relative', width: '40%' }}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        style={{
                                            width: '75%',
                                            padding: '10px 40px 10px 10px',  // Adding space for the icon
                                            fontSize: '16px',
                                            color: '#666',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            backgroundColor: '#e0e0e0', // Grey background color
                                        }}
                                    />
                                    <FaSearch
                                        style={{
                                            position: 'absolute',
                                            right: '1px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '20px',
                                            color: '#666',
                                            left: '280px',
                                        }}
                                    />
                                </div>

                                {/* Filter Dropdowns */}
                                <div style={{ display: 'flex', gap: '20px', width: '60%' }}>
                                    {/* Filter Company Dropdown */}
                                    <select
                                        value={filterCompany}
                                        onChange={(e) => setFilterCompany(e.target.value)}
                                        style={{
                                            width: '35%',
                                            padding: '10px',
                                            fontSize: '16px',
                                            color: '#666',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <option value="" disabled>- Filter Company -</option>
                                        <option value="">Clear</option> {/* Clear option */}

                                        {companies.map((company, index) => (
                                            <option key={company.id || index} value={company.id}>

                                          {company.name}</option>
                                        ))}
                                    </select>

                                    {/* Filter Product Dropdown */}
                                    <select
                                        value={filterProduct}
                                        onChange={(e) => setFilterProduct(e.target.value)}
                                        style={{
                                            width: '30%',
                                            padding: '10px',
                                            fontSize: '16px',
                                            color: '#666',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <option value="" disabled>- Filter Product -</option>
                                        <option value="">Clear</option> {/* Clear option */}

                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>

                                    {/* Filter Status Dropdown */}
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        style={{
                                            width: '30%',
                                            padding: '10px',
                                            fontSize: '16px',
                                            color: '#666',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <option value="" disabled>- Filter Status -</option>
                                        <option value="">Clear</option> {/* Clear option */}

                                        {statusOptions.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                borderSpacing: 0,
                            }}>
                                <thead style={{
                                    backgroundColor: '#1E88E5',
                                }}>
                                    <tr>
                                        <th style={{
                                            color: 'white',
                                            padding: '10px',
                                            width: '20%',
                                            textAlign: 'left',
                                        }}>Product Name</th>
                                        <th style={{
                                            color: 'white',
                                            padding: '10px',
                                            width: '20%',
                                            textAlign: 'left',
                                        }}>Company Name</th>
                                        <th style={{
                                            color: 'white',
                                            padding: '10px',
                                            width: '20%',
                                            textAlign: 'left',
                                        }}>Measurement (MM, KG, Ltr, Pics, etc)</th>
                                        <th style={{
                                            color: 'white',
                                            padding: '10px',
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>Status</th>
                                        <th style={{
                                            color: 'white',
                                            padding: '10px',
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                
                                    {products && products.length > 0 ? (
                                        products.map((product) => (
                                        <tr key={product.id} style={{
                                            borderBottom: '1px solid #ccc',
                                        }}>
                                            <td style={{
                                                padding: '10px',
                                                textAlign: 'left',
                                            }}>{product.name}</td>
                                            <td style={{
                                                padding: '10px',
                                                textAlign: 'left',
                                            }}>{product.company_name}</td>
                                            <td style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}>{product.measurement}</td>
                                            <td style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}>{<StatusButton status={product.status.charAt(0).toUpperCase() + product.status.slice(1)} /> }</td>

                                            <td style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}>
                                            <ActionProductButton 
                                            product={product}
                                            companies={companies}
                                            onEdit={(updated) => (product.id, product.status)}
                                            
                                            onDelete={() => handleDeleteProduct(product.id)} 
                                            onToggleStatus={(id, status) => toggleStatus(id=product.id, status)}

                                            openMenuId={openMenuId}
                                            setOpenMenuId={setOpenMenuId}

                                            />

                                    

                                            </td>
                                        </tr>
                                    ))):(<tr><td colSpan="3">No products available</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                         {/* Content and Pagination */}
                         <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '20px'
                        }}>
                            <Pagination
                             totalPages={totalPages} 
                             initialPage={1}
                            onPageChange={handlePageChange} />
                        </div>

                        </div>
        </Layout>
                    
       
    );
};

export default AddProduct;
