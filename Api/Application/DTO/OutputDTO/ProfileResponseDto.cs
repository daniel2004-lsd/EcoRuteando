namespace Api.Application.DTO.OutputDTO
{
    public record ProfileResponseDto(
        int SessionId,
        string PhoneNumber ,
        string ProfilePicture,
        bool Active
    );
}