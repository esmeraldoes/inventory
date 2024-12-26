
import React from 'react';

const Card = ({ heading, subtitle, icon }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ECECEC',
            width: '220px'     
        }}>
            {/* Text Section */}
            <div>
                <h2 style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '24px', 
                    fontWeight: 800,
                    margin: 0
                }}>{heading}</h2>

                <p style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: '13px',  // Slightly smaller font size
                    fontWeight: 400,
                    lineHeight: '20px', // Reduced line height
                    margin: '5px 0 0'
                }}>{subtitle}</p>
            </div>

            {/* Icon Section */}
            <div style={{
                width: '40px', height: '40px', padding: '20px'  // Reduced icon size
            }}>
                {icon}
            </div>
        </div>
    );
};

export default Card;
