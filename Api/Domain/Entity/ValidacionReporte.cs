using Api.Domain.Entity.Enums;
using Api.Domain.Entity.genery;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class ValidacionReporte : EntityGenery
    {
        public int IdPerfil { get; set; }
        public int IdReporte { get; set; }
        public Confirmado Confirmado { get; set; }
        public DateTime FechaVotacion { get; set; }= DateTime.Now;
    }
}

