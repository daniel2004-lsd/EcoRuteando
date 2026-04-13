using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class AsuntoTicket
    {
        public string Valor { get; }

        private AsuntoTicket() { }

        public AsuntoTicket(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("El asunto no puede estar vacío");

            if (valor.Length < 5)
                throw new Exception("El asunto es demasiado corto");

            if (valor.Length > 100)
                throw new Exception("El asunto es demasiado largo");

            Valor = valor.Trim();
        }

        public override string ToString() => Valor;
    }
}
