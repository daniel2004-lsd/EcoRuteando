namespace Api.Application.EntityDto.end
{
    public record ConfigurationResponseDto(
        string Language,
        string BackgroundColor,
        bool Active = true
    );
}