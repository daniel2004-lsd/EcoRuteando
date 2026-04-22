using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Enums.genery
{

    public abstract class EntityGenery
    {
        public int Id { get; set; }
        public bool Active { get; set; } = true;
    }
}
