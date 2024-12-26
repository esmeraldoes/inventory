import React from 'react';

const LeanCard = ({ icon, text, iconBgColor }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ECECEC',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            height: '20px',
            width: '220px', // Adaptable width
            // width: 'fit-content', // Adaptable width
            marginRight: '10px'
        }}>
            {/* Icon Container */}
            <div style={{
                backgroundColor: iconBgColor || '#F2F7FF',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '30px',
                height: '30px',
                marginRight: '15px' // Spacing between icon and text
            }}>
                {icon}
            </div>

            {/* Text */}
            <span style={{
                fontFamily: 'Nunito',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
            }}>
                {text}
            </span>
        </div>
    );
};

export default LeanCard;
