namespace Api.Application.EntityDto.end
{
    public record RoleResponseDto(
        string Name,
        string Description,
        bool Active
    );
}