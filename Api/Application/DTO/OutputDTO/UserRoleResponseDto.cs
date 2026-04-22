namespace Api.Application.DTO.OutputDTO
{
    public record UserRoleResponseDto(
        string RoleName,
        string UserEmail,
        bool Active = true
    );
}