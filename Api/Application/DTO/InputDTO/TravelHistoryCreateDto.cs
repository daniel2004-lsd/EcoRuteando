namespace Api.Application.DTO.InputDTO
{
    public record TravelHistoryCreateDto(
        int ProfileId,
        int RouteId,
        double CO2Saved,
        int TotalSeconds,
        bool IsCompleted
    );
}