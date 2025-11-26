using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IdentityService.Infraestructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class newColumnMustCreatePassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MustCreatePassword",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MustCreatePassword",
                table: "AspNetUsers");
        }
    }
}
