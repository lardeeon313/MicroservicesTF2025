using AdminService.Domain.Enums;

namespace AdminService.API.RequestDtos
{
    public class UpdateEmployeeRequest
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Dni { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public EmployeeRole Role { get; set; }
        public EmployeeStatus Status { get; set; }
        public EmployeeSector Sector { get; set; }
    }
}
