using Capstone.DAL.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Repository
{
    public class Repository:IRepository
    {
        private readonly HelpDeskDbContext _context;
        public Repository(HelpDeskDbContext context)
        {
            _context = context;
        }

        public bool Authenticate(User user)
        {
            try
            {
                if (user == null)
                {
                    return false;
                }

                var existingUser = _context.Users
                    .Where(u => u.UserName == user.UserName && u.Password == user.Password)
                    .FirstOrDefault();

                return existingUser != null;
            }
            catch
            {
                return false;
            }
        }

        public bool CloseRequest(int requestld)
        {
            
                try
                {
                    var existingRequest = _context.ServiceRequests.Find(requestld);
                    if (existingRequest == null)
                        return false;

                    existingRequest.ReqStatus = 2; // force status to 3 on 

                    _context.SaveChanges();
                    return true;
                }
                catch
                {
                    return false;
                }
            }

        public bool DeleteRequest(int requestld)
        {
            try
            {
                var request = _context.ServiceRequests.Find(requestld);
                if (request == null)
                {
                    return false; // Request not found
                }
                _context.ServiceRequests.Remove(request);
                _context.SaveChanges();
                return true; // Request deleted successfully

            }
            catch
            {
                return false; // An error occurred  
            }
        }

        public ServiceRequest GetRequestByld(int requestld)
        {
            try
            {
                var request = _context.ServiceRequests.Find(requestld);

                if (request == null)
                {
                    return null; // Request not found
                }
                return request; // Return the found request
            }
            catch
            {
                return null;
            }
        }

        public List<ServiceRequest> GetRequestBySP(string userName)
        {
            try
            {
                if (userName == null)
                {
                    return null; // Invalid username
                }
                var requests = _context.ServiceRequests
                    .Where(r => r.RaisedBy == userName)
                    .ToList();
                return requests;
            }
            catch
            {
                return null;
            }


        }

        public User GetUser(string userName)
        {
            try
            {
                return _context.Users
                   .Include(u => u.Role)
                   .FirstOrDefault(u => u.UserName == userName);

            }
            catch
            {
                return null; // Return null if an exception occurs
            }

        }

        public int RaiseRequest(ServiceRequest newRequest)
        {
            { 
                _context.ServiceRequests.Add(newRequest);
                _context.SaveChanges();
                return newRequest.RequestId;
            }
        }

        public bool ReOpenRequest(ServiceRequest request)
        {
            try
            {
                var existingRequest = _context.ServiceRequests.Find(request.RequestId);
                if (existingRequest == null)
                    return false;

                if (string.IsNullOrWhiteSpace(request.Justification))
                    return false;

                existingRequest.Justification = request.Justification;
                existingRequest.ReqStatus = 3; // force status to 3 on reopen

                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }




        public List<ServiceRequest> ViewRequests()
        {
            try
            {
                if (_context.ServiceRequests.ToList() == null)
                {
                    return null;
                }
            }
            catch (Exception ex)
            {

                return null;

            }
            return _context.ServiceRequests.ToList();

        }

        public List<ServiceRequest> ViewRequests(string userName)
        {
            try
            {
                if (userName == null)
                {
                    return null; // Invalid username
                }
                return _context.ServiceRequests
         .Where(x => x.RaisedBy.Contains(userName))
         .ToList();

            }
            catch
            {
                return null;
            }
        }
    }
}
