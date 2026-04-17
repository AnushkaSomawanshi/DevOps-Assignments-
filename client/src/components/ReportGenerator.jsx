import { useState } from "react";
import { Download, FileText, Sheet, Receipt, ChevronDown, MonitorPlay } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export default function ReportGenerator() {
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (format) => {
    // Generate URL targeting the backend report generator API
    const url = `/api/reports/generate?type=${selectedReport}&format=${format}`;
    window.open(url, "_blank");
  };

  const getPreviewMock = () => {
    if (selectedReport === "revenue") {
      return (
        <div className="font-mono text-sm">
          <p className="font-bold mb-2">== MONTHLY REVENUE REPORT ==</p>
          <p>Total Revenue: $15,000</p>
          <p>Total Patients: 320</p>
          <p>Top Performing Dept: Gynecology</p>
          <p className="mt-4 text-xs text-muted-foreground border-t pt-2">Generated centrally on {new Date().toLocaleDateString()}</p>
        </div>
      );
    }
    if (selectedReport === "patient") {
      return (
        <div className="font-mono text-sm">
          <p className="font-bold mb-2">== PATIENT DISCHARGE ==</p>
          <p>Patient Name: Jane Doe</p>
          <p>Doctor: Dr. Emily Chen</p>
          <p>Status: Healthy / Discharged</p>
          <p className="mt-4 text-xs text-muted-foreground border-t pt-2">Generated centrally on {new Date().toLocaleDateString()}</p>
        </div>
      );
    }
    return (
      <div className="font-mono text-sm">
        <p className="font-bold mb-2">== BILLING INVOICE ==</p>
        <p>Consultation Fee: $50</p>
        <p>Lab Tests: $120</p>
        <p className="font-bold border-t mt-2 pt-1 border-dashed">Total: $170</p>
        <p className="mt-4 text-xs text-muted-foreground border-t pt-2">Generated centrally on {new Date().toLocaleDateString()}</p>
      </div>
    );
  };

  return (
    <Card className="mt-6 border border-border shadow-hospital-lg card-elevated overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Main Controls */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold font-display text-lg text-foreground">Advanced Reporting</h3>
              </div>
              <p className="text-sm text-muted-foreground">Generate comprehensive PDFs and Excel sheets instantly.</p>
            </div>

            <div className="flex gap-2 p-1 bg-muted rounded-xl w-full max-w-sm">
              <button 
                onClick={() => setSelectedReport("revenue")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-smooth ${selectedReport === "revenue" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Revenue
              </button>
              <button 
                onClick={() => setSelectedReport("patient")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-smooth ${selectedReport === "patient" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Patients
              </button>
              <button 
                onClick={() => setSelectedReport("bill")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-smooth ${selectedReport === "bill" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Billing
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleDownload("pdf")} className="btn-primary gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
              <Button onClick={() => handleDownload("excel")} variant="outline" className="gap-2 w-full sm:w-auto border-accent text-accent hover:bg-accent/10">
                <Sheet className="h-4 w-4" /> Download Excel
              </Button>
              <Button onClick={() => setIsPreviewOpen(!isPreviewOpen)} variant="secondary" className="gap-2 w-full sm:w-auto">
                <FileText className="h-4 w-4" /> {isPreviewOpen ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Live Preview Area */}
            {isPreviewOpen && (
              <div className="bg-card p-4 rounded-xl border border-border mt-4 relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                <Badge variant="outline" className="mb-3 absolute top-3 right-3 text-[10px]">PREVIEW</Badge>
                {getPreviewMock()}
              </div>
            )}
          </div>

          {/* Video Explaination Mini-Widget */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-3">
             <div className="flex items-center gap-2 text-sm font-medium text-foreground">
               <Receipt className="h-4 w-4 text-accent" />
               Billing Guide
             </div>
             <div className="rounded-xl overflow-hidden border border-border shadow-sm aspect-video bg-black relative group">
                <iframe
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/9Vn7X8w0J4E"
                  title="How Hospital Billing Systems Work"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed mt-2 text-center">
               Watch a brief video on how modern hospital billing systems operate.
             </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
