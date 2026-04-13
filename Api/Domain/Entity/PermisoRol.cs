using Api.Domain.Entity.genery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class PermisoRol : EntityGenery
    {
        public int Rol { get; set; }
        public int Permiso { get; set; }
    }
}
