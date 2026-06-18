import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            <FileText className="w-12 h-12 text-cyan-400" />
            شروط الخدمة
          </h1>
          <p className="text-xl text-muted-foreground">
            اقرأ وافهم شروط استخدام منصة NAI
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {[
              {
                title: "1. قبول الشروط",
                content:
                  "بمجرد استخدام منصة NAI، فإنك توافق على جميع الشروط والأحكام المذكورة هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.",
              },
              {
                title: "2. استخدام المنصة",
                content:
                  "توافق على استخدام المنصة فقط للأغراض القانونية والمشروعة. لا يُسمح بالنشاط غير القانوني أو الضار أو المسيء على المنصة.",
              },
              {
                title: "3. حسابك",
                content:
                  "أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك وجميع الأنشطة التي تحدث تحت حسابك. يجب عليك إخطارنا فوراً بأي استخدام غير مصرح به.",
              },
              {
                title: "4. المحتوى",
                content:
                  "أنت تمنح NAI الحق في استخدام المحتوى الذي تنشره على المنصة. تضمن أنك تمتلك جميع الحقوق اللازمة للمحتوى الذي تنشره.",
              },
              {
                title: "5. الملكية الفكرية",
                content:
                  "جميع محتويات المنصة، بما في ذلك الدورات والمقالات والصور، محمية بحقوق الملكية الفكرية. لا يُسمح بنسخ أو توزيع المحتوى بدون إذن.",
              },
              {
                title: "6. التخلي عن المسؤولية",
                content:
                  "توفر المنصة 'كما هي' بدون ضمانات. لا نضمن دقة أو اكتمال المحتوى. استخدم المنصة على مسؤوليتك الخاصة.",
              },
              {
                title: "7. تحديد المسؤولية",
                content:
                  "لن تكون NAI مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة ناشئة عن استخدام المنصة.",
              },
              {
                title: "8. التعديلات",
                content:
                  "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات مهمة.",
              },
              {
                title: "9. الإنهاء",
                content:
                  "يمكننا إنهاء حسابك إذا انتهكت هذه الشروط. يمكنك أيضاً حذف حسابك في أي وقت من خلال إعدادات الحساب.",
              },
              {
                title: "10. القانون الحاكم",
                content:
                  "تخضع هذه الشروط للقوانين المصرية. أي نزاع سيتم حله من خلال المحاكم المختصة.",
              },
            ].map((section, idx) => (
              <Card key={idx} className="p-6 border border-border hover:border-cyan-500/50 transition-colors">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </Card>
            ))}
          </div>

          {/* Last Updated */}
          <Card className="p-6 border border-border bg-card/50 mt-8">
            <p className="text-sm text-muted-foreground">
              آخر تحديث: 16 يونيو 2026
            </p>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              هل لديك أسئلة حول شروط الخدمة؟
            </p>
            <button
              onClick={() => setLocation("/contact")}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
            >
              اتصل بنا
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
