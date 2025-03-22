import { verifyGoogleToken } from '../utils/verifyGoogleToken';
import { OAuth2Client } from 'google-auth-library';

// Mock the Google OAuth2Client
jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn();
  const mockGetPayload = jest.fn();
  
  const MockOAuth2Client = jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken.mockReturnValue({
      getPayload: mockGetPayload
    })
  }));
  
  return {
    OAuth2Client: MockOAuth2Client
  };
});

describe('Google Token Verification', () => {
  const mockOAuth2Client = new OAuth2Client();
  const mockVerifyIdToken = mockOAuth2Client.verifyIdToken as jest.Mock;
  const mockGetPayload = mockVerifyIdToken().getPayload as jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('Should successfully verify a valid token', async () => {
    mockGetPayload.mockReturnValue({
      email: 'test@example.com',
      sub: 'google123',
      name: 'Test User',
      picture: 'https://example.com/pic.jpg'
    });
    
    const result = await verifyGoogleToken('valid_token');
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: 'valid_token',
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    expect(result).toEqual({
      email: 'test@example.com',
      googleId: 'google123',
      name: 'Test User',
      avatar: 'https://example.com/pic.jpg'
    });
  });
  
  test('Should throw error for invalid token', async () => {
    mockVerifyIdToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    await expect(verifyGoogleToken('invalid_token')).rejects.toThrow('Invalid Google token');
  });
  
  test('Should handle missing payload fields', async () => {
    mockVerifyIdToken.mockReturnValue({
      getPayload: jest.fn().mockReturnValue({
        sub: 'google123'
      })
    });
    
    const result = await verifyGoogleToken('partial_token');
    
    expect(result).toEqual({
      email: undefined,
      googleId: 'google123',
      name: undefined,
      avatar: undefined
    });
  });
  
  test('Should handle null payload', async () => {
    mockVerifyIdToken.mockReturnValue({
      getPayload: jest.fn().mockReturnValue(null)
    });
    
    const result = await verifyGoogleToken('null_payload_token');
    
    expect(result).toEqual({
      email: undefined,
      googleId: undefined,
      name: undefined,
      avatar: undefined
    });
  });
});
