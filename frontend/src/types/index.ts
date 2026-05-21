export interface QuoteResponse {
  ticker: string;
  price: number | null;
  change_percent: number | null;
  volume: number | null;
  market_cap: number | null;
}

export interface FundamentalsResponse {
  ticker: string;
  lpa: number | null;
  vpa: number | null;
  pl: number | null;
  pvpa: number | null;
  liquidez_corrente: number | null;
  divida_patrimonio: number | null;
}

export interface GrahamResponse {
  ticker: string;
  price: number | null;
  lpa: number | null;
  vpa: number | null;
  graham_number: number | null;
  margem_seguranca: number | null;
  pl: number | null;
  pvpa: number | null;
  pl_x_pvpa: number | null;
  liquidez_corrente: number | null;
  divida_patrimonio: number | null;
  aprovado_graham: boolean;
}

export interface HistoryPoint {
  date: string;
  close: number;
  volume: number;
}
