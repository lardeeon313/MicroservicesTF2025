using IdentityService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IdentityService.Application.Queries.GetCurrentUser
{
    public interface IGetCurrentUserQueryHandler
    {
        Task<UserDto> GetCurrentUserHandler(GetCurrentUserQuery query);
    }
}
