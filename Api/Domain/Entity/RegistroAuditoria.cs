using Api.Domain.Entity.Enums;
using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class RegistroAuditoria : EntityGenery
    {
        public int IdUsuario { get; set; }
        public TipoAccion Accion { get; set; }
        public NombreTabla NombreTabla { get; set; }
        public string DatosAnteriores { get; set; }
        public string DatosNuevos { get; set; }
        public DireccionIP DireccionIP { get; set; }
        public DateTime FechaCreada { get; set; } = DateTime.Now;
    }
}
