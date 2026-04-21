using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.Entity
{
    public class User : EntityGenery
    {
        public Username Name { get; set; }
        public string LastName { get; set; }
        public Password Password { get; set; }
        public Email Email { get; set; }
    }
}
