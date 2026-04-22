namespace Api.Application.DTO.OutputDTO
{
    public record RolePermissionResponseDto(
       string RoleName,
       string PermissionName,
       bool Active = true
        );
}