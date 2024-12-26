// StockStatusButton.js
import React from 'react';
import PropTypes from 'prop-types';

const StatusButton = ({ stockStatus }) => {
    const isInStock = stockStatus === 'In Stock';

    const buttonStyles = {
        backgroundColor: isInStock ? '#1A932E2E' : '#FF161647',
        color: isInStock ? '#1A932E' : '#FF1616',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <span style={buttonStyles}>
            {isInStock ? 'In Stock' : 'No Stock'}
        </span>
    );
};

StatusButton.propTypes = {
    stockStatus: PropTypes.oneOf(['In Stock', 'No Stock']).isRequired,
};

export default StatusButton;
