using System;

namespace Api.Application.DTO.OutputDTO
{
    public record AuditLogResponseDto(
        int UserId,
        string Action,
        string TableName,
        string OldData,
        string NewData,
        string IpAddress,
        DateTime CreatedAt,
        bool Active =  true
    );
}