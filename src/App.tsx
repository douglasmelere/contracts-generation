import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { ContractForm } from './components/ContractForm';

function App() {
  const [authData, setAuthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há credenciais salvas no localStorage
    const savedUsername = localStorage.getItem('pagluz_username');
    const savedPassword = localStorage.getItem('pagluz_password');
    
    if (savedUsername && savedPassword) {
      setAuthData({
        username: savedUsername,
        password: savedPassword
      });
    }
    
    setIsLoading(false);
  }, []);

  const handleAuthenticated = (userData: any) => {
    setAuthData(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('pagluz_username');
    localStorage.removeItem('pagluz_password');
    localStorage.removeItem('pagluz_user_data');
    setAuthData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!authData) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <ContractForm 
      authData={authData} 
      onLogout={handleLogout} 
    />
  );
}

export default App;