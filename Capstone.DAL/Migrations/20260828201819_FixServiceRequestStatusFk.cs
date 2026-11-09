using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FixServiceRequestStatusFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequests_Statuses_StatusId",
                table: "ServiceRequests");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequests_StatusId",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "ServiceRequests");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_ReqStatus",
                table: "ServiceRequests",
                column: "ReqStatus");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequests_Statuses_ReqStatus",
                table: "ServiceRequests",
                column: "ReqStatus",
                principalTable: "Statuses",
                principalColumn: "StatusId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceRequests_Statuses_ReqStatus",
                table: "ServiceRequests");

            migrationBuilder.DropIndex(
                name: "IX_ServiceRequests_ReqStatus",
                table: "ServiceRequests");

            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "ServiceRequests",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceRequests_StatusId",
                table: "ServiceRequests",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceRequests_Statuses_StatusId",
                table: "ServiceRequests",
                column: "StatusId",
                principalTable: "Statuses",
                principalColumn: "StatusId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
