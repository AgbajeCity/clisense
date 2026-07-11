import jsPDF from "jspdf";

interface SpecRow {
  label: string;
  value: string;
}

export const downloadCliNodeSpecPdf = (specs: SpecRow[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Header band
  doc.setFillColor(16, 122, 87);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Clisense CliNode v2.1", margin, 55);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Solar-powered IoT sensor for climate-smart agriculture", margin, 78);
  doc.text("Built from ~70% recycled e-waste · Field-tested across Sub-Saharan Africa", margin, 95);

  // Body
  doc.setTextColor(20, 20, 20);
  let y = 150;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Hardware specifications", margin, y);
  y += 10;
  doc.setDrawColor(220);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  specs.forEach((spec) => {
    if (y > 760) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 122, 87);
    doc.text(spec.label.toUpperCase(), margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(spec.value, pageW - margin * 2 - 140);
    doc.text(lines, margin + 140, y);
    y += Math.max(20, lines.length * 14 + 6);
  });

  // Deployment summary
  if (y > 680) {
    doc.addPage();
    y = margin;
  }
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text("Deployment context", margin, y);
  y += 10;
  doc.line(margin, y, pageW - margin, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const blurb = doc.splitTextToSize(
    "CliNode v2.1 is deployed across smallholder farm cooperatives and refugee settlements in Uganda, Kenya, Rwanda and Nigeria. Each node covers up to 4 hectares, transmits every 15 minutes via LoRaWAN with 2G/NB-IoT fallback, and feeds Clisense's Water-Energy-Food (WEF) Nexus AI engine. Insights are delivered back to farmers through SMS and voice in local languages.",
    pageW - margin * 2
  );
  doc.text(blurb, margin, y);
  y += blurb.length * 14 + 20;

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `© Clisense · Generated ${new Date().toLocaleDateString()} · clisense.vercel.app`,
    margin,
    820
  );

  doc.save("CliNode-v2.1-Specs.pdf");
};
