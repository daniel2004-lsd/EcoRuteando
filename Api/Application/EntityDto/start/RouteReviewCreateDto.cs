namespace Api.Application.EntityDto
{
    public record RouteReviewCreateDto(
        int ProfileId,
        int RouteId,
        int Rating,
        string Comment
    );
}