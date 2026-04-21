using System;

namespace Api.Application.EntityDto
{
    public record PasswordRecoveryResponseDto(
        int UserId,
        string Code,
        DateTime ExpirationDate,
        bool IsUsed,
        bool Active
    );
}