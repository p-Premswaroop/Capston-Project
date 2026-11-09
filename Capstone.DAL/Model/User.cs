using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Model
{
    public class User
    {
        [Key]
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        // Foreign key to the Role entity
        public int RoleId { get; set; }
        // Navigation property to the Role entity
        public Role Role { get; set; }

    }
}
