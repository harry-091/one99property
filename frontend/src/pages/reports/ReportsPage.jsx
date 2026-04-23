import { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import ReportsPanel from "../../components/ReportsPanel";
import AppShell from "../../layouts/AppShell";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const ReportsPage = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [delays, setDelays] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [summaryData, calendarData, delayData] = await Promise.all([
          api.getSummaryReport(token),
          api.getCalendarReport(token),
          api.getDelayAlerts(token).catch(() => [])
        ]);
        setSummary(summaryData);
        setCalendar(calendarData);
        setDelays(delayData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadReports();
  }, [token]);

  return (
    <AppShell>
      <div className="space-y-6">
        <HeaderBar title="Reports & Insights" subtitle="Track lead source mix, pipeline status, funnel progression, and delay risk." />
        {error ? <div className="rounded-2xl bg-white px-4 py-3 text-sm text-rose-600 shadow-soft">{error}</div> : null}
        <ReportsPanel summary={summary} calendar={calendar} delays={delays} />
      </div>
    </AppShell>
  );
};

export default ReportsPage;

