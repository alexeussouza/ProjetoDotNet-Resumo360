using ApiDespesas.Data;
using ApiDespesas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiDespesas.Extensions;
using System.Globalization;


namespace ApiDespesas.Control
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Injeta o contexto do banco via construtor
        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("despesas-por-categoria")]
        public async Task<IActionResult> DespesasPorCategoria([FromQuery] string? periodo)
        {
            DateTime dataLimite = CalcularDataLimite(periodo);
            var resultado = await _context.Despesas
                .Where(d => d.DataVencimento >= dataLimite)
                .GroupBy(d => d.Categoria)
                .Select(g => new
                {
                    Categoria = g.Key,
                    Total = g.Sum(d => d.Valor)
                })
                .ToListAsync();
            Console.WriteLine($"[LOG] Período: {periodo} | DataLimite: {dataLimite:u}"); // log para teste

            return Ok(resultado);
        }

        [HttpGet("receitas-por-categoria")]
        public async Task<IActionResult> ReceitasPorCategoria([FromQuery] string? periodo)
        {
            DateTime dataLimite = CalcularDataLimite(periodo);
            var resultado = await _context.Receitas
                .Where(d => d.DataRecebimento >= dataLimite)
                .GroupBy(r => r.Categoria)
                .Select(g => new
                {
                    Categoria = g.Key,
                    Total = g.Sum(r => r.Valor)
                })
                .ToListAsync();

            return Ok(resultado);
        }

        [HttpGet("saldo-historico")]
        public async Task<IActionResult> SaldoHistorico([FromQuery] string? periodo)
        {
            DateTime dataLimite = CalcularDataLimite(periodo);

            var receitas = await _context.Receitas
                .Where(r => r.DataRecebimento >= dataLimite)
                .ToListAsync();

            var despesas = await _context.Despesas
                .Where(d => d.DataVencimento >= dataLimite)
                .ToListAsync();

            var receitasAgrupadas = receitas
                .GroupBy(r => r.DataRecebimento.ToString("MMM/yy", CultureInfo.InvariantCulture))
                .Select(g => new { Mes = g.Key, Total = g.Sum(r => r.Valor) });

            var despesasAgrupadas = despesas
                .GroupBy(d => d.DataVencimento.ToString("MMM/yy", CultureInfo.InvariantCulture))
                .Select(g => new { Mes = g.Key, Total = g.Sum(d => d.Valor) });

            var saldo = receitasAgrupadas
                .Select(r => new
                {
                    Mes = r.Mes,
                    Saldo = r.Total - (despesasAgrupadas.FirstOrDefault(d => d.Mes == r.Mes)?.Total ?? 0)
                })
                .OrderBy(s => DateTime.ParseExact(s.Mes, "MMM/yy", CultureInfo.InvariantCulture));

            return Ok(saldo);
        }

        [HttpGet("compras-cartao")]
        public async Task<IActionResult> ComprasPorCartao([FromQuery] string? periodo)
        {
            DateTime dataLimite = CalcularDataLimite(periodo);
            var resultado = await _context.ComprasCartao
                .GroupBy(c => c.NomeCartao)
                .Select(g => new
                {
                    Cartao = g.Key,
                    Total = g.Sum(c => c.Valor)
                })
                .ToListAsync();

            return Ok(resultado);
        }

        private DateTime CalcularDataLimite(string? periodo)
        {
            var hojeUtc = DateTime.UtcNow;
            var dataBase = periodo switch
            {
                "6m" => hojeUtc.AddMonths(-6),
                "1a" => hojeUtc.AddYears(-1),
                _ => hojeUtc.AddMonths(-3)
            };

            return new DateTime(dataBase.Year, dataBase.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }
    }
}