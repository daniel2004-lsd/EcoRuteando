using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class ResenaRuta : EntityGenery
    {
        public int IdPerfil { get; set; }
        public int IdRuta { get; set; }
        public Calificacion Calificacion { get; set; }
        public string Comentario { get; set; }
        public DateTime FechaCreada { get; set; }= DateTime.Now;
    }
}
