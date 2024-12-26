import React, { useState, useEffect } from 'react';


import { appDataDir } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/core';

const resolveImagePath = async (relativePath) => {
    try {
        // Get the app data directory where you can store images
        const appDataDirectory = await appDataDir();
        console.log("APP DATA: ", appDataDirectory)
        const imagePath = `${appDataDirectory}/images/${relativePath}`;
        const assetUrl = convertFileSrc(imagePath);
        console.log("Resolved Image Path:", assetUrl);
        return assetUrl;
    } catch (error) {
        console.error('Error resolving image path:', error);
        return null;
    }
};


// import { appDir } from '@tauri-apps/api/path';
// // import { convertFileSrc } from '@tauri-apps/api/core';

// const resolveImagePath = async (relativePath) => {
//     try {
//         const imageDir = await appDir();  // This gives you the app's data directory
//         const imagePath = `${imageDir}/images/${relativePath}`;
//         const assetUrl = convertFileSrc(imagePath);
//         console.log("Resolved Image Path:", assetUrl);
//         console.log("Image Dir", imageDir)
//         return assetUrl;
//     } catch (error) {
//         console.error('Error resolving image path:', error);
//         return null;
//     }
// };


// const resolveImagePath = async (relativePath) => {
//     try {
//         const assetUrl = convertFileSrc(relativePath);
//         console.log("Resolved Image Path:", assetUrl);
//         return assetUrl;
//     } catch (error) {
//         console.error('Error resolving image path:', error);
//         return null;
//     }
// };

const ImageDisplay = ({ relativePath }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const resolvedUrl = await resolveImagePath(relativePath);
            setImageUrl(resolvedUrl);
        };

        fetchImage();
    }, [relativePath]);

    if (!imageUrl) {
        return <div>Loading...</div>;
    }

    return (
        
        <div style={{ padding: '2px', textAlign: 'center' }}>
            <img
                src={imageUrl}
                alt="Product"
                style={{ maxWidth: '60px', maxHeight: '100px', borderRadius: '5px' }}
            />
        </div>
    );
};



export default ImageDisplay;
