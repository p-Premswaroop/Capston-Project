using System.ComponentModel.DataAnnotations;

namespace Capstone.API.Models
{
    public class User
    {
        public string UserName { get; set; }
        [Required, StringLength(20)]
        public string Password { get; set; }
        public DateTime CreatedOn { get; set; }
        // Foreign key to the Role entity
        public int RoleId { get; set; }
        // Navigation property to the Role entity
        public Role Role { get; set; }
    }
}
