using System.Text.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;

namespace Api.Domain.Entity.ValueObjects
{
    public class RoutePath
    {
        public string SerializedPoints { get; private set; } = "[]";

        [NotMapped]
        public IEnumerable<Coordinates> Points => GetPoints();

        private RoutePath() { }

        public RoutePath(IEnumerable<Coordinates> points)
        {
            SerializedPoints = JsonSerializer.Serialize(points ?? new List<Coordinates>());
        }

        public IEnumerable<Coordinates> GetPoints()
        {
            return JsonSerializer.Deserialize<List<Coordinates>>(SerializedPoints) ?? new List<Coordinates>();
        }
    }
}