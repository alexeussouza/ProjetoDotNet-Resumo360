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
    public class CartoesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartoesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("compras")]
        public async Task<ActionResult<IEnumerable<CompraCartao>>> GetCompras()
        {
            return await _context.ComprasCartao.ToListAsync();
        }

        [HttpGet("compras/{id}")]
        public async Task<ActionResult<CompraCartao>> GetCompraById(Guid id)
        {
            var compra = await _context.ComprasCartao.FindAsync(id);
            if (compra == null) return NotFound();
            return compra;
        }

        [HttpPost("compras")]
        public async Task<ActionResult> PostCompra([FromBody] CompraCartao model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.DataCompra = model.DataCompra.EnsureUtc();
            _context.ComprasCartao.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCompraById), new { id = model.Id }, model);
        }

        [HttpPut("compras/{id}")]
        public async Task<ActionResult> PutCompra(Guid id, [FromBody] CompraCartao model)
        {
            if (id != model.Id) return BadRequest();
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("compras/{id}")]
        public async Task<ActionResult> DeleteCompra(Guid id)
        {
            var compra = await _context.ComprasCartao.FindAsync(id);
            if (compra == null) return NotFound();
            _context.ComprasCartao.Remove(compra);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
