using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain
{
    public class Permiso : EntityGenery
    {
        public NombrePermiso Nombre { get; set; }
        public string Descripcion { get; set; }
    }
}
