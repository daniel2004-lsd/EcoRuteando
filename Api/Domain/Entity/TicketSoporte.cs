using Api.Domain.Entity.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class TicketSoporte : EntityGenery
    {
        public int IdPerfil { get; set; }
        public AsuntoTicket Asunto { get; set; }
        public PrioridadTicket Prioridad { get; set; }
        public DateTime CreadoEl { get; set; }= DateTime.Now;
    }
}
