using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class NombreLugar
    {
        public string Valor { get; private set; }

        private NombreLugar() { }

        public NombreLugar(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("Nombre requerido");

            Valor = valor;
        }
    }
}
