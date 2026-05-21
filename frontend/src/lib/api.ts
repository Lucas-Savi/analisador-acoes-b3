import type {
  FundamentalsResponse,
  GrahamResponse,
  HistoryPoint,
  QuoteResponse,
} from "../types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  getQuote: (ticker: string) =>
    get<QuoteResponse>(`/quotes/${ticker}`),

  getFundamentals: (ticker: string) =>
    get<FundamentalsResponse>(`/fundamentals/${ticker}`),

  getHistory: (ticker: string, period = "1y") =>
    get<HistoryPoint[]>(`/fundamentals/${ticker}/history?period=${period}`),

  getGraham: (ticker: string) =>
    get<GrahamResponse>(`/graham/${ticker}`),

  listTickers: () =>
    get<string[]>("/quotes/"),
};
