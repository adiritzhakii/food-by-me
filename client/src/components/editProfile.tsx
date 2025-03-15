import { Box, TextField, Button, Switch } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile, setUserData } from '../store/authSlice';
import { RootState } from '../store/store';
import axios from 'axios'
import {SERVER_ADDR, SERVER_PORT} from '../../const'


interface EditProfileProps {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditProfile = ({setIsEditing}: EditProfileProps) => {
    const [file, setFile] = useState<File | undefined>(undefined) 
    const { userData, provider,token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch()
    const [updatedUser, setUpdatedUser] = useState<UserProfile>(userData ? userData : {email: '', name: '', avatar: ''});
    const handleChange = (field: keyof UserProfile, value: string) => {
        if (updatedUser) {
          setUpdatedUser({ ...updatedUser, [field]: value });
        }
      };
      const handleSaveClick = async () => {
        try {
            if(updatedUser.name){
              const res = await axios.post(`http://${SERVER_ADDR}:${SERVER_PORT}/auth/editProfile?provider=${provider}`, {name: updatedUser.name}, {
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              });
            dispatch(setUserData({ ...userData, name: updatedUser.name } as UserProfile))

            }
            if(file){
              const formData = new FormData();
              formData.append("image", file as File);
              const response = await axios.post(`http://${SERVER_ADDR}:${SERVER_PORT}/auth/setAvatar?provider=${provider}`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
              });
              if(updatedUser.name){
                dispatch(setUserData({...userData, avatar: response.data.avatar, name: updatedUser.name } as UserProfile))
              }else{
                dispatch(setUserData({...userData, avatar: response.data.avatar} as UserProfile))
              }

            }
        } catch (error: any) {
            alert(`Upload failed: ${error.response?.data?.message || error.message}`);
        }
        setIsEditing(false);
      };

      const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileToUpload = event.target.files?.[0];
        if(fileToUpload){
            setFile(fileToUpload)
        }
      };
    return (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            width: '33%',
            mx: 'auto',
            mt: 4,
            p: 4,
            boxShadow: 3,
          }}
        >
          <TextField
            label="Name"
            value={updatedUser?.name || userData?.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'black' } }}
            InputProps={{ style: { color: 'black' } }}
          />

          {/* Avatar URL and Upload Section with Switch */}
          <Box display="flex" alignItems="center" gap={2}>            

            {/* Upload Button */}
            <Button
              variant="outlined"
              component="label"
              sx={{ marginTop: '8px' }}
              // disabled={!isUploadEnabled}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
          </Box>

          {/* Save and Cancel Buttons */}
          <Button
            variant="contained"
            onClick={handleSaveClick}
            sx={{ mt: 2, marginRight: 2 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
    )
}