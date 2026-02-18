import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import RightPanel from "@/components/right-panel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen max-w-[600px] border-r border-border">
        <MobileNav />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <RightPanel />
    </div>
  );
}
