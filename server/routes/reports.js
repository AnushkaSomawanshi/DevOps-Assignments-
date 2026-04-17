import express from "express";
import PDFDocument from "pdfkit";
import * as xlsx from "xlsx";

const router = express.Router();

// Generate a dummy report in PDF or Excel format
router.get("/generate", (req, res) => {
  const format = req.query.format || "pdf";
  const type = req.query.type || "patient"; // patient, revenue, bill

  try {
    if (format === "pdf") {
      const doc = new PDFDocument();

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${type}_report.pdf`);

      doc.pipe(res);

      doc.fontSize(25).text("Gynecare Hospital Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`Report Type: ${type.toUpperCase()}`);
      doc.moveDown();

      // Report content based on type
      if (type === "patient") {
         doc.fontSize(12).text("Patient Name: Jane Doe");
         doc.text("Doctor Name: Dr. Emily Chen");
         doc.text("Diagnosis Summary: Routine Checkup - Healthy");
      } else if (type === "bill") {
         doc.fontSize(12).text("Patient Name: Jane Doe");
         doc.text("Consultation Fee: $50");
         doc.text("Lab Tests: $120");
         doc.text("Total: $170");
      } else if (type === "revenue") {
         doc.fontSize(12).text("Monthly Revenue: $15,000");
         doc.text("Total Patients: 320");
         doc.text("Top Department: Gynecology");
      }

      doc.end();

    } else if (format === "excel") {
      // Set response headers for Excel download
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=${type}_report.xlsx`);

      let data = [];
      if (type === "patient") {
        data = [{ Patient: "Jane Doe", Doctor: "Dr. Emily Chen", Diagnosis: "Routine Checkup" }];
      } else if (type === "bill") {
        data = [{ Item: "Consultation Fee", Cost: "$50" }, { Item: "Lab Tests", Cost: "$120" }, { Item: "Total", Cost: "$170" }];
      } else if (type === "revenue") {
        data = [{ Month: "Current", Revenue: "$15,000", Patients: 320, Department: "Gynecology" }];
      }

      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Report");

      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
      res.send(buffer);
    } else {
      res.status(400).json({ error: "Unsupported format" });
    }
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
