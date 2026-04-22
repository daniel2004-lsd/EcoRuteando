using System;

namespace Api.Application.DTO.OutputDTO
{
    public record RouteReviewResponseDto(
        int Id,
        int ProfileId,
        int RouteId,
        int Rating,
        string Comment,
        DateTime CreatedAt,
        bool Active = true
    );
}