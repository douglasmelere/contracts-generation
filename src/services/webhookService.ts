import { DocumentData, WebhookResponse } from '../types/Contract';

export const sendToWebhook = async (
  data: DocumentData,
  token: string
): Promise<WebhookResponse> => {
  const url = import.meta.env.VITE_WEBHOOK_URL || "https://n8n.pagluz.com.br/webhook/e6e34398-975b-417f-882d-285d377b9659";

  console.log(token)

  if (!url) {
    return {
      success: false,
      message: 'URL do webhook não configurada. Verifique as variáveis de ambiente.'
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return {
      success: true,
      message: 'Documento gerado e enviado com sucesso! ✨'
    };
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    return {
      success: false,
      message: `Erro ao gerar documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};