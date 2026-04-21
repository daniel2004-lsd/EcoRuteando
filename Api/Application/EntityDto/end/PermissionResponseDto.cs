namespace Api.Application.EntityDto.end
{
    public record PermissionResponseDto(
        string Name,
        string Description,
        bool Active
    );
}