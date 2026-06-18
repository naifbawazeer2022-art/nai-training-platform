import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  Zap,
  Calendar,
  User,
  LogOut,
  MessageSquare,
  Trophy,
  Award,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function MainHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "الرئيسية", icon: Home, href: "/" },
    { label: "الدورات", icon: BookOpen, href: "/courses" },
    { label: "المجتمع", icon: Users, href: "/community" },
    { label: "الفعاليات", icon: Calendar, href: "/events" },
    { label: "الاستشاريون", icon: MessageSquare, href: "/consultants" },
    { label: "لوحة المتصدرين", icon: Trophy, href: "/leaderboard" },
  ];

  const userMenuItems = [
    { label: "لوحة التحكم", icon: Zap, href: "/dashboard" },
    { label: "ملفي الشخصي", icon: User, href: "/profile" },
    { label: "الشهادات", icon: Award, href: "/certificates" },
    { label: "الإعدادات", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block border-b border-border bg-card/50 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                N
              </div>
              <span>NAI</span>
            </button>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => setLocation(item.href)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-card transition-colors flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLocation("/ai-coach")}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    AI Coach
                  </button>
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </button>
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                      {userMenuItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => setLocation(item.href)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-card/80 transition-colors flex items-center gap-2"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-border my-2"></div>
                      <button
                        onClick={() => logout()}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-600/20 transition-colors text-red-400 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => (window.location.href = "/api/oauth/callback")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-border bg-card/50 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span>NAI</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card/50 py-4">
            <div className="container space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setLocation(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg text-left text-sm font-semibold hover:bg-card transition-colors flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}

              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-border my-2"></div>
                  {userMenuItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        setLocation(item.href);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-left text-sm font-semibold hover:bg-card transition-colors flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-left text-sm font-semibold hover:bg-red-600/20 text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    window.location.href = "/api/oauth/callback";
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
