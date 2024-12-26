// src/components/StatusButton.js

import React from 'react';
import PropTypes from 'prop-types';

const StatusButton = ({ status }) => {
    const isActive = status === 'Active';

    const buttonStyles = {
        backgroundColor: isActive ? '#1A932E2E' : '#FF161647',
        color: isActive ? '#1A932E' : '#FFFFFF',
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
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
};

StatusButton.propTypes = {
    status: PropTypes.oneOf(['Active', 'Inactive']).isRequired,
};

export default StatusButton;
