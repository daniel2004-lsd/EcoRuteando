namespace Api.Application.DTO.OutputDTO
{
    public record RoleResponseDto(
        string Name,
        string Description,
        bool Active
    );
}