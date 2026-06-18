import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Star, Clock, MapPin, Calendar, ArrowRight, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Consultants() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedConsultant, setSelectedConsultant] = useState<number | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Fetch available consultants
  const { data: consultants, isLoading } = trpc.consultants.getAvailable.useQuery();

  const handleBookConsultation = (consultantId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/api/oauth/callback";
      return;
    }
    setSelectedConsultant(consultantId);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = () => {
    toast.success("تم حجز الاستشارة بنجاح! سيتم التواصل معك قريباً.");
    setShowBookingForm(false);
    setSelectedConsultant(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-purple-400" />
              الاستشارات الفردية
            </h1>
            <p className="text-muted-foreground">احجز جلسة استشارة مع خبرائنا المتخصصين</p>
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
        {/* Info Banner */}
        <Card className="p-6 mb-8 border border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <h2 className="text-lg font-bold mb-2">عن الاستشارات الفردية</h2>
          <p className="text-muted-foreground">
            احصل على استشارة شخصية من خبرائنا المتخصصين في مجالات الذكاء الاصطناعي والإنتاجية والتطوير الذاتي.
            كل جلسة مصممة خصيصاً لاحتياجاتك الفردية.
          </p>
        </Card>

        {/* Consultants Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : consultants && consultants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultants.map((consultant) => (
              <Card
                key={consultant.id}
                className="border border-border hover:border-purple-500/50 transition-all duration-300 overflow-hidden group"
              >
                {/* Consultant Avatar */}
                <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white/50" />
                  </div>
                </div>

                {/* Consultant Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-purple-400 transition-colors">
                    {consultant.title || "خبير"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {consultant.bio || "متخصص في مجالات متعددة"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">(42 تقييم)</span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>جلسة واحدة: 60 دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>150+ جلسة منجزة</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-purple-400 mb-2">
                      $50
                      <span className="text-sm text-muted-foreground">/ساعة</span>
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookConsultation(consultant.id)}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    احجز جلسة
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">لا توجد استشاريين متاحين حالياً</p>
          </Card>
        )}

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="border border-border max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">احجز جلسة استشارة</h2>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">اختر التاريخ</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">اختر الوقت</label>
                  <select className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-purple-500/50 transition-colors">
                    <option>9:00 ص</option>
                    <option>10:00 ص</option>
                    <option>11:00 ص</option>
                    <option>2:00 م</option>
                    <option>3:00 م</option>
                    <option>4:00 م</option>
                  </select>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold mb-2">موضوع الاستشارة</label>
                  <textarea
                    placeholder="اكتب موضوع الاستشارة..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-border transition-colors font-semibold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitBooking}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-semibold"
                >
                  تأكيد الحجز
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
