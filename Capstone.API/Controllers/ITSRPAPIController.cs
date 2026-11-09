using Capstone.API.Models;
using Capstone.DAL.Model;
using Capstone.DAL.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Capstone.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ITSRPAPIController : ControllerBase
    {
        private readonly IRepository _repo;
        private readonly IConfiguration _configuration;
        public ITSRPAPIController(IRepository repo, IConfiguration configuration)
        {
            _repo = repo;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpGet("Authenticate")]
        public IActionResult Authenticate(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                return BadRequest("username and password are required.");

            var User = new Capstone.DAL.Model.User
            {
                UserName = username,
                Password = password
            };
            Console.WriteLine($"Authenticating user: {username}");

            var isAuthenticated = _repo.Authenticate(User);
            Console.WriteLine($"Authentication result for user {username}: {isAuthenticated}");
            if (!isAuthenticated) return Unauthorized();

            var dbUser = _repo.GetUser(username);
            var roleName = dbUser?.Role?.RoleName ?? string.Empty;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, roleName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(
                Convert.ToDouble(_configuration["Jwt:DurationInMinutes"] ?? "30"));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = jwt,
                expiration = expires,
                userName = username,
                roleName = roleName
            });
        }

        [Authorize(Roles = "Admin")]

        [HttpGet("GetAllRequest")]
        public IActionResult GetAllRequest()
        {
            var requests = _repo.ViewRequests();
            
                return Ok(requests);
            
          
        }
        [Authorize(Roles = "User,Admin")]
        [HttpGet("GetRequestByuserName")]
        public IActionResult GetRequestByUN(string username)
        {
            var requests = _repo.GetRequestBySP(username);
            
                return Ok(requests);
            
           
        }

        [Authorize(Roles = "User")]
        [HttpPost("reopen")]
        public IActionResult ReOpenRequest(Models.ServiceRequest request)
        {
            if (request.RequestId <= 0)
                return BadRequest("RequestId is required.");

            if (string.IsNullOrWhiteSpace(request.Justification))
                return BadRequest("Justification is required.");

            var serviceRequest = new DAL.Model.ServiceRequest
            {
                RequestId = request.RequestId,
                Justification = request.Justification
            };

            var isReopened = _repo.ReOpenRequest(serviceRequest);
            if (!isReopened) return BadRequest("Unable to reopen request.");

            return Ok(new { message = "Request reopened successfully." });
        }

        [Authorize(Roles = "User")]
        [HttpPost("CreateNewSerRequest")]
        public IActionResult Post(ServiceRequestSchema request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrWhiteSpace(userId))
                    return Unauthorized("User claim not found.");

                // Re-run validation with updated value
                if (!TryValidateModel(request))
                    return BadRequest(ModelState);


                var service = new DAL.Model.ServiceRequest
                {
                    Description = request.Description,
                    Details = request.Details,
                    RaisedBy = userId
                };

                var newId = _repo.RaiseRequest(service);

                if (newId < 1)
                    return BadRequest("Unable to create request.");

                return Ok(newId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize(Roles = "User")]
        [HttpGet("GetRequestById")]
        public IActionResult GetRequestById(int requestId)
        {
            var request = _repo.GetRequestByld(requestId);  
            return Ok(request);
        }

        [HttpGet("GetUser")]
        public IActionResult GetUser(string username)
        {
            var user = _repo.GetUser(username);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [Authorize(Roles = "User")]
        [HttpDelete("Delete")]
        public IActionResult Delete(int id)
        {
            var isDeleted = _repo.DeleteRequest(id);
            if (!isDeleted) return BadRequest("Unable to delete request.");
            return Ok(new { message = "Request deleted successfully." });
        }




        [Authorize(Roles = "Admin")]
        [HttpGet("CloseRequest")]
        public IActionResult CloseRequest(int requestId)
        {
            var isClosed = _repo.CloseRequest(requestId);
            if (!isClosed) return BadRequest("Unable to close request.");
            return Ok();
        }
    }
}
