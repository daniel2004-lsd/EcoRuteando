namespace Api.Application.EntityDto
{
    public record TravelHistoryCreateDto(
        int ProfileId,
        int RouteId,
        double CO2Saved,
        int TotalSeconds,
        bool IsCompleted
    );
}