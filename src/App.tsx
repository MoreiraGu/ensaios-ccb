import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { EnsaioList } from './components/EnsaioList';
import type { Ensaio, Regiao, FiltroPeriodo } from './types/ensaio';
import {
  getNextOccurrence,
  getEnsaioDatesInMonth,
  isToday,
  isThisWeek,
} from './utils/dateCalculator';
import ensaiosData from './data/ensaios.json';

import './index.css';

function App() {
  // Filtrar ensaios com _obs (dados incompletos/não confirmados)
  const ensaios = (ensaiosData as (Ensaio & { _obs?: string })[]).filter((e) => !e._obs) as Ensaio[];

  const [periodo, setPeriodo] = useState<FiltroPeriodo>('todos');
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<Regiao | 'Todas'>('Todas');
  const [busca, setBusca] = useState('');

  // Pre-compute dates for current month for all ensaios
  const ensaiosComDatas = useMemo(() => {
    const now = new Date();
    return ensaios.map((ensaio) => {
      const datesThisMonth = getEnsaioDatesInMonth(
        ensaio.recorrencia,
        now.getFullYear(),
        now.getMonth()
      );
      const nextOccurrence = getNextOccurrence(ensaio);
      const temHoje = datesThisMonth.some((d) => isToday(d));
      const temEstaSemana = datesThisMonth.some((d) => isThisWeek(d));
      return { ensaio, datesThisMonth, nextOccurrence, temHoje, temEstaSemana };
    });
  }, [ensaios]);

  // Filter logic
  const ensaiosFiltrados = useMemo(() => {
    return ensaiosComDatas
      .filter(({ ensaio, temHoje, temEstaSemana }) => {
        // Período filter
        if (periodo === 'hoje' && !temHoje) return false;
        if (periodo === 'semana' && !temEstaSemana) return false;

        // Região filter
        if (regiaoSelecionada !== 'Todas' && ensaio.regiao !== regiaoSelecionada) return false;

        // Search filter
        if (busca.trim()) {
          const q = busca.toLowerCase();
          const match =
            ensaio.igreja.toLowerCase().includes(q) ||
            ensaio.endereco.toLowerCase().includes(q) ||
            ensaio.regiao.toLowerCase().includes(q) ||
            ensaio.tipoEnsaio.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .map(({ ensaio }) => ensaio)
      // Sort: ensaios com data mais próxima primeiro
      .sort((a, b) => {
        const dateA = getNextOccurrence(a);
        const dateB = getNextOccurrence(b);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      });
  }, [ensaiosComDatas, periodo, regiaoSelecionada, busca]);

  // Stats
  const totalHoje = ensaiosComDatas.filter((e) => e.temHoje).length;
  const totalSemana = ensaiosComDatas.filter((e) => e.temEstaSemana).length;

  return (
    <div className="app-container">
      <Header
        totalHoje={totalHoje}
        totalSemana={totalSemana}
      />

      <FilterBar
        periodo={periodo}
        setPeriodo={setPeriodo}
        regiaoSelecionada={regiaoSelecionada}
        setRegiaoSelecionada={setRegiaoSelecionada}
        busca={busca}
        setBusca={setBusca}
      />

      <EnsaioList ensaios={ensaiosFiltrados} />

      <footer className="app-footer">
        <span>Ensaios SJC — São José dos Campos</span>
      </footer>
    </div>
  );
}

export default App;
