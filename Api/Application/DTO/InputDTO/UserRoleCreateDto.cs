namespace Api.Application.DTO.InputDTO
{
    public record UserRoleCreateDto(
        int RoleId,
        int UserId
    );
}