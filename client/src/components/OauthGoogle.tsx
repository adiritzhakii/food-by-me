
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

const Cid = '';

function OauthGoogle() {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    // Send the token to your backend server for verification
    

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