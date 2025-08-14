import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { ContractForm } from './components/ContractForm';

function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe token salvo no localStorage
    const savedToken = localStorage.getItem('pagluz_auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticated = (token: string) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('pagluz_auth_token');
    setAuthToken(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!authToken) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="App">
      <ContractForm authToken={authToken} onLogout={handleLogout} />
    </div>
  );
}

export default App;