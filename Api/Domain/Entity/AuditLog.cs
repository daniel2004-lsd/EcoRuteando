using Api.Domain.Entity.Enums;
using Api.Domain.Entity.Enums.genery;
using Api.Domain.Entity.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;

namespace Api.Domain.Entity
{
    public class AuditLog : EntityGenery
    {
        public int UserId { get; set; }
        public ActionType Action { get; set; }
        public TableName TableName { get; set; }
        public string OldData { get; set; }
        public string NewData { get; set; }
        public IpAddress IpAddress { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}