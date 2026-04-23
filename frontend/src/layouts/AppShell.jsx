import Sidebar from "../components/Sidebar";

const AppShell = ({ children }) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(185,56,31,0.12),_transparent_30%),linear-gradient(180deg,_#f6efe8,_#f9fafb)]">
    <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
      <Sidebar />
      <main className="min-h-screen flex-1 p-5 md:p-8">{children}</main>
    </div>
  </div>
);

export default AppShell;

