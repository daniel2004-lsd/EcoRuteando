namespace Api.Application.DTO.InputDTO
{
    public record RouteCreateDto(
        string Name,
        string Description,
        string PathJson,
        double DistanceKm,
        int EstimatedMinutes,
        int CreatedBy,
        bool Active = true
    );
}