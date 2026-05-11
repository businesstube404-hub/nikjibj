import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Stethoscope, Star, Phone, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/3d-teeth", label: "نموذج الأسنان", icon: Stethoscope },
    { href: "/reviews", label: "آراء المرضى", icon: Star },
    { href: "/contact", label: "التواصل", icon: Phone },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">عيادة الأسنان المتخصصة</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden md:block">
            <Link href="/contact" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              احجز موعداً
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="border-t bg-card py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">عيادة الأسنان المتخصصة</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            نقدم أفضل خدمات العناية بالأسنان بأحدث التقنيات وبأعلى معايير الجودة في بيئة مريحة وآمنة.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
