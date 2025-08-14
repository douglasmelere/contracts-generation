export type DocumentType = 'locacao' | 'prestacao' | 'procuracao';
export type ProcuracaoType = 'pj' | 'pf';

export interface BaseDocumentData {
  documentType: DocumentType;
  cidade: string;
  data: string;
}

export interface ContractData extends BaseDocumentData {
  documentType: 'locacao';
  // Dados do Gerador
  nomeGerador: string;
  tipoDocumentoGerador: 'cpf' | 'cnpj';
  cpfCnpjGerador: string;
  ruaGerador: string;
  numeroGerador: string;
  bairroGerador: string;
  cidadeGerador: string;
  ufGerador: string;
  cepGerador: string;
  emailGerador: string;
  bancoGerador: string;
  agenciaGerador: string;
  contaGerador: string;
  
  // Dados do Consumidor
  nomeConsumidor: string;
  tipoDocumentoConsumidor: 'cpf' | 'cnpj';
  cpfCnpjConsumidor: string;
  ruaConsumidor: string;
  numeroConsumidor: string;
  bairroConsumidor: string;
  cidadeConsumidor: string;
  ufConsumidor: string;
  cepConsumidor: string;
  emailConsumidor: string;
  
  // Dados da Usina/Contrato
  tipoUsina: string;
  numeroUcGerador: string;
  numeroUcConsumidor: string;
  percentualCapacidade: number;
  percentualCapacidadePorExtenso: string;
  percentualDesconto: number;
  percentualDescontoPorExtenso: string;
  diaPagamento: number;
  prazoVigencia: number;
  prazoVigenciaPorExtenso: string;
}

export interface ServiceContractData extends BaseDocumentData {
  documentType: 'prestacao';
  // Dados do Contratante
  nomeContratante: string;
  tipoDocumentoContratante: 'cpf' | 'cnpj';
  cpfCnpjContratante: string;
  ruaContratante: string;
  numeroContratante: string;
  bairroContratante: string;
  cidadeContratante: string;
  ufContratante: string;
  cepContratante: string;
  emailContratante: string;
  
  // Dados do Serviço
  tipoServico: string;
  descricaoServico: string;
  valorServico: number;
  valorServicoPorExtenso: string;
  prazoExecucao: number;
  prazoExecucaoPorExtenso: string;
  formaPagamento: string;
}

export interface ProcuracaoPJData extends BaseDocumentData {
  documentType: 'procuracao';
  procuracaoType: 'pj';
  // Dados da Empresa Outorgante
  razaoSocialOutorgante: string;
  cnpjOutorgante: string;
  ruaOutorgante: string;
  numeroOutorgante: string;
  bairroOutorgante: string;
  cidadeOutorgante: string;
  ufOutorgante: string;
  cepOutorgante: string;
  // Dados do Representante Legal
  cargoRepresentanteOutorgante: string;
  nomeRepresentanteOutorgante: string;
  nacionalidadeRepresentanteOutorgante: string;
  estadoCivilRepresentanteOutorgante: string;
  profissaoRepresentanteOutorgante: string;
  cpfRepresentanteOutorgante: string;
  rgRepresentanteOutorgante: string;
}

export interface ProcuracaoPFData extends BaseDocumentData {
  documentType: 'procuracao';
  procuracaoType: 'pf';
  // Dados do Outorgante (Pessoa Física)
  nomeOutorgante: string;
  cpfOutorgante: string;
  ocupacaoOutorgante: string;
  ruaOutorgante: string;
  numeroOutorgante: string;
  bairroOutorgante: string;
  cidadeOutorgante: string;
  ufOutorgante: string;
  cepOutorgante: string;
}

export type DocumentData = ContractData | ServiceContractData | ProcuracaoPJData | ProcuracaoPFData;

