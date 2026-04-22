namespace Api.Application.DTO.InputDTO
{
    public record UserCreateDto(
        string Name,
        string LastName,
        string Email,
        string Password
    );
}