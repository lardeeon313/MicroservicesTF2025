using SalesService.Application.Commands;
using SalesService.Application.Exceptions;

namespace SalesService.Application.Validations
{
    public static class CreateOrderValidator
    {
        public static void Validate(CreateOrderCommand cmd)
        {
            if (string.IsNullOrWhiteSpace(cmd.CustomerEmail))
                throw new ValidationException("Customer email is required.");
            if (!cmd.CustomerEmail.Contains("@"))
                throw new ValidationException("Customer email is invalid.");
            if (cmd.Products == null || !cmd.Products.Any())
                throw new ValidationException("At least one product is required.");
            foreach (var p in cmd.Products)
            {
                if (p.Quantity <= 0)
                    throw new ValidationException("Quantity must be greater than zero.");
                if (p.UnitPrice <= 0)
                    throw new ValidationException("Unit price must be greater than zero.");
            }
        }
    }
}
