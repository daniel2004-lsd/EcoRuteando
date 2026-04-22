using Api.Domain.Enums;
using Api.Domain.Enums.genery;
using System;
using System.Collections.Generic;

namespace Api.Domain.Entities
{
        public class ReportValidation : EntityGenery
        {
            public int ProfileId { get; set; }

            public int ReportId { get; set; }
            public Profile Profile { get; set; }
            public ObstacleReport ObstacleReport { get; set; }
            public ConfirmationStatus ConfirmationStatus { get; set; }
            public DateTime VotedAt { get; set; } = DateTime.UtcNow;
            public bool Active { get; set; } = true;


    }
    }