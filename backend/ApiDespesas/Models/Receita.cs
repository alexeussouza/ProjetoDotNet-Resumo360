using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace ApiDespesas.Models
{

     [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum StatusReceita
    {
        Pendente,
        Recebida
    }

    public class Receita
    {
        public Guid Id { get; set; }

        [Required]
        public string Descricao { get; set; }

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public DateTime DataRecebimento { get; set; }

        [Required]
        public StatusReceita Status { get; set; }

        public string Categoria { get; set; }

        public bool Recorrente { get; set; }
    }
}
