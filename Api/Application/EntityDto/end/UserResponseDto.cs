namespace Api.Application.EntityDto.end
{
    public record UserResponseDto(
        string Name,
        string LastName,
        string Email,
        bool Active
    );
}