/**
 * Initialize default users in local storage if no users exist
 */
export const initializeDefaultUsers = () => {
    // Check if users already exist in local storage
    const existingUsers = localStorage.getItem('users');
    
    if (!existingUsers) {
      // Create default users
      const defaultUsers = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: '2',
          name: 'Test User',
          email: 'user@example.com',
          password: 'user123',
          role: 'user'
        }
      ];
      
      // Save to local storage
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      console.log('Default users initialized');
    }
  };