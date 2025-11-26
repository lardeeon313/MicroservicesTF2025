using IdentityService.Domain.Enums;

namespace IdentityService.API.RequestsDtos
{
    public class ChangeEmployedStatusRequest
    {
        public string UserIdentityId { get; set; } = null!;
        public EmployedStatus NewStatus { get; set; }
    }
}
