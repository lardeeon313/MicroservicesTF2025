using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Enums
{
    public enum CustomerStatus
    {
        Active, // Compras en la semana actual
        Inactive, // No compra hace 2 semanas
        Lost, // No compra hace 3 meses
    }
}
