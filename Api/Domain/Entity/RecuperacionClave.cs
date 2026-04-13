using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class RecuperacionClave : EntityGenery
    {
        public int IdUsuario { get; set; }
        public CodigoRecuperacion CodigoTemporal { get; set; }
        public FechaExpiracion FechaExpiracion { get; set; }
        public bool Usado { get; set; }
    }
}
