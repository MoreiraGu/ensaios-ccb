import { CalendarDays, Clock, MapPin, ExternalLink } from 'lucide-react';
import type { Ensaio } from '../types/ensaio';
import {
  getNextOccurrence,
  describeRecorrencia,
  formatDate,
  daysUntil,
  isToday,
} from '../utils/dateCalculator';

interface EnsaioCardProps {
  ensaio: Ensaio;
}

export function EnsaioCard({ ensaio }: EnsaioCardProps) {
  const nextDate = getNextOccurrence(ensaio);
  const isHoje = nextDate ? isToday(nextDate) : false;
  const days = nextDate ? daysUntil(nextDate) : null;

  const getCountdownText = () => {
    if (days === null) return '';
    if (days === 0) return 'É hoje!';
    if (days === 1) return 'Amanhã';
    return `Faltam ${days} dias`;
  };

  return (
    <article
      className={`ensaio-card ${isHoje ? 'ensaio-card--hoje' : ''}`}
      data-region={ensaio.regiao}
    >
      {/* Nome da igreja + Badges */}
      <div className="ensaio-card__top">
        <h3 className="ensaio-card__igreja">{ensaio.igreja}</h3>
        <div className="ensaio-card__badges">
          {isHoje && <span className="badge badge--hoje">🎵 Hoje</span>}
          <span className="badge badge--regiao">{ensaio.regiao}</span>
        </div>
      </div>

      {/* Quando acontece */}
      <div className="ensaio-card__recorrencia">
        <CalendarDays />
        <span>{describeRecorrencia(ensaio.recorrencia)}</span>
      </div>

      {/* Informações */}
      <div className="ensaio-card__details">
        <div className="ensaio-card__detail">
          <Clock />
          <span><strong>Horário:</strong> {ensaio.horario}</span>
        </div>
        <div className="ensaio-card__detail">
          <MapPin />
          <span><strong>Endereço:</strong> {ensaio.endereco}</span>
        </div>
      </div>

      {/* Rodapé - próximo ensaio + mapa */}
      <div className="ensaio-card__footer">
        <div className="ensaio-card__next-date">
          <span className="ensaio-card__next-label">Próximo ensaio</span>
          <span
            className={`ensaio-card__next-value ${
              isHoje ? 'ensaio-card__next-value--hoje' : ''
            }`}
          >
            {nextDate ? formatDate(nextDate) : 'Sem data definida'}
          </span>
          <span
            className={`ensaio-card__countdown ${
              isHoje ? 'ensaio-card__countdown--hoje' : ''
            }`}
          >
            {getCountdownText()}
          </span>
        </div>

        <a
          href={ensaio.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link"
          title={`Ver ${ensaio.igreja} no Google Maps`}
        >
          <ExternalLink />
          Como chegar
        </a>
      </div>
    </article>
  );
}
