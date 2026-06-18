import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trophy, Medal, Flame, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = trpc.gamification.getLeaderboard.useQuery({
    limit: 100,
  });

  const userRank = leaderboard?.findIndex((entry) => entry.id === user?.id) ?? -1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              لوحة المتصدرين
            </h1>
            <p className="text-muted-foreground">أفضل المتعلمين والمتفوقين في المنصة</p>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border border-border bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-muted-foreground">إجمالي المتعلمين</span>
            </div>
            <p className="text-3xl font-bold">{leaderboard?.length || 0}</p>
          </Card>

          <Card className="p-6 border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <span className="text-muted-foreground">أعلى XP</span>
            </div>
            <p className="text-3xl font-bold">
              {leaderboard?.[0]?.xpPoints?.toLocaleString() || "0"}
            </p>
          </Card>

          <Card className="p-6 border border-border bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-muted-foreground">ترتيبك</span>
            </div>
            <p className="text-3xl font-bold">
              {userRank >= 0 ? `#${userRank + 1}` : "—"}
            </p>
          </Card>
        </div>

        {/* Top 3 Podium */}
        {leaderboard && leaderboard.length >= 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">أفضل 3 متعلمين</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <Card className="p-6 border border-border border-silver/50 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{leaderboard[1].name || "متعلم"}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">المستوى: {leaderboard[1].level}</p>
                      <p className="text-yellow-400 font-bold">{leaderboard[1].xpPoints} XP</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 1st Place */}
              {leaderboard[0] && (
                <Card className="p-6 border border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 relative md:scale-105">
                  <div className="absolute top-4 right-4">
                    <Trophy className="w-10 h-10 text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{leaderboard[0].name || "متعلم"}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">المستوى: {leaderboard[0].level}</p>
                      <p className="text-yellow-400 font-bold text-lg">{leaderboard[0].xpPoints} XP</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <Card className="p-6 border border-orange-500/50 relative">
                  <div className="absolute top-4 right-4">
                    <Medal className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-red-700 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{leaderboard[2].name || "متعلم"}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">المستوى: {leaderboard[2].level}</p>
                      <p className="text-yellow-400 font-bold">{leaderboard[2].xpPoints} XP</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold mb-6">الترتيب الكامل</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <Card
                  key={entry.id}
                  className={`p-4 border transition-colors ${
                    entry.id === user?.id
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-border hover:border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center font-bold text-white">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {entry.name || "متعلم"}
                          {entry.id === user?.id && (
                            <span className="text-xs ml-2 px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                              أنت
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">المستوى {entry.level}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">النقاط</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {entry.xpPoints?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">الشارات</p>
                        <p className="text-lg font-bold">0</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">لا توجد بيانات لوحة المتصدرين حالياً</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
