const express = require('express');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRATE,
});

function processBase64Image(base64Data,type) {
    return new Promise((resolve, reject) => {
        if (!base64Data) {
            reject(new Error('Base64 data is required'));
            return;
        }

    
        if (!fs.existsSync('../uplodes/')) {
            // Create the directory
            fs.mkdir('../uplodes/', { recursive: true }, (err) => {
                if (err) {
                    console.error('Error creating directory:', err);
                } else {
                    console.log('Directory created successfully');
                }
            });
        // Create a unique filename with the correct extension
        const fileName = Date.now() + '.' + type;
        const filePath = path.join(__dirname, '../uplodes/', fileName);

        // Extract the pure base64 data without MIME type and header
        const pureBase64Data = base64Data.split(';base64,').pop();

        // Write base64 data to a local file
        fs.writeFile(filePath, pureBase64Data, 'base64', (err) => {
            if (err) {
                reject(new Error('Error writing file: ' + err.message));
                return;
            }

            // Resolve with file path and name
            resolve({ filePath, fileName });
        });
    });
}


function uploadFileAndCleanUp(filePath, folder = 'uploads') {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { folder: folder }, (err, result) => {
            if (err) {
                reject(new Error('Error uploading to Cloudinary: ' + err.message));
                return;
            }

            // Remove local file after successful upload
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    reject(new Error('Error deleting file: ' + unlinkErr.message));
                    return;
                }

                console.log('File deleted successfully');
                resolve(result.secure_url);
            });
        })
    })
}

module.exports = { processBase64Image,uploadFileAndCleanUp  };

