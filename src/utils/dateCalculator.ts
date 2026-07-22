import type { Ensaio, Recorrencia, RestricaoMes } from '../types/ensaio';

/**
 * Verifica se um dado mês é permitido pela restrição de meses.
 * @param month Mês 0-indexado (0=Jan ... 11=Dez) — padrão JS Date.
 * @param restricao Restrição de meses (opcional). Se ausente, todos os meses são permitidos.
 * @returns true se o ensaio pode acontecer nesse mês.
 */
export function mesPermitido(month: number, restricao?: RestricaoMes): boolean {
  if (!restricao) return true;

  // Converter para 1-indexado para facilitar a lógica ímpar/par
  const mes1 = month + 1; // 1=Jan ... 12=Dez

  switch (restricao.tipo) {
    case 'impar':
      return mes1 % 2 === 1; // Jan(1), Mar(3), Mai(5), Jul(7), Set(9), Nov(11)
    case 'par':
      return mes1 % 2 === 0; // Fev(2), Abr(4), Jun(6), Ago(8), Out(10), Dez(12)
    case 'especifico':
      return restricao.meses ? restricao.meses.includes(mes1) : true;
    default:
      return true;
  }
}

/**
 * Retorna a data da N-ésima ocorrência de um dia da semana em um dado mês/ano.
 * Ex: getNthWeekdayOfMonth(2026, 6, 4, 4) => a 4ª quinta-feira de julho de 2026.
 *
 * @param year Ano
 * @param month Mês (0-indexado: 0=Jan, 6=Jul)
 * @param weekday Dia da semana (0=Dom ... 6=Sáb)
 * @param n Ordem (1-5 para 1ª-5ª, -1 para última)
 * @returns Date ou null se não existir
 */
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number
): Date | null {
  if (n === -1) {
    // Última ocorrência: começar do final do mês e voltar
    const lastDay = new Date(year, month + 1, 0); // último dia do mês
    const diff = (lastDay.getDay() - weekday + 7) % 7;
    const day = lastDay.getDate() - diff;
    return new Date(year, month, day);
  }

  // N-ésima ocorrência (1-based)
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();

  // Quantos dias até a primeira ocorrência desse dia da semana
  const daysUntilFirst = (weekday - firstWeekday + 7) % 7;
  const nthDay = 1 + daysUntilFirst + (n - 1) * 7;

  // Verificar se o dia resultante ainda pertence ao mês
  const result = new Date(year, month, nthDay);
  if (result.getMonth() !== month) return null;

  return result;
}

/**
 * Calcula todas as datas de ocorrência de um ensaio em um dado mês/ano.
 */
export function getEnsaioDatesInMonth(
  recorrencia: Recorrencia,
  year: number,
  month: number
): Date[] {
  // Verificar restrição de mês antes de calcular datas
  if (!mesPermitido(month, recorrencia.restricaoMes)) {
    return [];
  }

  if (recorrencia.tipo === 'semanal') {
    // Toda semana no dia especificado
    const dates: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const daysUntilFirst = (recorrencia.diaDaSemana - firstWeekday + 7) % 7;
    let day = 1 + daysUntilFirst;

    while (true) {
      const d = new Date(year, month, day);
      if (d.getMonth() !== month) break;
      dates.push(d);
      day += 7;
    }

    return dates;
  }

  if (recorrencia.tipo === 'ordem_semana' && recorrencia.ordem) {
    const dates: Date[] = [];
    for (const n of recorrencia.ordem) {
      const d = getNthWeekdayOfMonth(year, month, recorrencia.diaDaSemana, n);
      if (d) dates.push(d);
    }
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }

  return [];
}

/**
 * Verifica se uma data é hoje.
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Verifica se uma data é nesta semana (segunda a domingo da semana atual).
 */
export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Calcular o início da semana (segunda-feira)
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  // Fim da semana (domingo)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return target >= monday && target <= sunday;
}

/**
 * Para um ensaio, retorna a próxima data de ocorrência (hoje ou futura).
 */
export function getNextOccurrence(ensaio: Ensaio): Date | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Verificar mês atual e próximos 3 meses
  for (let offset = 0; offset < 4; offset++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const dates = getEnsaioDatesInMonth(ensaio.recorrencia, year, month);

    for (const d of dates) {
      if (d >= today) return d;
    }
  }

  return null;
}

/**
 * Retorna string legível da regra de recorrência.
 * Ex: "4ª Quinta-feira do mês" ou "Todo Domingo"
 */
export function describeRecorrencia(recorrencia: Recorrencia): string {
  const diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira',
    'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
  ];

  const mesesNomes = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];

  const dia = diasSemana[recorrencia.diaDaSemana];

  let descricao = '';

  if (recorrencia.tipo === 'semanal') {
    descricao = `Todo ${dia}`;
  } else if (recorrencia.tipo === 'ordem_semana' && recorrencia.ordem) {
    const ordLabels = recorrencia.ordem.map((n) => {
      if (n === -1) return 'Última';
      return `${n}ª`;
    });
    descricao = `${ordLabels.join(' e ')} ${dia} do mês`;
  } else {
    return 'Recorrência desconhecida';
  }

  // Adicionar restrição de meses à descrição
  if (recorrencia.restricaoMes) {
    switch (recorrencia.restricaoMes.tipo) {
      case 'impar':
        descricao += ' (meses ímpares)';
        break;
      case 'par':
        descricao += ' (meses pares)';
        break;
      case 'especifico':
        if (recorrencia.restricaoMes.meses && recorrencia.restricaoMes.meses.length > 0) {
          const nomes = recorrencia.restricaoMes.meses.map((m) => mesesNomes[m - 1]);
          descricao += ` (${nomes.join(', ')})`;
        }
        break;
    }
  }

  return descricao;
}

/**
 * Formata uma data para exibição: "Qui, 23 de Jul"
 */
export function formatDate(date: Date): string {
  const diasAbrev = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const mesesAbrev = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];
  return `${diasAbrev[date.getDay()]}, ${date.getDate()} de ${mesesAbrev[date.getMonth()]}`;
}

/**
 * Calcula quantos dias faltam para uma data.
 */
export function daysUntil(date: Date): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
