using System;

namespace Api.Application.DTO.OutputDTO
{
    public record SupportTicketResponseDto(
        int ProfileId,
        string Subject,
        string Priority,
        DateTime CreatedAt,
        bool Active
    );
}