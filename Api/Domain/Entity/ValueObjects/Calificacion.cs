using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class Calificacion
    {
        public int Valor { get; }

        public Calificacion(int valor)
        {
            if (valor < 1 || valor > 5)
                throw new Exception("Debe ser entre 1 y 5");

            Valor = valor;
        }
    }
}
