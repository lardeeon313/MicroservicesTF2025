using DepotService.Application.DTOs.DepotOperator.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Commands.DepotOperator.AddPackaing
{
    /// <summary>
    /// commando para agregar empaques a un pedido en el Depósito.
    /// </summary>
    public class AddPackagingCommand
    {
        public List<AddPackagingRequest> PackagingItems { get; set; } = [];
        public AddPackagingCommand(List<AddPackagingRequest> packagingItems)
        {
            PackagingItems = packagingItems;
        }
    }
}
