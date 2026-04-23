import { getCalendarReport, getDelayAlerts, getSummaryReport } from "../services/reportService.js";

const escapeCsvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const summary = async (req, res, next) => {
  try {
    res.json(await getSummaryReport());
  } catch (error) {
    next(error);
  }
};

export const calendar = async (req, res, next) => {
  try {
    res.json(await getCalendarReport());
  } catch (error) {
    next(error);
  }
};

export const delayAlerts = async (req, res, next) => {
  try {
    res.json(await getDelayAlerts());
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const report = await getSummaryReport();
    const rows = [
      ["section", "label", "value"],
      ...report.leadSources.map((item) => ["lead_source", item.label, item.value]),
      ...report.statuses.map((item) => ["lead_status", item.label, item.value]),
      ...report.assignments.map((item) => ["assignment", item.label, item.value])
    ];

    const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="one99-reports.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportPdfPlaceholder = async (req, res) => {
  res.json({
    message: "PDF export hook ready. Integrate a renderer like pdfkit or Puppeteer for production PDF generation."
  });
};

