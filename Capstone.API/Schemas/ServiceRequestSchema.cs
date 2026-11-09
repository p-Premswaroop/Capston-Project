using System.ComponentModel.DataAnnotations;

namespace Capstone.API.Models
{
    public class ServiceRequestSchema
    {
        [Required, StringLength(50)]
        public string Description { get; set; }

        [Required, StringLength(100)]
        public string Details { get; set; }

    }
}
