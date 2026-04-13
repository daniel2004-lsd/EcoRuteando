using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class CO2
    {
        public decimal Valor { get; private set; }

        private CO2() { }

        public CO2(decimal valor)
        {
            if (valor < 0)
                throw new Exception("El CO2 no puede ser negativo");

            Valor = valor;
        }
    }
}
