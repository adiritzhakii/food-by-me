
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface oauthGoogleProps {
  route: 'login' | 'register';
}

const Cid = '';

function OauthGoogle({route}: oauthGoogleProps) {

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    // Send the token to your backend server for verification
    if (route === 'login') {
      // Send the token to the login route
        try {
          const res = await fetch('http://localhost:3000/auth/oauth-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: credentialResponse.credential }),
          });
          const data = await res.json()
          console.log(data)
        } catch (error) {
          console.log(error)
        }

    } else if (route === 'register') {
      // Send the token to the register route
      try {
        const res = await fetch('http://localhost:3000/auth/oauth-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json()
        console.log(data)
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