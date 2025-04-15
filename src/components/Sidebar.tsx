import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Users, 
  User, 
  Settings,
  Battery,
  Wrench,
  LogOut,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      name: "Clientes",
      icon: <Users className="h-5 w-5" />,
      path: "/clientes",
    },
    {
      name: "Administradores",
      icon: <User className="h-5 w-5" />,
      path: "/administradores",
    },
    {
      name: "BESS",
      icon: <Battery className="h-5 w-5" />,
      path: "/bess",
    },
    {
      name: "Manutenções",
      icon: <Wrench className="h-5 w-5" />,
      path: "/manutencoes",
    },
    {
      name: "Perfil",
      icon: <Settings className="h-5 w-5" />,
      path: "/perfil",
    },
  ];

  const SidebarContent = () => (
    <div className={cn("h-full flex flex-col bg-brand-blue-dark text-white", 
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn("flex items-center p-4", 
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex-1">
            <h2 className="text-xl font-bold text-brand-orange">BESS Solar</h2>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-brand-blue-medium"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-brand-orange text-white"
                  : "text-white hover:bg-brand-blue-medium"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className={cn("p-3 border-t border-brand-blue-medium", 
        isCollapsed ? "flex justify-center" : ""
      )}>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-brand-blue-medium w-full",
            isCollapsed ? "px-1" : ""
          )}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
}
