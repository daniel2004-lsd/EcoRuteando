using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
    public class Profile : EntityGenery
    {
        public int SessionId { get; set; }
        public Session Session { get; set; }
        public int ConfigurationId { get; set; }
        public Configuration Configuration { get; set; }
        public ICollection<Route> Routes { get; set; } = new List<Route>();
        public PhoneNumber PhoneNumber { get; set; }
        public UrlImagen ProfilePicture { get; set; }

        public bool Active { get; set; } = true;
        public ICollection<TravelHistory> TravelHistory { get; set; } = new List<TravelHistory>();
        public ICollection<PointOfInterest> PointOfInterest { get; set; } = new List<PointOfInterest>();

        public ICollection<ObstacleReport> ObstacleReport { get; set; } = new List<ObstacleReport>();

        public ICollection<ReportValidation> ReportValidation { get; set; } = new List<ReportValidation>();

        public ICollection<SupportTicket> SupportTickets { get; set; } = new List<SupportTicket>();
    }
}