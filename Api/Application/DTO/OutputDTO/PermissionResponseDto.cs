namespace Api.Application.DTO.OutputDTO
{
    public record PermissionResponseDto(
        string Name,
        string Description,
        bool Active
    );
}