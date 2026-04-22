namespace Api.Application.DTO.InputDTO
{
    public record ProfileCreateDto(
        int SessionId,
        int ConfigurationId,
        string PhoneNumber = null,
        string ProfilePicture = null
    );
}