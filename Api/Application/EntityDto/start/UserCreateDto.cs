namespace Api.Application.EntityDto.start
{
    public record UserCreateDto(
        string Name,
        string LastName,
        string Email,
        string Password
    );
}