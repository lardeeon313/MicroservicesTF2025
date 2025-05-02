namespace SalesService.Application.Commands.Customer
{
    public class RegisterCustomerCommand
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Phonenumber { get; set; }= null!;


    }
}
