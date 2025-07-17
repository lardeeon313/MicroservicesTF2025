using DepotService.Application.Commands.BillingManager.ExportInvoiceOrderPdf;
using DepotService.Domain.Entities;
using DepotService.Domain.IRepositories;
using DepotService.Infraestructure.Documents.Excel;
using DepotService.Infraestructure.Documents.Pdf;
using DepotService.Infraestructure.Documents.Word;
using DepotService.Infraestructure;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DepotService.Domain.Enums;

namespace DepotService.Test.Commands.BillingManager
{
    /// <summary>
    /// Tests unitarios para ExportInvoiceDocumentCommandHandler.
    /// </summary>
    public class ExportInvoiceDocumentHandlerTest
    {
        private readonly Mock<IDepotOrderRepository> _repositoryMock;
        private readonly Mock<DepotDbContext> _contextMock;
        private readonly Mock<InvoicePdfGenerator> _pdfGeneratorMock;
        private readonly Mock<InvoiceWordGenerator> _wordGeneratorMock;
        private readonly Mock<InvoiceExcelGenerator> _excelGeneratorMock;
        private readonly Mock<ILogger<ExportInvoiceDocumentCommandHandler>> _loggerMock;
        private readonly ExportInvoiceDocumentCommandHandler _handler;

        public ExportInvoiceDocumentHandlerTest()
        {
            _repositoryMock = new Mock<IDepotOrderRepository>();
            _contextMock = new Mock<DepotDbContext>(new DbContextOptions<DepotDbContext>());
            _pdfGeneratorMock = new Mock<InvoicePdfGenerator>();
            _wordGeneratorMock = new Mock<InvoiceWordGenerator>();
            _excelGeneratorMock = new Mock<InvoiceExcelGenerator>();
            _loggerMock = new Mock<ILogger<ExportInvoiceDocumentCommandHandler>>();

            _handler = new ExportInvoiceDocumentCommandHandler(
                _contextMock.Object,
                _repositoryMock.Object,
                _loggerMock.Object,
                _pdfGeneratorMock.Object,
                _wordGeneratorMock.Object,
                _excelGeneratorMock.Object
            );
        }

        /// <summary>
        /// ✅ Verifica que se genere correctamente un documento PDF cuando la orden existe.
        /// </summary>
        [Fact]
        public async Task ExportInvoiceHandleAsync_ShouldGeneratePdf_WhenTypeIsPdf()
        {
            // Arrange
            var order = new DepotOrderEntity { DepotOrderId = 1 };
            var expectedBytes = new byte[] { 1, 2, 3 };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            _pdfGeneratorMock.Setup(g => g.Generate(order))
                .Returns(expectedBytes);

            var command = new ExportInvoiceDocumentCommand(order.DepotOrderId, DocumentType.Pdf);

            // Act
            var result = await _handler.ExportInvoiceHandleAsync(command);

            // Assert
            result.Should().BeEquivalentTo(expectedBytes);

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
            _pdfGeneratorMock.Verify(g => g.Generate(order), Times.Once);
        }

        /// <summary>
        /// ✅ Verifica que se genere correctamente un documento Word cuando la orden existe.
        /// </summary>
        [Fact]
        public async Task ExportInvoiceHandleAsync_ShouldGenerateWord_WhenTypeIsWord()
        {
            // Arrange
            var order = new DepotOrderEntity { DepotOrderId = 2 };
            var expectedBytes = new byte[] { 4, 5, 6 };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            _wordGeneratorMock.Setup(g => g.Generate(order))
                .Returns(expectedBytes);

            var command = new ExportInvoiceDocumentCommand(order.DepotOrderId, DocumentType.Word);

            // Act
            var result = await _handler.ExportInvoiceHandleAsync(command);

            // Assert
            result.Should().BeEquivalentTo(expectedBytes);

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
            _wordGeneratorMock.Verify(g => g.Generate(order), Times.Once);
        }

        /// <summary>
        /// ✅ Verifica que se genere correctamente un documento Excel cuando la orden existe.
        /// </summary>
        [Fact]
        public async Task ExportInvoiceHandleAsync_ShouldGenerateExcel_WhenTypeIsExcel()
        {
            // Arrange
            var order = new DepotOrderEntity { DepotOrderId = 3 };
            var expectedBytes = new byte[] { 7, 8, 9 };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            _excelGeneratorMock.Setup(g => g.Generate(order))
                .Returns(expectedBytes);

            var command = new ExportInvoiceDocumentCommand(order.DepotOrderId, DocumentType.Excel);

            // Act
            var result = await _handler.ExportInvoiceHandleAsync(command);

            // Assert
            result.Should().BeEquivalentTo(expectedBytes);

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
            _excelGeneratorMock.Verify(g => g.Generate(order), Times.Once);
        }

        /// <summary>
        /// ❌ Verifica que lance una excepción si la orden no existe.
        /// </summary>
        [Fact]
        public async Task ExportInvoiceHandleAsync_ShouldThrow_WhenOrderNotFound()
        {
            // Arrange
            var command = new ExportInvoiceDocumentCommand(99, DocumentType.Pdf);

            _repositoryMock.Setup(r => r.GetByIdAsync(command.InvoiceOrderId))
                .ReturnsAsync((DepotOrderEntity?)null);

            // Act
            Func<Task> act = async () => await _handler.ExportInvoiceHandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                .WithMessage($"Invoice order with ID {command.InvoiceOrderId} not found.");

            _repositoryMock.Verify(r => r.GetByIdAsync(command.InvoiceOrderId), Times.Once);
        }

        /// <summary>
        /// ❌ Verifica que lance una excepción si se pasa un tipo de documento no soportado.
        /// </summary>
        [Fact]
        public async Task ExportInvoiceHandleAsync_ShouldThrow_WhenDocumentTypeIsInvalid()
        {
            // Arrange
            var order = new DepotOrderEntity { DepotOrderId = 4 };

            _repositoryMock.Setup(r => r.GetByIdAsync(order.DepotOrderId))
                .ReturnsAsync(order);

            var command = new ExportInvoiceDocumentCommand(order.DepotOrderId, (DocumentType)999);

            // Act
            Func<Task> act = async () => await _handler.ExportInvoiceHandleAsync(command);

            // Assert
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Unsupported document type: 999");

            _repositoryMock.Verify(r => r.GetByIdAsync(order.DepotOrderId), Times.Once);
        }
    }
}
