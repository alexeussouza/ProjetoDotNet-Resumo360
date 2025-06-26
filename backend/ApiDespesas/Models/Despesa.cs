using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ApiDespesas.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum StatusDespesa
    {
        Pendente,
        Paga
    }

    public class Despesa
    {
        public Guid Id { get; set; }

        [Required]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataVencimento { get; set; }

        [Required]
        public StatusDespesa Status { get; set; }

        public string Categoria { get; set; }
    }
}
