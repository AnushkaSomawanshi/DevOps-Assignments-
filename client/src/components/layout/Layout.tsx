import { Toaster } from "@/components/ui/sonner";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  fullWidth?: boolean;
}

export function Layout({
  children,
  hideHeader = false,
  hideFooter = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default Layout;
