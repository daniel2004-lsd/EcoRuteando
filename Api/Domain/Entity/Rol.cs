using Api.Domain.Entity.Enums;
using Api.Domain.Entity.genery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Rol : EntityGenery
    {
        public TipoRol Nombre { get; set; }
        public string Descripcion { get; set; }
    }
}
