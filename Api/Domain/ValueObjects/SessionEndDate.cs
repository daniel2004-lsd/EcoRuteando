using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.ValueObjects
{
    public class SessionEndDate
    {
        public DateTime Value { get; private set; }

        private SessionEndDate() { } 

        public SessionEndDate(DateTime value)
        {
            if (value < DateTime.UtcNow.AddYears(-1))
                throw new Exception("Fecha inválida");

            Value = value;
        }

        public static SessionEndDate Ahora()
        {
            return new SessionEndDate(DateTime.UtcNow);
        }
    }
}
