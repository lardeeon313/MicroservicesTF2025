using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesService.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Packaging",
                table: "OrderItems",
                newName: "PackagingType");

            migrationBuilder.CreateTable(
                name: "OrderMissings",
                columns: table => new
                {
                    MissingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MissingReason = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MissingDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MissingDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DescriptionResolution = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderMissings", x => x.MissingId);
                    table.ForeignKey(
                        name: "FK_OrderMissings_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrderMissingItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OrderMissingId = table.Column<int>(type: "int", nullable: false),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    MissingQuantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderMissingItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderMissingItems_OrderItems_OrderItemId",
                        column: x => x.OrderItemId,
                        principalTable: "OrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderMissingItems_OrderMissings_OrderMissingId",
                        column: x => x.OrderMissingId,
                        principalTable: "OrderMissings",
                        principalColumn: "MissingId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OrderMissingItems_OrderItemId",
                table: "OrderMissingItems",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderMissingItems_OrderMissingId",
                table: "OrderMissingItems",
                column: "OrderMissingId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderMissings_OrderId",
                table: "OrderMissings",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderMissingItems");

            migrationBuilder.DropTable(
                name: "OrderMissings");

            migrationBuilder.RenameColumn(
                name: "PackagingType",
                table: "OrderItems",
                newName: "Packaging");
        }
    }
}
