using ApiDespesas.Data;
using ApiDespesas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiDespesas.Extensions;

namespace ApiDespesas.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("receitas-do-mes")]
        public async Task<IActionResult> ReceitasDoMes()
        {
            var hoje = DateTime.UtcNow;
            var mesAtual = new DateTime(hoje.Year, hoje.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var resumo = await _context.ResumoMensal
                .FirstOrDefaultAsync(r => r.Mes == mesAtual);

            return Ok(new { total = resumo?.TotalReceitas ?? 0 });
        }

        [HttpGet("despesas-do-mes")]
        public async Task<IActionResult> DespesasDoMes()
        {
            var hoje = DateTime.UtcNow;
            var mesAtual = new DateTime(hoje.Year, hoje.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var resumo = await _context.ResumoMensal
                .FirstOrDefaultAsync(r => r.Mes == mesAtual);

            return Ok(new { total = resumo?.TotalDespesas ?? 0 });
        }

        [HttpGet("saldo-do-mes")]
        public async Task<IActionResult> SaldoDoMes()
        {
            var hoje = DateTime.UtcNow;
            var mesAtual = new DateTime(hoje.Year, hoje.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var resumo = await _context.ResumoMensal
                .FirstOrDefaultAsync(r => r.Mes == mesAtual);

            return Ok(new { saldo = resumo?.Saldo ?? 0 });
        }

        [HttpGet("contas-vencidas")]
        public async Task<IActionResult> ContasVencidas()
        {
            var hojeUtc = DateTime.UtcNow.Date.AddDays(1).AddTicks(-1); // 23:59:59.9999999

            var total = await _context.Despesas
                .Where(d => d.DataVencimento < hojeUtc && d.Status == StatusDespesa.Pendente)
                .CountAsync();

            return Ok(new { total });
        }

        [HttpGet("contas-a-vencer")]
        public async Task<IActionResult> ContasAVencer()
        {

            var hoje = DateTime.UtcNow.Date.AddDays(1).AddTicks(-1); // fim do dia
            var daqui5dias = hoje.AddDays(5).AddDays(1).AddTicks(-1); // → 2025-06-27T23:59:59.9999999

            var total = await _context.Despesas
                .Where(d => d.DataVencimento > hoje && d.DataVencimento <= daqui5dias && d.Status == StatusDespesa.Pendente)
                .CountAsync();

            return Ok(new { total });
        }

        [HttpGet("resumo-mensal-todos")]
        public async Task<IActionResult> GetResumoMensalCompleto()
        {
            var lista = await _context.ResumoMensal
                .OrderBy(r => r.Mes)
                .ToListAsync();

            return Ok(lista);
        }
    }
}