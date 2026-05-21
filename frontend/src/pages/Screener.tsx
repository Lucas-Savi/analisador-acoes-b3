import { Filter } from "lucide-react";

export default function Screener() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Filter className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold text-white">Screener Graham</h1>
      </div>
      <p className="text-gray-400">
        Filtre ações da B3 que atendem os critérios de Benjamin Graham.
        Esta funcionalidade será implementada na próxima etapa.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-600">
        Em breve — aguarde a próxima versão.
      </div>
    </div>
  );
}
