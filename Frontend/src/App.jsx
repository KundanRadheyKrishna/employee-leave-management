// App.jsx
import React, { useEffect } from 'react';
import { account } from './appwriteConfig';

function App() {
  useEffect(() => {
    const testLogin = async () => {
      try {
        await account.createEmailPasswordSession('admin@gmail.com', 'admin@123');
        console.log('Login successful');
      } catch (error) {
        console.error('Connection failed', error); // Agar fail ho to exact error bhejo
      }
    };

    testLogin();
  }, []);

  return (
    <div>
      <h1>Appwrite Connection Test</h1>
      <p>Check console for login status.</p>
    </div>
  );
}

export default App;