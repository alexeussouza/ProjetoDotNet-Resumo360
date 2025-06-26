using ApiDespesas.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiDespesas.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Despesa> Despesas { get; set; }
        public DbSet<Receita> Receitas { get; set; }
        public DbSet<CompraCartao> ComprasCartao { get; set; }
        public DbSet<ResumoFinanceiroMensal> ResumoMensal { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Converte enums para string no banco
            modelBuilder
                .Entity<Despesa>()
                .Property(d => d.Status)
                .HasConversion<string>();

            modelBuilder
                .Entity<Receita>()
                .Property(r => r.Status)
                .HasConversion<string>();

            // Mapeia a VIEW como entidade sem chave
            modelBuilder
                .Entity<ResumoFinanceiroMensal>()
                .HasNoKey()
                .ToView("resumo_financeiro_mensal");
        }
    }
}
