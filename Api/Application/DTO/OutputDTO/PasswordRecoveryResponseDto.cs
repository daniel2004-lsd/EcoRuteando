using System;

namespace Api.Application.DTO.OutputDTO
{
    public record PasswordRecoveryResponseDto(
        int UserId,
        string Code,
        DateTime ExpirationDate,
        bool IsUsed,
        bool Active
    );
}