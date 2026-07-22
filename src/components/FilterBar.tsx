import { Search } from 'lucide-react';
import type { Regiao, FiltroPeriodo } from '../types/ensaio';

interface FilterBarProps {
  periodo: FiltroPeriodo;
  setPeriodo: (p: FiltroPeriodo) => void;
  regiaoSelecionada: Regiao | 'Todas';
  setRegiaoSelecionada: (r: Regiao | 'Todas') => void;
  busca: string;
  setBusca: (b: string) => void;
}

const regioes: { key: Regiao | 'Todas'; label: string }[] = [
  { key: 'Todas', label: 'Todas as regiões' },
  { key: 'Centro', label: 'Centro' },
  { key: 'Sul', label: 'Sul' },
  { key: 'Norte', label: 'Norte' },
  { key: 'Leste', label: 'Leste' },
  { key: 'Oeste', label: 'Oeste' },
  { key: 'Sudeste', label: 'Sudeste' },
  { key: 'SFX', label: 'São Francisco Xavier' },
  { key: 'Monteiro Lobato', label: 'Monteiro Lobato' },
];

const periodos: { key: FiltroPeriodo; label: string }[] = [
  { key: 'hoje', label: '📅 Ensaios de Hoje' },
  { key: 'semana', label: '📆 Esta Semana' },
  { key: 'todos', label: '📋 Todos os Ensaios' },
];

export function FilterBar({
  periodo,
  setPeriodo,
  regiaoSelecionada,
  setRegiaoSelecionada,
  busca,
  setBusca,
}: FilterBarProps) {
  return (
    <section className="filter-section">
      {/* Filtro de período */}
      <div className="filter-row">
        <h2 className="filter-row__title">O que você quer ver?</h2>
        <div className="filter-group filter-group--periodo">
          {periodos.map((p) => (
            <button
              key={p.key}
              className={`filter-btn filter-btn--periodo ${periodo === p.key ? 'filter-btn--active' : ''}`}
              onClick={() => setPeriodo(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro de região */}
      <div className="filter-row">
        <h2 className="filter-row__title">Filtrar por região</h2>
        <div className="filter-group filter-group--regiao">
          {regioes.map((r) => (
            <button
              key={r.key}
              className={`filter-btn filter-btn--region filter-btn--region-${r.key} ${
                regiaoSelecionada === r.key ? 'filter-btn--active' : ''
              }`}
              onClick={() => setRegiaoSelecionada(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Busca */}
      <div className="filter-row filter-row--search">
        <div className="search-wrapper">
          <Search />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome da igreja ou bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
