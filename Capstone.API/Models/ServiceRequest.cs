using System.ComponentModel.DataAnnotations;

namespace Capstone.API.Models
{
    public class ServiceRequest
    {
        public int RequestId { get; set; }
        [Required,StringLength(50)]
        public string Description { get; set; }
       
        [Required,StringLength(100)]
        public string Details { get; set; }
        
        [Required, StringLength(20)]
        public string? RaisedBy { get; set; }
      
        [Required,DataType(DataType.DateTime)]
        public DateTime RaisedOn { get; set; }= DateTime.Now;
        [Required,StringLength(50)]
        public string Justification { get; set; } = "NA";
        //Foreign key property to the Status entity
        public int ReqStatus { get; set; } = 1; // 1-> new 2->closed 3->reopen
        // Navigation property to the Status entity
        public Status? Status { get; set; } 
    }
}
