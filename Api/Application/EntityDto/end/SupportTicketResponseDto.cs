using System;

namespace Api.Application.EntityDto
{
    public record SupportTicketResponseDto(
        int ProfileId,
        string Subject,
        string Priority,
        DateTime CreatedAt,
        bool Active
    );
}