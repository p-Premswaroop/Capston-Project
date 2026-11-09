
using Capstone.DAL.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Capstone.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // after builder.Services.AddControllers();
          

            builder.Services.AddControllers();
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var config = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Issuer"],
            ValidAudience = config["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Key"]))
        };
    });



            var dbPath = Path.Combine(
Directory.GetParent(builder.Environment.ContentRootPath).FullName,
"Capstone.DAL",
"Database",
"ServiceDeskDB.db");

builder.Services.AddDbContext<HelpDeskDbContext>(options =>
options.UseSqlite($"Data Source={dbPath}"));

            builder.Services.AddDbContext<HelpDeskDbContext>();
            builder.Services.AddScoped<IRepository, Repository>();

            // ENABLE CORS

            var allowedOrigins = "_allowedOrigins";
            builder.Services.AddCors(options => { 

            options.AddPolicy(name: allowedOrigins,
            policy =>
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseCors(allowedOrigins);
            app.MapControllers();
            

            app.Run();
        }
    }
}
