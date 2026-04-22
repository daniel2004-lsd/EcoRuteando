namespace Api.Application.DTO.OutputDTO
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