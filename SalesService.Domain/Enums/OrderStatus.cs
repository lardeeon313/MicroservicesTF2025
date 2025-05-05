using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalesService.Domain.Enums
{
    public enum OrderStatus
    {
        Issued,     // Emitido
        Confirmed,  // Confirmado por depósito
        Canceled    // Cancelado por ventas
    }
}

