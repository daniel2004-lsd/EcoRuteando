namespace Api.Application.EntityDto.start
{
    public record ProfileCreateDto(
        int SessionId,
        int ConfigurationId,
        string PhoneNumber = null,
        string ProfilePicture = null
    );
}