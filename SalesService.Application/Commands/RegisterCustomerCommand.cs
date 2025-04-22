

namespace SalesService.Application.Commands
{
    public class RegisterCustomerCommand
    {
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
    }
}
