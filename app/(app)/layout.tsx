import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import NotificationScheduler from "@/components/NotificationScheduler";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NotificationScheduler />
      <div className="flex bg-base min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </AuthGuard>
  );
}
