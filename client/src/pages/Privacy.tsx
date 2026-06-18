import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            <Shield className="w-12 h-12 text-cyan-400" />
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-muted-foreground">
            نحن نحترم خصوصيتك ونلتزم بحماية بيانات المستخدمين
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {[
              {
                title: "1. جمع البيانات",
                content:
                  "نجمع البيانات الشخصية التي تقدمها لنا طواعية عند التسجيل والاستخدام. تشمل هذه البيانات الاسم والبريد الإلكتروني وبيانات الملف الشخصي.",
              },
              {
                title: "2. استخدام البيانات",
                content:
                  "نستخدم بيانات المستخدمين لتحسين الخدمات وتقديم محتوى مخصص وإرسال إشعارات مهمة. لا نبيع بيانات المستخدمين لأطراف ثالثة.",
              },
              {
                title: "3. الأمان",
                content:
                  "نستخدم تقنيات التشفير والحماية لحماية بيانات المستخدمين من الوصول غير المصرح به. جميع البيانات محفوظة على خوادم آمنة.",
              },
              {
                title: "4. ملفات تعريف الارتباط",
                content:
                  "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتتبع الاستخدام. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.",
              },
              {
                title: "5. حقوق المستخدم",
                content:
                  "لديك الحق في الوصول إلى بيانات المستخدم الخاصة بك وتصحيحها وحذفها. يمكنك طلب نسخة من بيانات المستخدم الخاصة بك في أي وقت.",
              },
              {
                title: "6. التغييرات على السياسة",
                content:
                  "قد نحدث سياسة الخصوصية من وقت لآخر. سيتم إخطار المستخدمين بأي تغييرات مهمة عبر البريد الإلكتروني أو إشعار على المنصة.",
              },
              {
                title: "7. التواصل",
                content:
                  "إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني info@nai.com أو من خلال صفحة الاتصال.",
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
              هل لديك أسئلة حول سياسة الخصوصية؟
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
