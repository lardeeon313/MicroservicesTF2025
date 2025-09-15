using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DepotService.API.Migrations
{
    /// <inheritdoc />
    public partial class updateDepotOrderMissing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SalesOrderItemId",
                table: "DepotOrderMissingItem",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SalesOrderItemId",
                table: "DepotOrderMissingItem");
        }
    }
}
