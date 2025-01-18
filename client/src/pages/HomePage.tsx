import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Posts from '../components/PostBox';
import { RootState } from '../store/store';
import axios from 'axios';



const HomePage = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const {token} = useSelector((state: RootState) => state.auth)

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image to upload!");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await axios.post('http://localhost:3000/auth/setAvatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            });
            alert(`Upload successful: ${response.data.message}`);
        } catch (error: any) {
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <h2>Image Upload</h2>

            {/* File input */}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: '10px 0' }} />

            {/* Preview the selected image */}
            {preview && (
                <div style={{ marginBottom: '10px' }}>
                    <h4>Image Preview:</h4>
                    <img src={preview} alt="Selected" style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }} />
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedImage}
                style={{
                    padding: '10px 20px',
                    backgroundColor: selectedImage ? '#007bff' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: selectedImage ? 'pointer' : 'not-allowed',
                }}
            >
                Upload Image
            </button>
        </div>
    );
    
    // return (
    // <>
    //     <h1> Feed </h1>
    //     <Posts />
        
    // </>
    // )

}

export default HomePage;