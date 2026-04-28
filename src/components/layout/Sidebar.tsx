import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainCircuit, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden h-screen flex-col border-r bg-sidebar text-sidebar-foreground lg:flex transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <div className="flex h-16 items-center border-b px-3 justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-5 w-5" />
            </div>
            {!collapsed && <span className="text-lg tracking-tight">Demo</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className={cn("flex-1 py-4", collapsed ? "overflow-visible" : "overflow-y-auto")}>
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              if (item.items) {
                return (
                  <div key={item.title} className="mt-4 first:mt-0">
                    {collapsed ? (
                      <div className="relative group">
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            item.items.some((sub) => pathname === sub.href)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                        </div>
                        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute left-full top-0 ml-1 z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md">
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {item.title}
                          </div>
                          {item.items.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                className={cn(
                                  "flex items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                  isSubActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground",
                                )}
                              >
                                {subItem.title}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-1 px-3 py-2 text-sm font-semibold tracking-wider text-muted-foreground flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.title}
                        </div>
                        <div className="grid gap-1">
                          {item.items.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                className={cn(
                                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                  isSubActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                <span className="pl-6">{subItem.title}</span>
                                {isSubActive && (
                                  <motion.div
                                    layoutId="active-nav"
                                    className="absolute left-0 h-full w-1 rounded-r-md bg-primary"
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              if (collapsed) {
                return (
                  <Tooltip key={item.href || item.title}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href || "#"}
                        className={cn(
                          "relative flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {isActive && (
                          <motion.div
                            layoutId="active-nav"
                            className="absolute left-0 h-full w-1 rounded-r-md bg-primary"
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href || item.title}
                  to={item.href || "#"}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 h-full w-1 rounded-r-md bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  );
}
