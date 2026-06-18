import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  BookOpen,
  Award,
  Flame,
  TrendingUp,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = trpc.gamification.getUserStats.useQuery();
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.enrollments.list.useQuery();
  const { data: badges, isLoading: badgesLoading } = trpc.gamification.getUserBadges.useQuery();
  const { data: certificates, isLoading: certificatesLoading } = trpc.certificates.getUserCertificates.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">مرحباً، {user.name}</h1>
            <p className="text-muted-foreground">استمر في رحلتك التعليمية</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              الرئيسية
            </button>
            <button
              onClick={() => setLocation("/courses")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              الدورات
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* XP Points */}
          <Card className="p-6 border border-border hover:border-cyan-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">نقاط الخبرة</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-cyan-400">{stats?.xpPoints || 0}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </Card>

          {/* Level */}
          <Card className="p-6 border border-border hover:border-blue-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">المستوى</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-blue-400">{stats?.level || 1}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Current Streak */}
          <Card className="p-6 border border-border hover:border-orange-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">السلسلة الحالية</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-orange-400">{stats?.currentStreak || 0}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </Card>

          {/* Certificates */}
          <Card className="p-6 border border-border hover:border-green-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">الشهادات</p>
                {certificatesLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-bold text-green-400">{certificates?.length || 0}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Courses and Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Courses */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  الدورات النشطة
                </h2>
                <Button
                  onClick={() => setLocation("/courses")}
                  variant="outline"
                  className="text-xs"
                >
                  عرض الكل
                </Button>
              </div>

              {enrollmentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <Card
                      key={enrollment.id}
                      className="p-4 border border-border hover:border-cyan-500/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                          دورة #{enrollment.courseId}
                        </h3>
                        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
                          {Math.round(parseFloat(enrollment.progressPercentage?.toString() || "0"))}%
                        </span>
                      </div>
                      <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.round(parseFloat(enrollment.progressPercentage?.toString() || "0"))}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {enrollment.completedLessons} من {enrollment.totalLessons} دروس مكتملة
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground mb-4">لم تبدأ أي دورة بعد</p>
                  <Button
                    onClick={() => setLocation("/courses")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    استكشف الدورات
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </Card>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-orange-400" />
                الشارات المكتسبة
              </h2>

              {badgesLoading ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : badges && badges.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {badges.slice(0, 6).map((item) => (
                    <Card
                      key={item.badge.id}
                      className="p-4 border border-border hover:border-orange-500/50 transition-colors text-center"
                    >
                      <div className="text-3xl mb-2">{item.badge.icon || "🏆"}</div>
                      <h3 className="font-semibold text-sm">{item.badge.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(item.earnedAt).toLocaleDateString("ar-SA")}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground">لم تكسب أي شارات بعد</p>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setLocation("/courses")}
                  className="w-full p-3 rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  استكشف دورات جديدة
                </button>
                <button
                  onClick={() => setLocation("/community")}
                  className="w-full p-3 rounded-lg bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  المجتمع
                </button>
                <button
                  onClick={() => setLocation("/events")}
                  className="w-full p-3 rounded-lg bg-orange-600/20 border border-orange-500/50 text-orange-300 hover:bg-orange-600/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  الفعاليات
                </button>
                <button
                  onClick={() => setLocation("/ai-coach")}
                  className="w-full p-3 rounded-lg bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600/30 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  NAI AI Coach
                </button>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                الفعاليات القادمة
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="font-semibold">ورشة عمل: الذكاء الاصطناعي</p>
                  <p className="text-xs text-muted-foreground mt-1">الخميس - 3:00 م</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="font-semibold">جلسة مباشرة: أدوات AI</p>
                  <p className="text-xs text-muted-foreground mt-1">الجمعة - 5:00 م</p>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 border border-border bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                نصيحة اليوم
              </h3>
              <p className="text-sm text-muted-foreground">
                استمر في التعلم يومياً لزيادة سلسلتك وكسب نقاط إضافية!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
