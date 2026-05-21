import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GrahamBadge from "../components/GrahamBadge";
import { useGraham, useHistory } from "../hooks/useGraham";
import { formatBRL, formatLargeNumber, formatNumber, formatPercent } from "../lib/formatters";

const PERIODS = [
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1A", value: "1y" },
  { label: "2A", value: "2y" },
  { label: "5A", value: "5y" },
];

export default function Stock() {
  const { ticker = "" } = useParams();
  const [period, setPeriod] = useState("1y");

  const { data: graham, isLoading, error } = useGraham(ticker);
  const { data: history } = useHistory(ticker, period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Carregando dados de {ticker}...
      </div>
    );
  }

  if (error || !graham) {
    return (
      <div className="text-red-400 text-center py-20">
        Ticker <strong>{ticker}</strong> não encontrado ou erro ao buscar dados.
      </div>
    );
  }

  const changeColor =
    graham.price === null
      ? "text-gray-400"
      : (graham.price ?? 0) >= 0
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{ticker}</h1>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-4xl font-bold text-white">{formatBRL(graham.price)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Market Cap: {formatLargeNumber(null)}
          </div>
        </div>
        <div className={`text-lg font-semibold px-4 py-2 rounded-lg ${graham.aprovado_graham ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-400"}`}>
          {graham.aprovado_graham ? "Aprovado por Graham" : "Não aprovado por Graham"}
        </div>
      </div>

      {/* Gráfico histórico */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Histórico de Preços</h2>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${period === p.value ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={history ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(v: number) => [formatBRL(v), "Fechamento"]}
            />
            <Line type="monotone" dataKey="close" stroke="#4ade80" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Indicadores Graham */}
      <div>
        <h2 className="font-semibold text-white mb-4">Análise Benjamin Graham</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GrahamBadge
            label="Número de Graham"
            value={formatBRL(graham.graham_number)}
            ok={graham.graham_number !== null && graham.price !== null ? graham.price < graham.graham_number : null}
            description="√(22,5 × LPA × VPA)"
          />
          <GrahamBadge
            label="Margem de Segurança"
            value={formatPercent(graham.margem_seguranca)}
            ok={graham.margem_seguranca !== null ? graham.margem_seguranca > 0 : null}
            description="(Graham - Preço) / Graham"
          />
          <GrahamBadge
            label="P/L"
            value={formatNumber(graham.pl)}
            ok={graham.pl !== null ? graham.pl <= 15 : null}
            description="Ideal ≤ 15"
          />
          <GrahamBadge
            label="P/VPA"
            value={formatNumber(graham.pvpa)}
            ok={graham.pvpa !== null ? graham.pvpa <= 1.5 : null}
            description="Ideal ≤ 1,5"
          />
          <GrahamBadge
            label="P/L × P/VPA"
            value={formatNumber(graham.pl_x_pvpa)}
            ok={graham.pl_x_pvpa !== null ? graham.pl_x_pvpa <= 22.5 : null}
            description="Ideal ≤ 22,5"
          />
          <GrahamBadge
            label="Liquidez Corrente"
            value={formatNumber(graham.liquidez_corrente)}
            ok={graham.liquidez_corrente !== null ? graham.liquidez_corrente >= 2 : null}
            description="Ideal ≥ 2,0"
          />
          <GrahamBadge
            label="Dívida/Patrimônio"
            value={formatNumber(graham.divida_patrimonio)}
            ok={graham.divida_patrimonio !== null ? graham.divida_patrimonio <= 1 : null}
            description="Ideal ≤ 1,0"
          />
          <GrahamBadge
            label="LPA"
            value={formatBRL(graham.lpa)}
            ok={graham.lpa !== null ? graham.lpa > 0 : null}
            description="Lucro Por Ação"
          />
        </div>
      </div>
    </div>
  );
}
