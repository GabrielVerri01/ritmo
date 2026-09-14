import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import NotificationScheduler from "@/components/NotificationScheduler";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NotificationScheduler />
      <div className="flex bg-base h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 h-screen overflow-y-auto">{children}</div>
      </div>
    </AuthGuard>
  );
}
