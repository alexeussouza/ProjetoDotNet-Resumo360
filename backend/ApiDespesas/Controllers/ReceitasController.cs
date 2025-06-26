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
    public class ReceitasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReceitasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Receita>>> Get()
        {
            return await _context.Receitas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Receita>> GetById(Guid id)
        {
            var receita = await _context.Receitas.FindAsync(id);
            if (receita == null) return NotFound();
            return receita;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Receita model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.DataRecebimento = model.DataRecebimento.EnsureUtc();
            // tratamento para data, evita erro timestamp with time zone no Postgres

            _context.Receitas.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(Guid id, [FromBody] Receita model)
        {
            if (id != model.Id) return BadRequest();
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var receita = await _context.Receitas.FindAsync(id);
            if (receita == null) return NotFound();
            _context.Receitas.Remove(receita);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
