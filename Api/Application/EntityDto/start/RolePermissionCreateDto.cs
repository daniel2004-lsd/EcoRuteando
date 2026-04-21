namespace Api.Application.EntityDto.start
{
    public record RolePermissionCreateDto(
        int RoleId,
        int PermissionId
    );
}