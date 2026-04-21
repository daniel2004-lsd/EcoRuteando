namespace Api.Application.EntityDto.end
{
    public record RolePermissionResponseDto(
       string RoleName,
       string PermissionName,
       bool Active = true
        );
}