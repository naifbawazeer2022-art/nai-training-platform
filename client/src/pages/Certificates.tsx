import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Award, Download, Share2, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Certificates() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user certificates
  const { data: certificates, isLoading } = trpc.certificates.getUserCertificates.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleDownload = (certificateId: number) => {
    toast.success("جاري تحميل الشهادة...");
    // In a real app, this would trigger a download
  };

  const handleShare = (certificateId: number) => {
    toast.success("تم نسخ رابط الشهادة إلى الحافظة!");
    // In a real app, this would copy a shareable link
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center border border-border max-w-md">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">
            يرجى تسجيل الدخول لعرض شهاداتك
          </p>
          <button
            onClick={() => (window.location.href = "/api/oauth/callback")}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
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
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Award className="w-8 h-8 text-yellow-400" />
              شهاداتي
            </h1>
            <p className="text-muted-foreground">الشهادات التي حصلت عليها من إتمام الدورات</p>
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
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border border-border bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-muted-foreground">إجمالي الشهادات</span>
            </div>
            <p className="text-3xl font-bold">{certificates?.length || 0}</p>
          </Card>

          <Card className="p-6 border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-cyan-400" />
              <span className="text-muted-foreground">الدورات المكتملة</span>
            </div>
            <p className="text-3xl font-bold">{certificates?.length || 0}</p>
          </Card>

          <Card className="p-6 border border-border bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-purple-400" />
              <span className="text-muted-foreground">معدل الإنجاز</span>
            </div>
            <p className="text-3xl font-bold">100%</p>
          </Card>
        </div>

        {/* Certificates Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="border border-border hover:border-yellow-500/50 transition-all duration-300 overflow-hidden group"
              >
                {/* Certificate Preview */}
                <div className="h-48 bg-gradient-to-br from-yellow-600 to-orange-600 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <Award className="w-20 h-20 text-white/50 group-hover:scale-110 transition-transform" />
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                    شهادة إتمام الدورة
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    شهادة رقمية قابلة للتحقق من منصة NAI
                  </p>

                  {/* Certificate Details */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(cert.issuedAt).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>معرّف الشهادة: {cert.id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload(cert.id)}
                      className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تحميل الشهادة
                    </button>
                    <button
                      onClick={() => handleShare(cert.id)}
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-yellow-500/50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      مشاركة
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">لا توجد شهادات حالياً</h2>
            <p className="text-muted-foreground mb-6">
              أكمل الدورات للحصول على شهادات رقمية قابلة للتحقق من منصة NAI
            </p>
            <button
              onClick={() => setLocation("/courses")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
            >
              استكشف الدورات
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        )}

        {/* Certificate Info Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">عن الشهادات</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-3">الشهادات الرقمية القابلة للتحقق</h3>
              <p className="text-muted-foreground">
                جميع الشهادات الصادرة من منصة NAI رقمية قابلة للتحقق وتعكس إتقانك الحقيقي للمهارات المطلوبة.
              </p>
            </Card>
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-3">المشاركة والعرض</h3>
              <p className="text-muted-foreground">
                يمكنك مشاركة شهاداتك على وسائل التواصل الاجتماعي أو إضافتها إلى ملفك الشخصي.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
