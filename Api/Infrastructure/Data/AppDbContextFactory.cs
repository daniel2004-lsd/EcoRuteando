using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Api.Infrastructure.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        // Usamos localhost aquí porque las migraciones las lanzas tú desde la consola de tu PC
        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=ApiDb;Username=postgres;Password=Cuellar12345."
        );

        return new AppDbContext(optionsBuilder.Options);
    }
}