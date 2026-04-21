using System;

namespace Api.Application.EntityDto
{
    public record PasswordRecoveryCreateDto(
        int UserId,
        string Code,
        DateTime ExpirationDate
    );
}