namespace Api.Application.DTO.OutputDTO
{
    public record UserResponseDto(
        string Name,
        string LastName,
        string Email,
        bool Active
    );
}