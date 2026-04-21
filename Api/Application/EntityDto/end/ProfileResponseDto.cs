namespace Api.Application.EntityDto.end
{
    public record ProfileResponseDto(
        int SessionId,
        string PhoneNumber ,
        string ProfilePicture,
        bool Active
    );
}