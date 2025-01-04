import React, { useEffect, useState } from 'react'
import { TextField, Button, Grid, Paper, Typography, Container, Box, InputAdornment } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { usePostAuthRegisterMutation } from '../store/serverApi'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();
  const [serverRegister, {error: errorFromServer, isError, isSuccess}] = usePostAuthRegisterMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    // Handle registration logic here
    serverRegister({user: {email, password}})

  }
  useEffect(() => {
    if(isSuccess){
      alert('Registered successfully!');
      navigate('/login')
    }},[isSuccess]);
    
  useEffect(() => {
    if(isError){
      console.error("Registration failed: ", error);
    }
  },[isError,error])

  return (
    <>
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>        
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <img src="/food-by-me-icon.png" alt="App Icon" style={{ width: 70, height: 70, marginRight: 10 }} />
        </Box>
        <Typography variant="h5" component="h1" sx={{ marginTop: 2 }}>
          Register
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-envelope" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-lock" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-lock" />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Register
          </Button>
        </Box>
        <Grid container>
          <Grid item xs>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Already have an account? Login
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </>
  )
}

export default Register