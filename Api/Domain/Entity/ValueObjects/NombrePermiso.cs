using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity.ValueObjects
{
    public class NombrePermiso
    {
        public string Valor { get; private set; }

        private NombrePermiso() { }

        public NombrePermiso(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                throw new Exception("El nombre del permiso es obligatorio");

            if (!valor.Contains("_"))
                throw new Exception("Debe tener formato tipo: accion_recurso");

            Valor = valor;
        }
    }
}
