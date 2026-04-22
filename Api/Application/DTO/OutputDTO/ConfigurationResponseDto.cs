namespace Api.Application.DTO.OutputDTO
{
    public record ConfigurationResponseDto(
        string Language,
        string BackgroundColor,
        bool Active = true
    );
}