using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DepotService.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DepotOrderItemEntity_DepotOrders_DepotOrderEntityDepotOrderId",
                table: "DepotOrderItemEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DepotOrderItemEntity",
                table: "DepotOrderItemEntity");

            migrationBuilder.RenameTable(
                name: "DepotOrderItemEntity",
                newName: "DepotOrderItems");

            migrationBuilder.RenameColumn(
                name: "DepotOrderId",
                table: "DepotOrderItems",
                newName: "SalesOrderItemId");

            migrationBuilder.RenameColumn(
                name: "DepotOrderEntityDepotOrderId",
                table: "DepotOrderItems",
                newName: "DepotOrderMissingId");

            migrationBuilder.RenameIndex(
                name: "IX_DepotOrderItemEntity_DepotOrderEntityDepotOrderId",
                table: "DepotOrderItems",
                newName: "IX_DepotOrderItems_DepotOrderMissingId");

            migrationBuilder.AlterColumn<string>(
                name: "DeliveryDetail",
                table: "DepotOrders",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RejectionReason",
                table: "DepotOrders",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "DepotOrderEntityId",
                table: "DepotOrderItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsReady",
                table: "DepotOrderItems",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PackagingType",
                table: "DepotOrderItems",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "DepotOrderItems",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DepotOrderItems",
                table: "DepotOrderItems",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "DepotOrderMissings",
                columns: table => new
                {
                    MissingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SalesOrderId = table.Column<int>(type: "int", nullable: false),
                    MissingReason = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MissingDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DescriptionResolution = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MissingDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DepotOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepotOrderMissings", x => x.MissingId);
                    table.ForeignKey(
                        name: "FK_DepotOrderMissings_DepotOrders_DepotOrderId",
                        column: x => x.DepotOrderId,
                        principalTable: "DepotOrders",
                        principalColumn: "DepotOrderId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DepotOrderMissingItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OrderMissingId = table.Column<int>(type: "int", nullable: false),
                    DepotOrderItemId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProductBrand = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Packaging = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MissingQuantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepotOrderMissingItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DepotOrderMissingItem_DepotOrderItems_DepotOrderItemId",
                        column: x => x.DepotOrderItemId,
                        principalTable: "DepotOrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DepotOrderMissingItem_DepotOrderMissings_OrderMissingId",
                        column: x => x.OrderMissingId,
                        principalTable: "DepotOrderMissings",
                        principalColumn: "MissingId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DepotOrders_AssignedDepotTeamId",
                table: "DepotOrders",
                column: "AssignedDepotTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_DepotOrderItems_DepotOrderEntityId",
                table: "DepotOrderItems",
                column: "DepotOrderEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_DepotOrderMissingItem_DepotOrderItemId",
                table: "DepotOrderMissingItem",
                column: "DepotOrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_DepotOrderMissingItem_OrderMissingId",
                table: "DepotOrderMissingItem",
                column: "OrderMissingId");

            migrationBuilder.CreateIndex(
                name: "IX_DepotOrderMissings_DepotOrderId",
                table: "DepotOrderMissings",
                column: "DepotOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_DepotOrderItems_DepotOrderMissings_DepotOrderMissingId",
                table: "DepotOrderItems",
                column: "DepotOrderMissingId",
                principalTable: "DepotOrderMissings",
                principalColumn: "MissingId");

            migrationBuilder.AddForeignKey(
                name: "FK_DepotOrderItems_DepotOrders_DepotOrderEntityId",
                table: "DepotOrderItems",
                column: "DepotOrderEntityId",
                principalTable: "DepotOrders",
                principalColumn: "DepotOrderId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DepotOrders_DepotTeams_AssignedDepotTeamId",
                table: "DepotOrders",
                column: "AssignedDepotTeamId",
                principalTable: "DepotTeams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DepotOrderItems_DepotOrderMissings_DepotOrderMissingId",
                table: "DepotOrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_DepotOrderItems_DepotOrders_DepotOrderEntityId",
                table: "DepotOrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_DepotOrders_DepotTeams_AssignedDepotTeamId",
                table: "DepotOrders");

            migrationBuilder.DropTable(
                name: "DepotOrderMissingItem");

            migrationBuilder.DropTable(
                name: "DepotOrderMissings");

            migrationBuilder.DropIndex(
                name: "IX_DepotOrders_AssignedDepotTeamId",
                table: "DepotOrders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DepotOrderItems",
                table: "DepotOrderItems");

            migrationBuilder.DropIndex(
                name: "IX_DepotOrderItems_DepotOrderEntityId",
                table: "DepotOrderItems");

            migrationBuilder.DropColumn(
                name: "RejectionReason",
                table: "DepotOrders");

            migrationBuilder.DropColumn(
                name: "DepotOrderEntityId",
                table: "DepotOrderItems");

            migrationBuilder.DropColumn(
                name: "IsReady",
                table: "DepotOrderItems");

            migrationBuilder.DropColumn(
                name: "PackagingType",
                table: "DepotOrderItems");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "DepotOrderItems");

            migrationBuilder.RenameTable(
                name: "DepotOrderItems",
                newName: "DepotOrderItemEntity");

            migrationBuilder.RenameColumn(
                name: "SalesOrderItemId",
                table: "DepotOrderItemEntity",
                newName: "DepotOrderId");

            migrationBuilder.RenameColumn(
                name: "DepotOrderMissingId",
                table: "DepotOrderItemEntity",
                newName: "DepotOrderEntityDepotOrderId");

            migrationBuilder.RenameIndex(
                name: "IX_DepotOrderItems_DepotOrderMissingId",
                table: "DepotOrderItemEntity",
                newName: "IX_DepotOrderItemEntity_DepotOrderEntityDepotOrderId");

            migrationBuilder.UpdateData(
                table: "DepotOrders",
                keyColumn: "DeliveryDetail",
                keyValue: null,
                column: "DeliveryDetail",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "DeliveryDetail",
                table: "DepotOrders",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DepotOrderItemEntity",
                table: "DepotOrderItemEntity",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DepotOrderItemEntity_DepotOrders_DepotOrderEntityDepotOrderId",
                table: "DepotOrderItemEntity",
                column: "DepotOrderEntityDepotOrderId",
                principalTable: "DepotOrders",
                principalColumn: "DepotOrderId");
        }
    }
}
