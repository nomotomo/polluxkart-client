// Authentication Service - API integration for user auth
import API_CONFIG from './apiConfig';

/**
 * Register a new user
 */
export const register = async (name, phone, password, email = null) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        password,
        email: email || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    
    // Transform to expected user format with token
    return {
      user: {
        id: data.user?.id,
        name: data.user?.name,
        email: data.user?.email,
        phone: data.user?.phone,
        avatar: data.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      },
      token: data.access_token,
    };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Login user with email or phone
 */
export const login = async (identifier, password) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Transform to expected user format with token
    return {
      user: {
        id: data.user?.id,
        name: data.user?.name,
        email: data.user?.email,
        phone: data.user?.phone,
        avatar: data.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${data.user?.name || 'User'}`,
      },
      token: data.access_token,
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Get current user profile (requires auth)
 */
export const getCurrentUser = async (token) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.me}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${data.name || 'User'}`,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Export all functions as a service object
const AuthService = {
  register,
  login,
  getCurrentUser,
};

export default AuthService;
