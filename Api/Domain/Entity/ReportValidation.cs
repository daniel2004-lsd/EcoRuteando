using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using System;

namespace Api.Domain.Entity
    {
        public class ReportValidation : EntityGenery
        {
            public int ProfileId { get; set; }
            public int ReportId { get; set; }
            public ConfirmationStatus ConfirmationStatus { get; set; }
            public DateTime VotedAt { get; set; } = DateTime.UtcNow;
            public bool Active { get; set; } = true;
        }
    }