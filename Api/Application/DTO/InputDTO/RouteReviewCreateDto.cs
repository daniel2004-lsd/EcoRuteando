namespace Api.Application.DTO.InputDTO
{
    public record RouteReviewCreateDto(
        int ProfileId,
        int RouteId,
        int Rating,
        string Comment
    );
}