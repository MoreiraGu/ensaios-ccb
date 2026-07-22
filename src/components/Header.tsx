import ccbLogo from '../assets/ccb-logo.png';

interface HeaderProps {
  totalHoje: number;
  totalSemana: number;
}

export function Header({ totalHoje, totalSemana }: HeaderProps) {
  const now = new Date();
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
  ];

  const dateStr = `${diasSemana[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;

  return (
    <header className="header">
      <div className="header__icon">
        <img src={ccbLogo} alt="Logo CCB" className="header__logo" />
      </div>
      <h1 className="header__title">Ensaios SJC</h1>
      <p className="header__subtitle">
        Encontre os ensaios de música da Congregação Cristã no Brasil em São José dos Campos
      </p>
      <p className="header__date">Hoje é {dateStr}</p>
      <p className="header__verse">
        "Cantai-lhe um cântico novo; tocai bem e com júbilo." — Salmo 33:3
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-card__number stat-card__number--hoje">{totalHoje}</span>
          <span className="stat-card__label">
            {totalHoje === 1 ? 'Ensaio hoje' : 'Ensaios hoje'}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-card__number stat-card__number--semana">{totalSemana}</span>
          <span className="stat-card__label">Nesta semana</span>
        </div>
      </div>
    </header>
  );
}
