namespace Api.Application.EntityDto.end
{
    public record UserRoleResponseDto(
        string RoleName,
        string UserEmail,
        bool Active = true
    );
}