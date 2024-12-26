

import React, { useState, useContext, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import ActionMenu from './DropdownMenu';
// import { CompaniesContext } from './CompaniesContext';
import { invoke } from '@tauri-apps/api/core';

import ProductEditModal from '../components/ProductEditModal';




const ActionProductButton = ({ product, companies, onEdit, onDelete, onToggleStatus, openMenuId, setOpenMenuId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
       
        setOpenMenuId(openMenuId === product.id ? null : product.id); // Open or close menu
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setOpenMenuId(null); // Close menu when modal opens
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={toggleMenu}
                style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FFBF00',
                    borderRadius: '50%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <FaEllipsisV style={{ color: '#000', fontSize: '14px' }} />
            </button>
            {openMenuId === product.id && (

                <ActionMenu
                    company={product}
                    onEdit={openEditModal}
                    onDelete={onDelete}
                    onToggleStatus={() => onToggleStatus(product.id, product.status)}

                />
            )}

            {isModalOpen && (
                <ProductEditModal
                    productId={product.id}
                    currentProductName={product.name}
                    currentCompanyName={product.company_name}
                    currentMeasurement={product.measurement}
                    companies={companies}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ActionProductButton;











