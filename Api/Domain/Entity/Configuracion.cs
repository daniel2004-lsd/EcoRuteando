using Api.Domain.Entity.Enums;
using Api.Domain.Entity.genery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class Configuracion : EntityGenery
    {
        public Idioma Idioma { get; set; }
        public Tema ColorFondo { get; set; }
        
    }
}
