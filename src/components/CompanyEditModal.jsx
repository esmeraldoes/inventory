import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";


const CompanyEditModal = ({ companyId, currentName, closeModal }) => {
    const [newName, setNewName] = useState(currentName);

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleSave = async () => {
        if (!newName.trim()) {
            alert("Company name cannot be empty.");
            return;
          }
        try {
            await invoke("update_company", {
                id: companyId,
                update: { name: newName, status: null },
            });
           
            alert('Company name updated successfully!');
            closeModal(); 
        } catch (error) {
            console.error('Error updating company name:', error);
            alert('There was an error updating the company name.');
        }
    };

    return (
        <div style={modalBackdropStyle}>
            <div style={modalContentStyle}>
                <h2>Edit Company Name</h2>
                <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    style={inputStyle}
                />
                <div style={buttonContainerStyle}>
                    <button onClick={handleSave} style={buttonStyle}>Save</button>
                    <button onClick={closeModal} style={cancelButtonStyle}>Cancel</button>
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
    width: '300px',
    textAlign: 'center',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
};

const cancelButtonStyle = {
    backgroundColor: '#FF1616',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
};

export default CompanyEditModal;
