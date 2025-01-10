import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (credential: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      email: payload?.email,
      googleId: payload?.sub,
      name: payload?.name,
      avatar: payload?.picture,
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Invalid Google token');
  }
}