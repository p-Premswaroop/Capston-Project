using Capstone.DAL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Repository
{
    public interface IRepository
    {
        public bool Authenticate(User user);

        public List<ServiceRequest> ViewRequests();

        public List<ServiceRequest> ViewRequests(string userName);

        public int RaiseRequest(ServiceRequest newRequest);

        public ServiceRequest GetRequestByld(int requestld);

        public bool ReOpenRequest(ServiceRequest request);

        public List<ServiceRequest> GetRequestBySP(string userName);

        public bool CloseRequest(int requestld);

        public bool DeleteRequest(int requestld);

        public User GetUser(string userName);
    }
}
