import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const ProductEditModal = ({ productId, currentProductName,  currentCompanyName,  currentCompanyId, companies, currentMeasurement, closeModal }) => {
    const [newProductName, setNewProductName] = useState(currentProductName);
    const [selectedCompanyId, setSelectedCompanyId] = useState(
        companies.find((company) => company.name === currentCompanyName)?.id || ''
    );

    const [newMeasurement, setNewMeasurement] = useState(currentMeasurement);

    const handleProductNameChange = (event) => {
        setNewProductName(event.target.value);
    };

    const handleCompanyChange = (e) => {
        setSelectedCompanyId(e.target.value);
    };

    const handleMeasurementChange = (event) => {
        setNewMeasurement(event.target.value);
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                id: productId,
                name: newProductName,
                company_id: selectedCompanyId,
                measurement: newMeasurement,

            };
            

            await invoke ('update_product', { id:productId, update: updatedData,} )
            // await updateProduct(productId, updatedData)

            alert('Product details updated successfully!');
            closeModal(); 
        } catch (error) {
            console.error('Error updating product details:', error);
            alert('There was an error updating the product details.');
        }
    };

    return (
        <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
                <h2>Edit Product Details</h2>
                <div style={formGroupStyle}>
                    <label style={labelStyle}>Product Name</label>
                    <input
                        type="text"
                        value={newProductName}
                        onChange={handleProductNameChange}
                        style={inputStyle}
                    />
                </div>
                <div style={formGroupStyle}>



                <label style={labelStyle}>Company Name</label>
                <select value={selectedCompanyId} onChange={handleCompanyChange}>
                    <option value="" disabled>Select Company</option>
                    {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>



                </div>



                <div style={formGroupStyle}>
                    <label style={labelStyle}>Measurement</label>
                    <input
                        type="text"
                        value={newMeasurement}
                        onChange={handleMeasurementChange}
                        style={inputStyle}
                    />
                </div>
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

export default ProductEditModal;























