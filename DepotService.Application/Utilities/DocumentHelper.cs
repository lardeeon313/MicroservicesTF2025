using DepotService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DepotService.Application.Utilities
{
    public class DocumentHelper
    {
        public static string GetExtension(DocumentType type) => type switch
        {
            DocumentType.Pdf => "pdf",
            DocumentType.Excel => "xlsx",
            DocumentType.Word => "docx",
            _ => "dat"
        };

        public static string GetContentType(DocumentType type) => type switch
        {
            DocumentType.Pdf => "application/pdf",
            DocumentType.Excel => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            DocumentType.Word => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };
    }
}
