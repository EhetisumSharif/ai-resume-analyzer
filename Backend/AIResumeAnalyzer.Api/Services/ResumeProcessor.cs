using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using ImageMagick;
using System.Text;
using System.IO;

namespace AIResumeAnalyzer.Api.Services
{
    public class ResumeProcessor
    {
        public string ExtractTextFromPdf(Stream pdfStream)
        {
            pdfStream.Position = 0;
            using PdfReader reader = new PdfReader(pdfStream);
            StringBuilder text = new StringBuilder();

            for (int i = 1; i <= reader.NumberOfPages; i++)
            {
                text.Append(PdfTextExtractor.GetTextFromPage(reader, i));
            }
            return text.ToString();
        }
        public string GeneratePreviewImage(Stream pdfStream, string outputDirectory, string fileNameWithoutExt)
        {
            pdfStream.Position = 0;
            var settings = new MagickReadSettings { Density = new Density(150) };

            using var images = new MagickImageCollection();
            images.Read(pdfStream, settings);

            var firstPage = images[0];
            firstPage.Format = MagickFormat.Png;

            if (!Directory.Exists(outputDirectory))
            {
                Directory.CreateDirectory(outputDirectory);
            }

            string outputPath = System.IO.Path.Combine(outputDirectory, $"{fileNameWithoutExt}_preview.png");
            firstPage.Write(outputPath);

            return outputPath;
        }
    }
}