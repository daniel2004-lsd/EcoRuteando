
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    namespace Api.Domain.Entity.ValueObjects
    {
        public class FechaFinSesion
        {
            public DateTime Value { get; }

            public FechaFinSesion(DateTime value)
            {
                if (value < DateTime.UtcNow.AddYears(-1))
                    throw new Exception("Fecha inválida");

                Value = value;
            }

            public static FechaFinSesion Ahora()
            {
                return new FechaFinSesion(DateTime.UtcNow);
            }
        }
    }
}
