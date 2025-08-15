import React, { useState } from 'react';
import { Header } from './Header';
import { FormField } from './FormField';
import { LoadingSpinner } from './LoadingSpinner';
import { User, Shield, Lock } from 'lucide-react';

interface AuthPageProps {
  onAuthenticated: (userData: any) => void;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Criar Basic Auth header
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      
      // Fazer request para o endpoint de autenticação do N8N
      const response = await fetch('https://n8n.pagluz.com.br/webhook/e6e34398-975b-417f-882d-285d377b9659', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          action: 'login',
          username: credentials.username,
          password: credentials.password,
        }),
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        setError('Usuário ou senha incorretos.');
        return;
      }

      if (response.status === 403) {
        setError('Acesso negado. Verifique suas permissões.');
        return;
      }

      if (!response.ok) {
        setError(`Erro no servidor (${response.status}). Tente novamente.`);
        return;
      }

      // Ler resposta
      const responseText = await response.text();
      console.log('Response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        // Se não for JSON, assumir sucesso baseado no status 200
        responseData = { success: true, message: responseText };
      }

      // Verificar se há indicação de falha na resposta
      if (responseData.success === false || responseData.error) {
        setError(responseData.message || responseData.error || 'Erro na autenticação.');
        return;
      }

      // Login bem-sucedido!
      console.log('Login successful!');
      
      // Salvar credenciais
      localStorage.setItem('pagluz_username', credentials.username);
      localStorage.setItem('pagluz_password', credentials.password);
      
      // Passar dados de autenticação para o componente pai
      onAuthenticated({ 
        username: credentials.username, 
        password: credentials.password,
        user: responseData.user || { name: credentials.username }
      });

    } catch (err) {
      console.error('Erro durante autenticação:', err);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
              Faça login com suas credenciais para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Nome de Usuário"
              name="username"
              type="text"
              value={credentials.username}
              onChange={(value) => handleInputChange('username', value)}
              placeholder="Digite seu nome de usuário"
              required
            />

            <FormField
              label="Senha"
              name="password"
              type="password"
              value={credentials.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Digite sua senha"
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
                  <User className="h-5 w-5 mr-2" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-900 mb-1">
                  ✅ Autenticação Configurada
                </h4>
                <p className="text-xs text-green-700">
                  Sistema configurado com Basic Authentication. Suas credenciais são verificadas no servidor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};