export interface RelatorioMensal {
  mes: string; // ou Date, dependendo de como quer manipular
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}
