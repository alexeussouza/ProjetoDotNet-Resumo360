using System;
using System.ComponentModel.DataAnnotations;

namespace ApiDespesas.Models
{
    public class CompraCartao
    {
        public Guid Id { get; set; }

        [Required]
        public string Descricao { get; set; } 

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataCompra { get; set; }

        public string Categoria { get; set; }

        [Required]
        public string NomeCartao { get; set; }

        public int NumeroParcelas { get; set; }
    }
}
