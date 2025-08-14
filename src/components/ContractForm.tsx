import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { LoadingSpinner } from './LoadingSpinner';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { ProcuracaoTypeSelector } from './ProcuracaoTypeSelector';
import {
  DocumentData,
  DocumentType,
  ProcuracaoType,
  ContractData,
  ServiceContractData,
  ProcuracaoPJData,
  ProcuracaoPFData
} from '../types/Contract';
import { formatCpfCnpj, numberToWords } from '../utils/formatters';
import { formatCep } from '../utils/formatters';
import { sendToWebhook } from '../services/webhookService';
import {
  Send,
  CheckCircle,
  XCircle,
  User,
  Users,
  Zap,
  CreditCard,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  Building,
  Briefcase,
  LogOut
} from 'lucide-react';

interface ContractFormProps {
  authToken: string;
  onLogout: () => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({ authToken, onLogout }) => {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [procuracaoType, setProcuracaoType] = useState<ProcuracaoType | null>(null);
  const [formData, setFormData] = useState<Partial<DocumentData>>({
    cidade: '',
    data: new Date().toISOString().split('T')[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Reset form when document type changes
  useEffect(() => {
    if (documentType) {
      setFormData({
        documentType,
        cidade: '',
        data: new Date().toISOString().split('T')[0]
      });
      setProcuracaoType(null);
      setCompletedSections(new Set());
    }
  }, [documentType]);

  // ✅ CORREÇÃO: useEffect para auto-calcular campos "por extenso"
  useEffect(() => {
    if (documentType === 'locacao' && formData.documentType === 'locacao') {
      const data = formData as ContractData;
      const updates: Partial<ContractData> = {};

      // Calcula os novos valores "por extenso"
      const capExtenso = data.percentualCapacidade > 0 ? numberToWords(data.percentualCapacidade) : '';
      const descExtenso = data.percentualDesconto > 0 ? numberToWords(data.percentualDesconto) : '';
      const vigExtenso = data.prazoVigencia > 0 ? numberToWords(data.prazoVigencia) : '';

      // Compara com os valores existentes e adiciona ao objeto de updates apenas se houver mudança
      if (capExtenso !== data.percentualCapacidadePorExtenso) {
        updates.percentualCapacidadePorExtenso = capExtenso;
      }
      if (descExtenso !== data.percentualDescontoPorExtenso) {
        updates.percentualDescontoPorExtenso = descExtenso;
      }
      if (vigExtenso !== data.prazoVigenciaPorExtenso) {
        updates.prazoVigenciaPorExtenso = vigExtenso;
      }

      // Atualiza o estado apenas se houver mudanças reais, evitando o loop infinito
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({ ...prev, ...updates }));
      }
    }
  }, [formData, documentType]); // As dependências estão corretas, a lógica interna previne o loop.

  const updateField = (field: string) => (value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string'
        ? (field.includes('cpf') || field.includes('cnpj') || field.includes('Cnpj'))
          ? formatCpfCnpj(value)
          : (field.includes('cep') || field.includes('Cep'))
          ? formatCep(value)
          : value
        : value
    }));
  };

  const tiposUsina = [
    { value: 'solar', label: 'Solar Fotovoltaica' },
    { value: 'eolica', label: 'Eólica' },
    { value: 'hidrica', label: 'Hídrica (PCH)' },
    { value: 'biomassa', label: 'Biomassa' },
    { value: 'biogas', label: 'Biogás' },
    { value: 'hibrida', label: 'Híbrida (Solar + Eólica)' }
  ];

  const tiposServico = [
    { value: 'energia-solar-fotovoltaica', label: 'Energia Solar Fotovoltaica' },
    { value: 'energia-eolica', label: 'Energia Eólica' },
    { value: 'energia-hidrica', label: 'Energia Hídrica (PCH)' },
    { value: 'energia-biomassa', label: 'Energia de Biomassa' },
    { value: 'energia-biogas', label: 'Energia de Biogás' },
    { value: 'consultoria-energetica', label: 'Consultoria Energética' },
    { value: 'manutencao-usinas', label: 'Manutenção de Usinas' },
    { value: 'monitoramento-geracao', label: 'Monitoramento de Geração' },
    { value: 'gestao-creditos', label: 'Gestão de Créditos de Energia' }
  ];

  const ufs = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];
  const getTotalSteps = (): number => {
    if (documentType === 'locacao') return 5;
    if (documentType === 'prestacao') return 4;
    if (documentType === 'procuracao') return 3;
    return 0;
  };

  const validateForm = (): boolean => {
    // Basic validation - can be expanded
    if (!documentType) return false;
    if (!formData.cidade || !formData.data) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const response = await sendToWebhook(formData as DocumentData, authToken);

    setMessage({
      type: response.success ? 'success' : 'error',
      text: response.message
    });

    setIsLoading(false);
  };

  const renderLocacaoForm = () => {
    const data = formData as ContractData;

    return (
      <>
        <FormSection
          title="Dados do Gerador"
          description="Informações da pessoa/empresa que aluga a capacidade de geração"
          icon={<User className="h-6 w-6" />}
        >
          <FormField
            label="Nome do Gerador"
            name="nomeGerador"
            value={data.nomeGerador || ''}
            onChange={updateField('nomeGerador')}
            required
          />
          <SelectField
            label="Tipo de Documento"
            name="tipoDocumentoGerador"
            value={data.tipoDocumentoGerador || ''}
            onChange={updateField('tipoDocumentoGerador')}
            options={[
              { value: 'cpf', label: 'CPF (Pessoa Física)' },
              { value: 'cnpj', label: 'CNPJ (Pessoa Jurídica)' }
            ]}
            placeholder="Selecione o tipo"
            required
          />
          <FormField
            label={data.tipoDocumentoGerador === 'cpf' ? 'CPF do Gerador' : data.tipoDocumentoGerador === 'cnpj' ? 'CNPJ do Gerador' : 'CPF/CNPJ do Gerador'}
            name="cpfCnpjGerador"
            value={data.cpfCnpjGerador || ''}
            onChange={updateField('cpfCnpjGerador')}
            placeholder={data.tipoDocumentoGerador === 'cpf' ? '000.000.000-00' : data.tipoDocumentoGerador === 'cnpj' ? '00.000.000/0000-00' : 'CPF ou CNPJ'}
            required
          />
          <FormField
            label="Rua/Avenida"
            name="ruaGerador"
            value={data.ruaGerador || ''}
            onChange={updateField('ruaGerador')}
            placeholder="Ex: Rua das Flores"
            required
          />
          <FormField
            label="Número"
            name="numeroGerador"
            value={data.numeroGerador || ''}
            onChange={updateField('numeroGerador')}
            placeholder="Ex: 123"
            required
          />
          <FormField
            label="Bairro"
            name="bairroGerador"
            value={data.bairroGerador || ''}
            onChange={updateField('bairroGerador')}
            placeholder="Ex: Centro"
            required
          />
          <FormField
            label="Cidade"
            name="cidadeGerador"
            value={data.cidadeGerador || ''}
            onChange={updateField('cidadeGerador')}
            placeholder="Ex: São Paulo"
            required
          />
          <SelectField
            label="Estado (UF)"
            name="ufGerador"
            value={data.ufGerador || ''}
            onChange={updateField('ufGerador')}
            options={ufs}
            required
          />
          <FormField
            label="CEP"
            name="cepGerador"
            value={data.cepGerador || ''}
            onChange={updateField('cepGerador')}
            placeholder="00000-000"
            required
          />
          <FormField
            label="E-mail do Gerador"
            name="emailGerador"
            type="email"
            value={data.emailGerador || ''}
            onChange={updateField('emailGerador')}
            required
          />
        </FormSection>

        <FormSection
          title="Dados Bancários do Gerador"
          description="Informações bancárias para recebimento dos pagamentos"
          icon={<CreditCard className="h-6 w-6" />}
        >
          <FormField
            label="Banco"
            name="bancoGerador"
            value={data.bancoGerador || ''}
            onChange={updateField('bancoGerador')}
            required
          />
          <FormField
            label="Agência"
            name="agenciaGerador"
            value={data.agenciaGerador || ''}
            onChange={updateField('agenciaGerador')}
            required
          />
          <FormField
            label="Número da Conta"
            name="contaGerador"
            value={data.contaGerador || ''}
            onChange={updateField('contaGerador')}
            required
          />
        </FormSection>

        <FormSection
          title="Dados do Consumidor"
          description="Informações da pessoa/empresa que aluga a capacidade"
          icon={<Users className="h-6 w-6" />}
        >
          <FormField
            label="Nome do Consumidor"
            name="nomeConsumidor"
            value={data.nomeConsumidor || ''}
            onChange={updateField('nomeConsumidor')}
            required
          />
          <SelectField
            label="Tipo de Documento"
            name="tipoDocumentoConsumidor"
            value={data.tipoDocumentoConsumidor || ''}
            onChange={updateField('tipoDocumentoConsumidor')}
            options={[
              { value: 'cpf', label: 'CPF (Pessoa Física)' },
              { value: 'cnpj', label: 'CNPJ (Pessoa Jurídica)' }
            ]}
            placeholder="Selecione o tipo"
            required
          />
          <FormField
            label={data.tipoDocumentoConsumidor === 'cpf' ? 'CPF do Consumidor' : data.tipoDocumentoConsumidor === 'cnpj' ? 'CNPJ do Consumidor' : 'CPF/CNPJ do Consumidor'}
            name="cpfCnpjConsumidor"
            value={data.cpfCnpjConsumidor || ''}
            onChange={updateField('cpfCnpjConsumidor')}
            placeholder={data.tipoDocumentoConsumidor === 'cpf' ? '000.000.000-00' : data.tipoDocumentoConsumidor === 'cnpj' ? '00.000.000/0000-00' : 'CPF ou CNPJ'}
            required
          />
          <FormField
            label="Rua/Avenida"
            name="ruaConsumidor"
            value={data.ruaConsumidor || ''}
            onChange={updateField('ruaConsumidor')}
            placeholder="Ex: Rua das Flores"
            required
          />
          <FormField
            label="Número"
            name="numeroConsumidor"
            value={data.numeroConsumidor || ''}
            onChange={updateField('numeroConsumidor')}
            placeholder="Ex: 123"
            required
          />
          <FormField
            label="Bairro"
            name="bairroConsumidor"
            value={data.bairroConsumidor || ''}
            onChange={updateField('bairroConsumidor')}
            placeholder="Ex: Centro"
            required
          />
          <FormField
            label="Cidade"
            name="cidadeConsumidor"
            value={data.cidadeConsumidor || ''}
            onChange={updateField('cidadeConsumidor')}
            placeholder="Ex: São Paulo"
            required
          />
          <SelectField
            label="Estado (UF)"
            name="ufConsumidor"
            value={data.ufConsumidor || ''}
            onChange={updateField('ufConsumidor')}
            options={ufs}
            required
          />
          <FormField
            label="CEP"
            name="cepConsumidor"
            value={data.cepConsumidor || ''}
            onChange={updateField('cepConsumidor')}
            placeholder="00000-000"
            required
          />
          <FormField
            label="E-mail do Consumidor"
            name="emailConsumidor"
            type="email"
            value={data.emailConsumidor || ''}
            onChange={updateField('emailConsumidor')}
            required
          />
        </FormSection>

        <FormSection
          title="Dados da Usina/Contrato"
          description="Informações sobre a usina e condições do contrato"
          icon={<Zap className="h-6 w-6" />}
        >
          <SelectField
            label="Tipo da Usina"
            name="tipoUsina"
            value={data.tipoUsina || ''}
            onChange={updateField('tipoUsina')}
            options={tiposUsina}
            placeholder="Selecione o tipo de usina"
            required
          />
          <FormField
            label="Número da UC do Gerador"
            name="numeroUcGerador"
            value={data.numeroUcGerador || ''}
            onChange={updateField('numeroUcGerador')}
            required
          />
          <FormField
            label="Número da UC do Consumidor"
            name="numeroUcConsumidor"
            value={data.numeroUcConsumidor || ''}
            onChange={updateField('numeroUcConsumidor')}
            required
          />
          <FormField
            label="Percentual da Capacidade (%)"
            name="percentualCapacidade"
            type="number"
            value={data.percentualCapacidade || 0}
            onChange={updateField('percentualCapacidade')}
            required
          />
          <FormField
            label="Percentual da Capacidade (por extenso)"
            name="percentualCapacidadePorExtenso"
            value={data.percentualCapacidadePorExtenso || ''}
            onChange={updateField('percentualCapacidadePorExtenso')}
            disabled
          />
          <FormField
            label="Percentual de Desconto (%)"
            name="percentualDesconto"
            type="number"
            value={data.percentualDesconto || 0}
            onChange={updateField('percentualDesconto')}
            required
          />
          <FormField
            label="Percentual de Desconto (por extenso)"
            name="percentualDescontoPorExtenso"
            value={data.percentualDescontoPorExtenso || ''}
            onChange={updateField('percentualDescontoPorExtenso')}
            disabled
          />
          <FormField
            label="Dia do mês para pagamento"
            name="diaPagamento"
            type="number"
            value={data.diaPagamento || 1}
            onChange={updateField('diaPagamento')}
            required
          />
          <FormField
            label="Prazo de Vigência (meses)"
            name="prazoVigencia"
            type="number"
            value={data.prazoVigencia || 12}
            onChange={updateField('prazoVigencia')}
            required
          />
          <FormField
            label="Prazo de Vigência (por extenso)"
            name="prazoVigenciaPorExtenso"
            value={data.prazoVigenciaPorExtenso || ''}
            onChange={updateField('prazoVigenciaPorExtenso')}
            disabled
          />
          <FormField
            label="Prazo para multa em caso de rescisão antecipada (meses)"
            name="prazoMulta"
            type="number"
            value={data.prazoMulta || 12}
            onChange={updateField('prazoMulta')}
            required
          />
        </FormSection>
      </>
    );
  };

  const renderPrestacaoForm = () => {
    const data = formData as ServiceContractData;

    return (
      <>
        <FormSection
          title="Dados do Contratante"
          description="Informações da pessoa/empresa contratante"
          icon={<User className="h-6 w-6" />}
        >
          <FormField
            label="Nome do Contratante"
            name="nomeContratante"
            value={data.nomeContratante || ''}
            onChange={updateField('nomeContratante')}
            required
          />
          <FormField
            label="CPF/CNPJ do Contratante"
            name="cpfCnpjContratante"
            value={data.cpfCnpjContratante || ''}
            onChange={updateField('cpfCnpjContratante')}
            required
          />
          <FormField
            label="Endereço Completo (sede/morada)"
            name="enderecoContratante"
            value={data.enderecoContratante || ''}
            onChange={updateField('enderecoContratante')}
            className="md:col-span-2"
            required
          />
          <FormField
            label="E-mail do Contratante"
            name="emailContratante"
            type="email"
            value={data.emailContratante || ''}
            onChange={updateField('emailContratante')}
            required
          />
          <FormField
            label="Nome do Representante do Contratante"
            name="nomeRepresentanteContratante"
            value={data.nomeRepresentanteContratante || ''}
            onChange={updateField('nomeRepresentanteContratante')}
            required
          />
          <FormField
            label="CPF do Representante do Contratante"
            name="cpfRepresentanteContratante"
            value={data.cpfRepresentanteContratante || ''}
            onChange={updateField('cpfRepresentanteContratante')}
            required
          />
        </FormSection>

        <FormSection
          title="Dados da Contratada"
          description="Informações da PagLuz (dados fixos)"
          icon={<Building className="h-6 w-6" />}
        >
          <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Dados Fixos da Contratada:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Nome:</strong> PagLuz</p>
              <p><strong>CNPJ:</strong> 57.087.593/0001-92</p>
              <p><strong>Endereço:</strong> Rua Av. Frei João, Nº 601, São Francisco, Luzerna - SC</p>
              <p><strong>E-mail:</strong> contato.pagluz@gmail.com</p>
              <p><strong>Representante:</strong> Eduardo Trevisan</p>
              <p><strong>CPF do Representante:</strong> 116.091.029-40</p>
              <p><strong>Conta Bancária:</strong> Banco 3033 – Conta Corrente: 32.155-9</p>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Dados Operacionais"
          description="Informações sobre o serviço e condições"
          icon={<Briefcase className="h-6 w-6" />}
        >
          <SelectField
            label="Tipo de Energia ou Nome do Serviço"
            name="tipoEnergia"
            value={data.tipoEnergia || ''}
            onChange={updateField('tipoEnergia')}
            options={tiposServico}
            placeholder="Selecione o tipo de serviço"
            required
          />
          <FormField
            label="E-mail para comunicações"
            name="emailComunicacoes"
            type="email"
            value={data.emailComunicacoes || ''}
            onChange={updateField('emailComunicacoes')}
            required
          />
          <FormField
            label="Prazo mínimo para multa rescisória (meses)"
            name="prazoMinimoMulta"
            type="number"
            value={data.prazoMinimoMulta || 12}
            onChange={updateField('prazoMinimoMulta')}
            required
          />
        </FormSection>
      </>
    );
  };

  const renderProcuracaoPJForm = () => {
    const data = formData as ProcuracaoPJData;

    return (
      <>
        <FormSection
          title="Dados da Empresa Outorgante"
          description="Informações da empresa que outorga a procuração"
          icon={<Building className="h-6 w-6" />}
        >
          <FormField
            label="Razão Social da empresa"
            name="razaoSocialOutorgante"
            value={data.razaoSocialOutorgante || ''}
            onChange={updateField('razaoSocialOutorgante')}
            placeholder="Ex: Comércio Walter e Eliane LTDA"
            required
          />
          <FormField
            label="CNPJ da empresa"
            name="cnpjOutorgante"
            value={data.cnpjOutorgante || ''}
            onChange={updateField('cnpjOutorgante')}
            placeholder="00.000.000/0000-00"
            required
          />
          <FormField
            label="Rua/Avenida"
            name="ruaOutorgante"
            value={data.ruaOutorgante || ''}
            onChange={updateField('ruaOutorgante')}
            placeholder="Ex: Rua das Flores"
            required
          />
          <FormField
            label="Número"
            name="numeroOutorgante"
            value={data.numeroOutorgante || ''}
            onChange={updateField('numeroOutorgante')}
            placeholder="Ex: 123"
            required
          />
          <FormField
            label="Bairro"
            name="bairroOutorgante"
            value={data.bairroOutorgante || ''}
            onChange={updateField('bairroOutorgante')}
            placeholder="Ex: Centro"
            required
          />
          <FormField
            label="Cidade"
            name="cidadeOutorgante"
            value={data.cidadeOutorgante || ''}
            onChange={updateField('cidadeOutorgante')}
            placeholder="Ex: São Paulo"
            required
          />
          <SelectField
            label="Estado (UF)"
            name="ufOutorgante"
            value={data.ufOutorgante || ''}
            onChange={updateField('ufOutorgante')}
            options={ufs}
            required
          />
          <FormField
            label="CEP"
            name="cepOutorgante"
            value={data.cepOutorgante || ''}
            onChange={updateField('cepOutorgante')}
            placeholder="00000-000"
            required
          />
        </FormSection>

        <FormSection
          title="Dados do Representante Legal"
          description="Informações da pessoa que representa a empresa"
          icon={<User className="h-6 w-6" />}
        >
          <FormField
            label="Cargo do representante"
            name="cargoRepresentanteOutorgante"
            value={data.cargoRepresentanteOutorgante || ''}
            onChange={updateField('cargoRepresentanteOutorgante')}
            placeholder="Ex: Sócio-administrador, Diretor, etc."
            required
          />
          <FormField
            label="Nome completo do representante"
            name="nomeRepresentanteOutorgante"
            value={data.nomeRepresentanteOutorgante || ''}
            onChange={updateField('nomeRepresentanteOutorgante')}
            required
          />
          <FormField
            label="Nacionalidade"
            name="nacionalidadeRepresentanteOutorgante"
            value={data.nacionalidadeRepresentanteOutorgante || ''}
            onChange={updateField('nacionalidadeRepresentanteOutorgante')}
            placeholder="Ex: Brasileira"
            required
          />
          <FormField
            label="Estado civil"
            name="estadoCivilRepresentanteOutorgante"
            value={data.estadoCivilRepresentanteOutorgante || ''}
            onChange={updateField('estadoCivilRepresentanteOutorgante')}
            placeholder="Ex: Solteiro(a), Casado(a)"
            required
          />
          <FormField
            label="Profissão"
            name="profissaoRepresentanteOutorgante"
            value={data.profissaoRepresentanteOutorgante || ''}
            onChange={updateField('profissaoRepresentanteOutorgante')}
            placeholder="Ex: Empresário, Administrador"
            required
          />
          <FormField
            label="CPF do representante"
            name="cpfRepresentanteOutorgante"
            value={data.cpfRepresentanteOutorgante || ''}
            onChange={updateField('cpfRepresentanteOutorgante')}
            placeholder="000.000.000-00"
            required
          />
          <FormField
            label="RG do representante"
            name="rgRepresentanteOutorgante"
            value={data.rgRepresentanteOutorgante || ''}
            onChange={updateField('rgRepresentanteOutorgante')}
            placeholder="Ex: 12.345.678-9"
            required
          />
        </FormSection>
      </>
    );
  };

  const renderProcuracaoPFForm = () => {
    const data = formData as ProcuracaoPFData;

    return (
      <>
        <FormSection
          title="Dados do Outorgante"
          description="Informações da pessoa física que outorga a procuração"
          icon={<User className="h-6 w-6" />}
        >
          <FormField
            label="Nome completo do outorgante"
            name="nomeOutorgante"
            value={data.nomeOutorgante || ''}
            onChange={updateField('nomeOutorgante')}
            required
          />
          <FormField
            label="CPF do outorgante"
            name="cpfOutorgante"
            value={data.cpfOutorgante || ''}
            onChange={updateField('cpfOutorgante')}
            placeholder="000.000.000-00"
            required
          />
          <FormField
            label="Ocupação/Profissão"
            name="ocupacaoOutorgante"
            value={data.ocupacaoOutorgante || ''}
            onChange={updateField('ocupacaoOutorgante')}
            placeholder="Ex: Empresário, Aposentado, etc."
            required
          />
          <FormField
            label="Rua/Avenida"
            name="ruaOutorgante"
            value={data.ruaOutorgante || ''}
            onChange={updateField('ruaOutorgante')}
            placeholder="Ex: Rua das Flores"
            required
          />
          <FormField
            label="Número"
            name="numeroOutorgante"
            value={data.numeroOutorgante || ''}
            onChange={updateField('numeroOutorgante')}
            placeholder="Ex: 123"
            required
          />
          <FormField
            label="Bairro"
            name="bairroOutorgante"
            value={data.bairroOutorgante || ''}
            onChange={updateField('bairroOutorgante')}
            placeholder="Ex: Centro"
            required
          />
          <FormField
            label="Cidade"
            name="cidadeOutorgante"
            value={data.cidadeOutorgante || ''}
            onChange={updateField('cidadeOutorgante')}
            placeholder="Ex: São Paulo"
            required
          />
          <SelectField
            label="Estado (UF)"
            name="ufOutorgante"
            value={data.ufOutorgante || ''}
            onChange={updateField('ufOutorgante')}
            options={ufs}
            required
          />
          <FormField
            label="CEP"
            name="cepOutorgante"
            value={data.cepOutorgante || ''}
            onChange={updateField('cepOutorgante')}
            placeholder="00000-000"
            required
          />
        </FormSection>
      </>
    );
  };

  if (!documentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <DocumentTypeSelector
            selectedType={documentType}
            onTypeSelect={setDocumentType}
          />
        </div>
      </div>
    );
  }

  if (documentType === 'procuracao' && !procuracaoType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <button
            onClick={() => setDocumentType(null)}
            className="mb-6 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Voltar para seleção de documento
          </button>
          <ProcuracaoTypeSelector
            selectedType={procuracaoType}
            onTypeSelect={(type) => {
              setProcuracaoType(type);
              setFormData(prev => ({ ...prev, procuracaoType: type }));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <button
          onClick={() => {
            if (documentType === 'procuracao' && procuracaoType) {
              setProcuracaoType(null);
            } else {
              setDocumentType(null);
            }
          }}
          className="mb-6 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </button>

        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center font-medium"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>

        <ProgressBar currentStep={completedSections.size} totalSteps={getTotalSteps()} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {documentType === 'locacao' && renderLocacaoForm()}
          {documentType === 'prestacao' && renderPrestacaoForm()}
          {documentType === 'procuracao' && procuracaoType === 'pj' && renderProcuracaoPJForm()}
          {documentType === 'procuracao' && procuracaoType === 'pf' && renderProcuracaoPFForm()}

          {/* Dados para Fechamento - Common for all types */}
          <FormSection
            title="Dados para Fechamento"
            description="Informações de local e data para assinatura"
            icon={<FileText className="h-6 w-6" />}
          >
            <FormField
              label="Cidade da assinatura"
              name="cidade"
              value={formData.cidade || ''}
              onChange={updateField('cidade')}
              placeholder="Ex: Luzerna"
              required
            />
            <FormField
              label="Data da assinatura"
              name="data"
              type="date"
              value={formData.data || ''}
              onChange={updateField('data')}
              required
            />
          </FormSection>

          {/* Message Display */}
          {message && (
            <div className={`rounded-2xl p-6 flex items-center shadow-lg ${
              message.type === 'success'
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-600 mr-4" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 mr-4" />
              )}
              <span className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold flex items-center justify-center"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-5 w-5 mr-2" />
                  Ocultar Dados
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 mr-2" />
                  Visualizar Dados
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Gerar Documento
                </>
              )}
            </button>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-orange-500" />
                Preview dos Dados do Documento
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto font-mono">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-yellow-400 mr-3" />
            <span className="text-2xl font-bold">Pagluz</span>
          </div>
          <p className="text-gray-300 mb-2">
            Energia Solar Inteligente • Documentos Automatizados
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 Pagluz. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};