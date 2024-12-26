import React, { useState } from 'react';

const Pagination = ({ totalPages = 11, initialPage = 1, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (onPageChange) onPageChange(page);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={navButtonStyle}
            >
                &lt;
            </button>

            {/* Page Number Circles */}
            {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                            ...pageButtonStyle,
                            backgroundColor: currentPage === page ? '#FFBF00' : '#fff',
                            color: currentPage === page ? '#fff' : '#000',
                        }}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={navButtonStyle}
            >
                &gt;
            </button>
        </div>
    );
};

// Styles
const pageButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    cursor: 'pointer',
};

const navButtonStyle = {
    ...pageButtonStyle,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '16px',
    color: '#000',
    cursor: 'pointer',
};

export default Pagination;
