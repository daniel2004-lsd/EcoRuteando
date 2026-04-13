using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Tiempo
    {
        public int Minutos { get; private set; }

        private Tiempo() { }

        public Tiempo(int minutos)
        {
            if (minutos <= 0)
                throw new Exception("Tiempo inválido");

            Minutos = minutos;
        }
    }
}
