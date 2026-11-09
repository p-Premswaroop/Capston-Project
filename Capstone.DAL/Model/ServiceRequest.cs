using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Model
{
    public class ServiceRequest
    {
        [Key]
        public int RequestId { get; set; }
        public string Description { get; set; }
        public string Details { get; set; }
        public string RaisedBy { get; set; }
        public DateTime RaisedOn { get; set; }= DateTime.UtcNow;
        public string Justification { get; set; }="NA";
        //Foreign key property to the Status entity

        public int ReqStatus { get; set; }=1; // 1-> new 2->closed 3->reopen
        // Navigation property to the Status entity
        public Status? Status { get; set; }
    }
}
