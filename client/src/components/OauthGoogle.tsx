import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { setCookie } from '../utils/cookie';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { SERVER_API, SERVER_PORT } from '../consts';

interface oauthGoogleProps {
  route: 'login' | 'register';
  onError: (error: string) => void;
}

const Cid = '42798047072-2992si37nemq8m9io7ogb0ad92op8kli.apps.googleusercontent.com';

function OauthGoogle({ route, onError }: oauthGoogleProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (route === 'login') {
      try {
        const res = await fetch(`https://${SERVER_API}:${SERVER_PORT}/api/auth/oauth-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json();
        if (data.user) {
          setCookie({ provider: "Google", token: data.accessToken, refreshToken: data.refreshToken, userId: data._id }, 'user');
          dispatch(login({ token: data.accessToken, refreshToken: data.refreshToken, provider: "Google", userId: data._id }));
          navigate('/home');
        } else {
          throw new Error('User not registered');
        }
      } catch (error) {
        console.log(error);
        onError('User not registered. Please register first.');
      }
    } else if (route === 'register') {
      try {
        const res = await fetch(`https://${SERVER_API}:${SERVER_PORT}/api/auth/oauth-register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json();
        navigate('/login');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleError = () => {
    console.error("Login failed");
    onError('Login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={Cid}>
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