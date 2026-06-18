import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Trophy,
  Award,
  BookOpen,
  Zap,
  Target,
  ArrowRight,
  Star,
  Flame,
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center border border-border max-w-md">
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">
            يرجى تسجيل الدخول لعرض ملفك الشخصي
          </p>
          <button
            onClick={() => (window.location.href = "/api/oauth/callback")}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
          >
            تسجيل الدخول
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">ملفي الشخصي</h1>
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Info Card */}
            <Card className="p-8 border border-border bg-gradient-to-br from-cyan-600/10 to-blue-600/10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-sm font-semibold"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">المستوى الحالي</h3>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-4xl font-bold text-cyan-400">12</p>
                <p className="text-sm text-muted-foreground mt-2">
                  1,250 / 2,000 XP
                </p>
                <div className="w-full bg-card rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2 rounded-full w-5/12"></div>
                </div>
              </Card>

              <Card className="p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">الدورات المكتملة</h3>
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-4xl font-bold text-blue-400">8</p>
                <p className="text-sm text-muted-foreground mt-2">
                  3 دورات جارية
                </p>
              </Card>

              <Card className="p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">السلسلة الحالية</h3>
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-4xl font-bold text-orange-400">15</p>
                <p className="text-sm text-muted-foreground mt-2">
                  يوم متتالي
                </p>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                الشارات المكتسبة
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: "البداية الأولى", icon: "🚀", color: "from-blue-400 to-cyan-400" },
                  { name: "متعلم نشط", icon: "⚡", color: "from-yellow-400 to-orange-400" },
                  { name: "خبير", icon: "🎓", color: "from-purple-400 to-pink-400" },
                  { name: "السلسلة الذهبية", icon: "🔥", color: "from-orange-400 to-red-400" },
                  { name: "مساعد المجتمع", icon: "🤝", color: "from-green-400 to-cyan-400" },
                  { name: "المتصدر", icon: "👑", color: "from-yellow-300 to-yellow-500" },
                  { name: "الدارس المثابر", icon: "💪", color: "from-red-400 to-pink-400" },
                  { name: "صاحب الرؤية", icon: "🎯", color: "from-indigo-400 to-purple-400" },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg bg-gradient-to-br ${badge.color} opacity-20 border border-border hover:opacity-30 transition-opacity cursor-pointer text-center`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-sm font-semibold">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                النشاط الأخير
              </h3>
              <div className="space-y-3">
                {[
                  { action: "أكملت دورة", course: "مقدمة إلى الذكاء الاصطناعي", time: "منذ ساعة", xp: "+100" },
                  { action: "حصلت على شارة", course: "البداية الأولى", time: "منذ يومين", xp: "+50" },
                  { action: "بدأت دورة", course: "التعلم الآلي المتقدم", time: "منذ 3 أيام", xp: "+25" },
                  { action: "أجبت على سؤال", course: "في المجتمع", time: "منذ أسبوع", xp: "+10" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-4 border border-border hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {item.action} <span className="text-cyan-400">{item.course}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">{item.xp}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                أهدافي
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">إكمال 10 دورات</span>
                    <span className="text-xs text-muted-foreground">8/10</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-600 h-2 rounded-full w-4/5"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">الوصول للمستوى 15</span>
                    <span className="text-xs text-muted-foreground">12/15</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full w-3/5"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">30 يوم متتالي</span>
                    <span className="text-xs text-muted-foreground">15/30</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setLocation("/courses")}
                  className="w-full p-3 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors text-left text-sm font-semibold"
                >
                  استكشف الدورات
                </button>
                <button
                  onClick={() => setLocation("/ai-coach")}
                  className="w-full p-3 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors text-left text-sm font-semibold"
                >
                  تحدث مع AI Coach
                </button>
                <button
                  onClick={() => setLocation("/community")}
                  className="w-full p-3 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors text-left text-sm font-semibold"
                >
                  انضم للمجتمع
                </button>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 border border-border bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <h3 className="font-bold mb-4">الإحصائيات</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ساعات الدراسة</span>
                  <span className="font-semibold">142 ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الاختبارات المجتازة</span>
                  <span className="font-semibold">12 اختبار</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشهادات المكتسبة</span>
                  <span className="font-semibold">8 شهادات</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المشاركات في المجتمع</span>
                  <span className="font-semibold">45 مشاركة</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
