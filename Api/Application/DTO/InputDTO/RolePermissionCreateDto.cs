namespace Api.Application.DTO.InputDTO
{
    public record RolePermissionCreateDto(
        int RoleId,
        int PermissionId
    );
}