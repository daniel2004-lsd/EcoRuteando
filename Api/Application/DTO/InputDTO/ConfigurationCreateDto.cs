namespace Api.Application.DTO.InputDTO
{
    public record ConfigurationCreateDto(
        int LanguageId,
        int BackgroundColorId
    );
}