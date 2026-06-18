import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, Users, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Events() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch upcoming events
  const { data: events, isLoading } = trpc.events.getUpcoming.useQuery({
    limit: 10,
  });

  const handleRegister = (eventId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/api/oauth/callback";
      return;
    }
    toast.success("تم التسجيل في الفعالية بنجاح!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-400" />
              الفعاليات والويبينارات
            </h1>
            <p className="text-muted-foreground">احضر الجلسات المباشرة والورش التدريبية</p>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            الرئيسية
          </button>
        </div>
      </div>

      <div className="container py-8">
        {/* Featured Event */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">الفعالية المميزة</h2>
          <Card className="border border-border overflow-hidden hover:border-orange-500/50 transition-colors">
            <div className="grid md:grid-cols-2 gap-6 p-8">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg h-64 flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white/50" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300">
                      مميز
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                      جلسة مباشرة
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ورشة عمل: الذكاء الاصطناعي في الإنتاجية</h3>
                  <p className="text-muted-foreground mb-4">
                    تعلم كيفية استخدام أدوات الذكاء الاصطناعي لزيادة إنتاجيتك وتحسين مهاراتك بشكل عملي
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <span>الخميس، 20 يونيو 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span>3:00 م - 5:00 م (ساعتان)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span>245 متسجل</span>
                  </div>
                  <button
                    onClick={() => handleRegister(1)}
                    className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    سجل الآن
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold mb-6">الفعاليات القادمة</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="border border-border hover:border-orange-500/50 transition-all duration-300 overflow-hidden group"
                >
                  {/* Event Header */}
                  <div className="h-40 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/90 text-slate-900">
                        {event.eventType === "workshop" && "ورشة عمل"}
                        {event.eventType === "webinar" && "ويبينار"}
                        {event.eventType === "live_session" && "جلسة مباشرة"}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.startTime).toLocaleDateString("ar-SA")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(event.startTime).toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.registeredCount || 0} متسجل</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                    >
                      سجل الآن
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">لا توجد فعاليات قادمة حالياً</p>
            </Card>
          )}
        </div>

        {/* Past Events */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">الفعاليات السابقة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border opacity-60 hover:opacity-100 transition-opacity">
                <div className="h-40 bg-gradient-to-br from-gray-600 to-gray-700"></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">فعالية سابقة #{i}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    وصف الفعالية السابقة...
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>تم قبل شهر</span>
                  </div>
                  <button className="w-full px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground font-semibold hover:border-cyan-500/50 transition-colors">
                    عرض التفاصيل
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
