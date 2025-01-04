import React, { useState, useEffect } from 'react'
import { TextField, Button, Grid, Paper, Typography, Container, Box, InputAdornment } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import {usePostAuthLoginMutation} from '../store/serverApi';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();
  const [ serverLogin, {isError, isSuccess, error: serverError} ] = usePostAuthLoginMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }
    // Handle login logic here
    serverLogin({user: {email, password}})
  }
  
  useEffect(() => {
    if(isSuccess){
      alert('Logged in successfully!');
      navigate('/')
    }},[isSuccess]);
    
  useEffect(() => {
    if(isError){
      console.error("Registration failed: ", error);
    }
  },[isError,error])

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <img src="/food-by-me-icon.png" alt="App Icon" style={{ width: 70, height: 70, marginRight: 10 }} />
        </Box>
        <Typography variant="h5" component="h1" sx={{ marginTop: 2 }}>
          Sign In
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
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>
        <Grid container>
          <Grid item xs>
            <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    Don't have an account? Sign Up
                </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Login