// Importações necessárias para acessar o banco, proteger rotas e manipular requisições HTTP
using ApiDespesas.Data;
using ApiDespesas.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiDespesas.Extensions;

namespace ApiDespesas.Controllers
{
    // Exige autenticação via JWT para acessar qualquer rota deste controller
    [Authorize]

    // Define que este é um controller de API e padroniza as respostas
    [ApiController]

    // Define o padrão de rota: api/Despesas
    [Route("api/[controller]")]
    public class DespesasController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Injeta o contexto do banco via construtor
        public DespesasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Despesas
        // Retorna todas as despesas salvas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Despesa>>> Get()
        {
            return await _context.Despesas.ToListAsync();
        }

        // GET: api/Despesas/{id}
        // Busca uma despesa específica por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Despesa>> GetById(Guid id)
        {
            var despesa = await _context.Despesas.FindAsync(id);
            if (despesa == null) return NotFound();
            return despesa;
        }

        // POST: api/Despesas
        // Cria uma nova despesa
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Despesa model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            model.DataVencimento = model.DataVencimento.EnsureUtc();
            _context.Despesas.Add(model);
            await _context.SaveChangesAsync();

            // Retorna status 201 e o caminho para acessar o recurso criado
            return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
        }

        // PUT: api/Despesas/{id}
        // Atualiza uma despesa existente
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(Guid id, [FromBody] Despesa model)
        {
            if (id != model.Id) return BadRequest();

            // Marca o objeto como modificado
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent(); // Status 204
        }

        // DELETE: api/Despesas/{id}
        // Remove uma despesa do banco
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var despesa = await _context.Despesas.FindAsync(id);
            if (despesa == null) return NotFound();

            _context.Despesas.Remove(despesa);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
