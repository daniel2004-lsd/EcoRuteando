using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class ApellidoUsuario
    {
        public string Valor { get; }

        public ApellidoUsuario(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("El apellido no puede estar vacío");

            Valor = valor.Trim();
        }
    }
}
