using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class CodigoRecuperacion
    {
        public string Valor { get; private set; }

        private CodigoRecuperacion() { }

        public CodigoRecuperacion(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("Código inválido");

            if (valor.Length < 6)
                throw new Exception("El código debe tener mínimo 6 caracteres");

            Valor = valor;
        }
    }
}
