using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.Domain.ValueObjects
{
    public class Username
    {
        public string Value { get; }

        public Username(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new Exception("The name cannot be empty");

            if (value.Length < 2)
                throw new Exception("Name is too short");

            Value = value.Trim();
        }
    }
}
