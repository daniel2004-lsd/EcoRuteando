using Api.Domain.Enums;
using Api.Domain.Enums.genery;
using Api.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;

namespace Api.Domain.Entities
{
    public class AuditLog : EntityGenery
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public ActionType Action { get; set; }
        public TableName TableName { get; set; }
        public string OldData { get; set; }
        public string NewData { get; set; }
        public IpAddress IpAddress { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool Active { get; set; } = true;
    }
}