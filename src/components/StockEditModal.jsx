import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const StockEditModal = ({
    stockId,
    currentCompanyId,
    currentProductId,
    currentMeasurement,
    currentPrice,
    currentQuantity,
    currentImage,
    closeModal,
}) => {
    const [companies, setCompanies] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(currentCompanyId);
    const [selectedProductId, setSelectedProductId] = useState(currentProductId);
    const [newMeasurement, setNewMeasurement] = useState(currentMeasurement);
    const [newPrice, setNewPrice] = useState(currentPrice);
    const [newQuantity, setNewQuantity] = useState(currentQuantity);
    const [newImage, setNewImage] = useState(currentImage);
    const [previewImage, setPreviewImage] = useState(currentImage);



    // Fetch companies when the modal loads
    useEffect(() => {
        const fetchCompaniesData = async () => {
            try {
                const data = await invoke("get_all_companies");
                const activeCompanies = data.data.filter(company => company.status === 'active');
                setCompanies(activeCompanies);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompaniesData();
    }, []);


    // Fetch products when a company is selected
    useEffect(() => {
        if (selectedCompanyId) {
            const fetchProductsData = async () => {
                try {
                    const fetchedProducts = await invoke('get_products_by_company', { companyId: selectedCompanyId });

                    // const fetchedProducts = await fetchProducts({ filterCompany: selectedCompanyId });
                    const activeProducts = fetchedProducts.data.filter(product => product.status === 'active');
                    setProducts(activeProducts);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            };

            fetchProductsData();
        }
    }, [selectedCompanyId]);

    const handleCompanyChange = (event) => {
        const companyId = event.target.value;
        setSelectedCompanyId(parseInt(companyId));
        setSelectedProductId(''); 
        setProducts([]);
    };

    const handleProductChange = (event) => {
        const productId = event.target.value;
        setSelectedProductId(productId);

        // Auto-fill measurement based on the selected product
        const selectedProduct = products.find(product => product.id === productId);
        if (selectedProduct) {
            setNewMeasurement(selectedProduct.measurement);
        }


    };



    const handleSave = async () => {
        try {

            const updatedData = {
                id: stockId,
                company: selectedCompanyId,
                product: selectedProductId,
                measurement: newMeasurement,
                price: parseFloat(newPrice),
                quantity: parseInt(newQuantity),
            };

            if (newImage instanceof File) {
                updatedData.image = newImage; 
            } else if (newImage) {
                updatedData.image = newImage; 
            }
    
            // if (newImage instanceof File) {
            //     updatedData.image = newImage; 
            // }
            await invoke ('update_stock', { id:stockId, update: updatedData,} )
    
            alert('Stock details updated successfully!');
            closeModal();
        } catch (error) {
            console.error('Error updating stock details:', error);
            alert('There was an error updating the stock details.');
        }
    };




    const handleImageChange = async (file) => {
        if (file && file.type.startsWith("image/")) {  // Check if it's an image
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result.split(',')[1];  // Remove the data URL part
                setNewImage(base64Image);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('Please select a valid image file.');
        }
        return false;
    };
    
    

  
    return (
        <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
                <h2>Edit Stock Details</h2>

                {/* Company Selection */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Company</label>
                    <select
                        value={selectedCompanyId}
                        onChange={handleCompanyChange}
                        style={inputStyle}
                    >
                        <option value="" disabled>Select Company</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Selection */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Product</label>
                    <select
                        value={selectedProductId}
                        onChange={handleProductChange}
                        style={inputStyle}
                        disabled={!selectedCompanyId} // Disable if no company is selected
                    >
                        <option value="" disabled>Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Measurement */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Measurement</label>
                    <input
                        type="text"
                        value={newMeasurement}
                        readOnly
                        style={inputStyle}
                    />
                </div>

                {/* Price */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Price</label>
                    <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Quantity */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Quantity</label>
                    <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        style={inputStyle}
                    />
                </div>


    


                {/* Image */}
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files[0])} 
                        style={inputStyle}
                    />
                </div>

                {/* Buttons */}
                <div style={buttonContainerStyle}>
                    <button onClick={handleSave} style={buttonStyle}>
                        Save
                    </button>
                    <button onClick={closeModal} style={cancelButtonStyle}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};




// Styles for the modal
const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
};

const formGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
};

const cancelButtonStyle = {
    backgroundColor: '#FF1616',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
};


export default StockEditModal;
