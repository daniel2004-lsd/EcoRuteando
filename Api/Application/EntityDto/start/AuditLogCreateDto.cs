namespace Api.Application.EntityDto
{
    public record AuditLogCreateDto(
        int UserId,
        int ActionId,
        string TableName,
        string OldData,
        string NewData,
        string IpAddress
    );
}