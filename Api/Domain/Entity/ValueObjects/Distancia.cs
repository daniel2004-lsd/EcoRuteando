using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Distancia
    {
        public decimal Valor { get; private set; }

        private Distancia() { }

        public Distancia(decimal valor)
        {
            if (valor <= 0)
                throw new Exception("Distancia inválida");

            Valor = valor;
        }
    }
}
