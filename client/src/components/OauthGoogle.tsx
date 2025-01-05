
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

function OauthGoogle() {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Credential Response:", credentialResponse);
    // Send the token to your backend server for verification
  };

  const handleError = () => {
    console.error("Login failed");
  };

  return (
    <GoogleOAuthProvider clientId="CLIENT_ID">
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