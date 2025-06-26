using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ApiDespesas.Models
{
    [Keyless]
    [Table("resumo_financeiro_mensal")]
    public class ResumoFinanceiroMensal
    {
        [Column("mes")]
        public DateTime Mes { get; set; }

        [Column("total_receitas")]
        public decimal TotalReceitas { get; set; }

        [Column("total_despesas")]
        public decimal TotalDespesas { get; set; }

        [Column("saldo")]
        public decimal Saldo { get; set; }
    }
}
