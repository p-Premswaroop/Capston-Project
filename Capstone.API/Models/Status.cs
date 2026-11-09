using System.ComponentModel.DataAnnotations;

namespace Capstone.API.Models
{
    public class Status
    {
        public int StatusId { get; set; }
        [Required,StringLength(50)]
        public string Description { get; set; }
    }
}
