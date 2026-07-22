import { CalendarX } from 'lucide-react';
import type { Ensaio } from '../types/ensaio';
import { EnsaioCard } from './EnsaioCard';

interface EnsaioListProps {
  ensaios: Ensaio[];
}

export function EnsaioList({ ensaios }: EnsaioListProps) {
  if (ensaios.length === 0) {
    return (
      <div className="ensaio-grid">
        <div className="ensaio-grid__empty">
          <CalendarX />
          <p>Nenhum ensaio encontrado</p>
          <span>Tente alterar os filtros ou a busca</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ensaio-grid">
      {ensaios.map((ensaio) => (
        <EnsaioCard key={ensaio.id} ensaio={ensaio} />
      ))}
    </div>
  );
}
