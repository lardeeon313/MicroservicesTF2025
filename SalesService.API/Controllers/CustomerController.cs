using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SalesService.Application.Commands.Customers.Delete;
using SalesService.Application.Commands.Customers.Register;
using SalesService.Application.Commands.Customers.Update;
using SalesService.Application.DTOs.Customer;
using SalesService.Application.Queries.Customers.GetAllCustomers;
using SalesService.Application.Queries.Customers.GetCustomer;
using SalesService.Application.Queries.Customers.GetCustomerByEmail;
using SalesService.Application.Queries.Customers.GetCustomerById;


namespace SalesService.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController(
        ICustomerDeleteCommandHandler customerDeleteCommandHandler,
        ICustomerRegisterCommandHandler customerRegisterCommandHandler,
        ICustomerUpdateCommandHandler customerUpdateCommandHandler,
        IGetCustomerByEmailQueryHandler getCustomerByEmailQueryHandler,
        IGetCustomerByIdQueryHandler getCustomerByIdQueryHandler,
        IGetAllCustomersQueryHandler getAllCustomersQueryHandler,
        IValidator<RegisterCustomerRequest> registerCustomerValidator,
        IValidator<UpdateCustomerRequest> updateCustomerValidator
        ) : ControllerBase
    {
        private readonly ICustomerDeleteCommandHandler _customerDeleteCommandHandler = customerDeleteCommandHandler;
        private readonly ICustomerRegisterCommandHandler _customerRegisterCommandHandler = customerRegisterCommandHandler;
        private readonly ICustomerUpdateCommandHandler _customerUpdateCommandHandler = customerUpdateCommandHandler;
        private readonly IGetCustomerByEmailQueryHandler _getCustomerByEmailQueryHandler = getCustomerByEmailQueryHandler;
        private readonly IGetCustomerByIdQueryHandler _getCustomerByIdQueryHandler = getCustomerByIdQueryHandler;
        private readonly IGetAllCustomersQueryHandler _getAllCustomersQueryHandler = getAllCustomersQueryHandler;
        private readonly IValidator<RegisterCustomerRequest> _registerCustomerValidator = registerCustomerValidator;
        private readonly IValidator<UpdateCustomerRequest> _updateCustomerValidator = updateCustomerValidator;


        /// <summary>
        /// Registra un nuevo cliente.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerRequest request)
        {
            var validationResult = await _registerCustomerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new RegisterCustomerCommand(
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber,
                request.Address
            );

            var result = await _customerRegisterCommandHandler.RegisterHandle(command);
            return result
                ? Ok(new { message = "Customer registered successfully." })
                : Conflict(new { error = "Failed to register customer." });
        }

        /// <summary>
        /// Actualiza los datos de un cliente.
        /// </summary>
        [HttpPut("update/{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
        {
            if (id != request.Id)
                return BadRequest(new { error = "Route ID and body ID do not match." });

            var validationResult = await _updateCustomerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                return BadRequest(errors);
            }

            var command = new UpdateCustomerCommand(
                request.Id,
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber,
                request.Address
            );

            var result = await _customerUpdateCommandHandler.UpdateHandle(command);
            return result
                ? Ok(new { message = "Customer updated successfully." })
                : BadRequest(new { error = "Failed to update customer." });
        }

        /// <summary>
        /// Elimina un cliente por ID.
        /// </summary>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            var command = new DeleteCustomerCommand(id);

            var result = await _customerDeleteCommandHandler.DeleteHandle(command);

            return result
                ? Ok(new { message = "Customer deleted successfully." })
                : BadRequest(new { error = "Failed to delete customer." });
        }

        /// <summary>
        /// Obtiene un cliente por su ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            var query = new GetCustomerByIdQuery(id);

            var customer = await _getCustomerByIdQueryHandler.HandleAsync(query);

            return customer is not null
                ? Ok(customer)
                : NotFound(new { message = "Customer not found." });
        }

        /// <summary>
        /// Obtiene todos los clientes.
        /// </summary>
        [HttpGet("all")]
        [ProducesResponseType(typeof(IEnumerable<CustomerResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _getAllCustomersQueryHandler.HandleAsync();
            return Ok(customers);
        }

        /// <summary>
        /// Obtiene un cliente por su email.
        /// </summary>
        [HttpGet("by-email")]
        [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCustomerByEmail([FromQuery] string email)
        {
            var query = new GetCustomerByEmailQuery(email);
            var customer = await _getCustomerByEmailQueryHandler.HandleAsync(query);
            
            return customer is not null
                ? Ok(customer)
                : NotFound(new { message = "Customer not found with that email." });
        }

    }
}
