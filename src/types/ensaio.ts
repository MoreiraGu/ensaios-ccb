/**
 * Restrição de meses em que o ensaio acontece.
 * - "impar": apenas meses ímpares (Jan=1, Mar=3, Mai=5, Jul=7, Set=9, Nov=11)
 * - "par": apenas meses pares (Fev=2, Abr=4, Jun=6, Ago=8, Out=10, Dez=12)
 * - "especifico": apenas nos meses listados em `meses` (1-12)
 */
export interface RestricaoMes {
  tipo: 'impar' | 'par' | 'especifico';
  /** Usado apenas quando tipo === "especifico". Meses em que o ensaio acontece (1=Jan ... 12=Dez) */
  meses?: number[];
}

export interface Recorrencia {
  /** "ordem_semana" = N-ésima semana do mês | "semanal" = todo X dia da semana */
  tipo: 'ordem_semana' | 'semanal';
  /** 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb */
  diaDaSemana: number;
  /** Para "ordem_semana": quais semanas do mês (1-5, ou -1 para última). Ex: [4] = 4ª semana */
  ordem?: number[];
  /** Restrição de meses. Se ausente, o ensaio acontece em todos os meses. */
  restricaoMes?: RestricaoMes;
}

export interface Ensaio {
  id: string;
  igreja: string;
  regiao: 'Centro' | 'Sul' | 'Leste' | 'Oeste' | 'Norte' | 'Sudeste' | 'SFX' | 'Monteiro Lobato';
  horario: string;
  tipoEnsaio: string;
  endereco: string;
  mapsUrl: string;
  recorrencia: Recorrencia;
}

export type Regiao = 'Centro' | 'Sul' | 'Leste' | 'Oeste' | 'Norte' | 'Sudeste' | 'SFX' | 'Monteiro Lobato';

export type FiltroPeriodo = 'hoje' | 'semana' | 'todos';
