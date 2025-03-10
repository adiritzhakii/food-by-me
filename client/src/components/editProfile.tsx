import { Box, TextField, Button, Switch } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfile, setUserData } from '../store/authSlice';
import { RootState } from '../store/store';
import { usePostAuthEditProfileMutation, ProviderSchema } from '../store/serverApi'
import axios from 'axios'

interface EditProfileProps {
    isEditing: boolean,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

function asyncSetTimeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const EditProfile = ({isEditing, setIsEditing}: EditProfileProps) => {
    const [isUploadEnabled, setIsUploadEnabled] = useState<boolean>(false)
    const [file, setFile] = useState<File | undefined>(undefined) 
    const [editProfile , {data}]  = usePostAuthEditProfileMutation();
    const { userData, provider,token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch()
    const [updatedUser, setUpdatedUser] = useState<UserProfile>(userData ? userData : {email: '', name: '', avatar: ''});
    const handleChange = (field: keyof UserProfile, value: string) => {
        if (updatedUser) {
          setUpdatedUser({ ...updatedUser, [field]: value });
        }
      };
      const handleSaveClick = async () => {
        if (updatedUser.name && file){
            editProfile({provider: provider as ProviderSchema, body: {name: updatedUser.name}})
            const formData = new FormData();
            formData.append("image", file as File);
            try {
                const response = await axios.post(`http://localhost:3000/auth/setAvatar?provider=${provider}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
                });
                dispatch(setUserData({name: updatedUser.name, avatar: response.data.avatar, email: userData?.email } as UserProfile))
            } catch (error: any) {
                alert(`Upload failed: ${error.response?.data?.message || error.message}`);
            }

        }
        if(updatedUser.name && updatedUser.avatar && !isUploadEnabled){
            dispatch(setUserData({name: updatedUser.name, avatar: updatedUser.avatar, email: userData?.email } as UserProfile))
            editProfile({provider: provider as ProviderSchema, body: {name: updatedUser.name, avatar: updatedUser.avatar}})
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
            {/* Avatar URL */}
            <TextField
              label="Avatar URL"
              value={updatedUser?.avatar || userData?.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black' } }}
              disabled={isUploadEnabled} // Disable when upload is enabled
            />

            {/* Toggle Switch */}
            <Switch
              checked={isUploadEnabled}
              onChange={(e) => setIsUploadEnabled(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase': {
                  color: '#1E90FF', // Blue when unchecked
                },
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1E90FF', // Blue when checked
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#1E90FF', // Blue track
                },
              }}
            />

            {/* Upload Button */}
            <Button
              variant="outlined"
              component="label"
              sx={{ marginTop: '8px' }}
              disabled={!isUploadEnabled} // Disable when URL is enabled
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