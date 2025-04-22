using Microsoft.AspNetCore.Mvc;

namespace IdentityService.API.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
