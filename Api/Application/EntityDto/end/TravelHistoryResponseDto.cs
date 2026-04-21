namespace Api.Application.EntityDto
{
    public record TravelHistoryResponseDto(
        int ProfileId,
        int RouteId,
        double CO2SavedKg,
        string FormattedTime,
        bool IsCompleted,
        bool Active
    );
}