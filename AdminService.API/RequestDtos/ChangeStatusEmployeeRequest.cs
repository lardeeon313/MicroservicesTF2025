using AdminService.Domain.Enums;

namespace AdminService.API.RequestDtos
{
    public class ChangeStatusEmployeeRequest
    {
        public int Id { get; set; }
        public EmployeeStatus Status { get; set; }        
    }
}
