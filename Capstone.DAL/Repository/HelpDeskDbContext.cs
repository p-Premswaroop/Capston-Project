using Capstone.DAL.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Capstone.DAL.Repository
{
    public class HelpDeskDbContext: DbContext
    {
        public HelpDeskDbContext(DbContextOptions<HelpDeskDbContext> options) : base(options)
        {

        }
        public class HelpDeskDbContextFactory : IDesignTimeDbContextFactory<HelpDeskDbContext>
        {
            public HelpDeskDbContext CreateDbContext(string[] args)
            {
                var options = new DbContextOptionsBuilder<HelpDeskDbContext>().UseSqlite("Data Source=Database\\ServiceDeskDB.db").Options;
                return new HelpDeskDbContext(options);

            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Status)
                .WithMany()
                .HasForeignKey(sr => sr.ReqStatus);


            modelBuilder.Entity<User>()
       .Property(u => u.CreatedOn)
       .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<Status> Statuses { get; set; }

    }
}
