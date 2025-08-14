import React, { useState } from 'react';
import { Header } from './Header';
import { FormField } from './FormField';
import { LoadingSpinner } from './LoadingSpinner';
import { Key, Shield, Lock } from 'lucide-react';

interface AuthPageProps {
  onAuthenticated: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Por favor, insira o token de acesso.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular validação do token (você pode adicionar validação real aqui)
    setTimeout(() => {
      try {
        // Salvar token no localStorage
        localStorage.setItem('pagluz_auth_token', token);
        onAuthenticated(token);
      } catch (err) {
        setError('Erro ao salvar token. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Seguro
            </h2>
            <p className="text-gray-600">
              Insira seu token de autenticação para acessar o sistema de contratos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Token de Acesso"
              name="token"
              type="password"
              value={token}
              onChange={setToken}
              placeholder="Digite seu token de autenticação"
              required
              error={error}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Key className="h-5 w-5 mr-2" />
                  Acessar Sistema
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Segurança
                </h4>
                <p className="text-xs text-blue-700">
                  Seu token é armazenado localmente e usado para autenticação segura com nossos serviços.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};