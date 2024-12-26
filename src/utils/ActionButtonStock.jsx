import React, { useState, useContext } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import StockActionMenu from './Dropdown';
import StockEditModal from '../components/StockEditModal';

const ActionStockButton = ({
    stock,
    onEdit,
    onDelete,
    onToggleStatus,
    openMenuId,
    setOpenMenuId,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMenu = () => {
        setOpenMenuId(openMenuId === stock.id ? null : stock.id); // Open or close menu
    };

    const openEditModal = () => {
        setIsModalOpen(true);
        setOpenMenuId(null); // Close the dropdown menu when modal opens
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Button to toggle menu */}
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

            {/* Dropdown menu */}
            {openMenuId === stock.id && (
                <StockActionMenu
                stock={stock}
                onEdit={openEditModal}
                onDelete={onDelete}
                onToggleStatus={() => onToggleStatus(stock.id, stock.status)}

                />               
            )}

            {/* Modal for editing stock */}
            {isModalOpen && (
                <StockEditModal
                    stockId={stock.id}
                    currentCompanyId={stock.company_id}
                    currentProductId={stock.product_id}
                    currentMeasurement={stock.measurement}
                    currentPrice={stock.price}
                    currentQuantity={stock.quantity}
                    currentImage={stock.image}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default ActionStockButton;
