using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DepotService.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalAmountToDepotOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "DepotOrders",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                table: "DepotOrderItems",
                type: "decimal(65,30)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "DepotOrders");

            migrationBuilder.DropColumn(
                name: "Total",
                table: "DepotOrderItems");
        }
    }
}
