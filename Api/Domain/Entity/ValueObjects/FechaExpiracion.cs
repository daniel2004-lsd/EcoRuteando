using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class FechaExpiracion
    {
        public DateTime Valor { get; private set; }

        private FechaExpiracion() { }

        public FechaExpiracion(DateTime valor)
        {
            if (valor <= DateTime.UtcNow)
                throw new Exception("La fecha de expiración debe ser futura");

            Valor = valor;
        }

        public bool Expirado() => DateTime.UtcNow > Valor;
    }
}
