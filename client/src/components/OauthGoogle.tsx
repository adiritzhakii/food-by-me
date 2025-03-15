
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { setCookie } from '../utils/cookie';
import { useDispatch, UseDispatch } from 'react-redux';
import { login } from '../store/authSlice';

interface oauthGoogleProps {
  route: 'login' | 'register';
}

const Cid = '42798047072-2992si37nemq8m9io7ogb0ad92op8kli.apps.googleusercontent.com';

function OauthGoogle({route}: oauthGoogleProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (route === 'login') {
        try {
          const res = await fetch('http://localhost:3000/auth/oauth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: credentialResponse.credential }),
          });
          const data = await res.json()
          setCookie({provider: "Google",token: data.accessToken, refreshToken: data.refreshToken, userId: data._id}, 'user');
          dispatch(login({token: data.accessToken, refreshToken: data.refreshToken, provider: "Google", userId: data._id}));
          navigate('/home')
          
        } catch (error) {
          console.log(error)
        }

    } else if (route === 'register') {
      try {
        const res = await fetch('http://localhost:3000/auth/oauth-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json()
        navigate('/login')
      } catch (error) {
        console.log(error)
      }
    }    
  };

  const handleError = () => {
    console.error("Login failed");
  };

  return (
    <GoogleOAuthProvider clientId = {Cid}>
      <div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default OauthGoogle;