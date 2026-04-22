namespace Api.Application.DTO.InputDTO
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