import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Zap, Award } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              من نحن
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              منصة NAI هي منصة تعليمية متكاملة تجمع بين أحدث تقنيات التعلم الرقمي والذكاء الاصطناعي لتقديم تجربة تعليمية استثنائية.
            </p>
            <button
              onClick={() => setLocation("/courses")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              ابدأ التعلم الآن
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border border-border bg-gradient-to-br from-cyan-600/10 to-blue-600/10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                رسالتنا
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                تمكين الأفراد من اكتساب مهارات المستقبل من خلال تقديم محتوى تعليمي عالي الجودة يجمع بين الخبرة البشرية والذكاء الاصطناعي، مما يساعدهم على التطور المهني والشخصي في عالم رقمي متسارع.
              </p>
            </Card>

            <Card className="p-8 border border-border bg-gradient-to-br from-purple-600/10 to-pink-600/10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-400" />
                رؤيتنا
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                أن نصبح المنصة الرائدة في العالم العربي للتعليم الرقمي المدعوم بالذكاء الاصطناعي، حيث يتمكن كل فرد من الوصول إلى تعليم عالي الجودة بغض النظر عن موقعه الجغرافي أو خلفيته.
              </p>
            </Card>
          </div>

          {/* Values */}
          <h2 className="text-3xl font-bold mb-8">قيمنا الأساسية</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "الجودة",
                description: "نلتزم بتقديم محتوى تعليمي عالي الجودة من خبراء متخصصين",
                icon: "🎯",
              },
              {
                title: "الابتكار",
                description: "نستخدم أحدث التقنيات والذكاء الاصطناعي لتحسين التعليم",
                icon: "💡",
              },
              {
                title: "الشمولية",
                description: "نؤمن بأن التعليم حق للجميع بغض النظر عن الخلفية",
                icon: "🌍",
              },
              {
                title: "التفاعل",
                description: "نركز على التعلم التفاعلي والعملي وليس الحفظ والتلقين",
                icon: "🤝",
              },
              {
                title: "المرونة",
                description: "نوفر محتوى يناسب جميع أنماط التعلم والسرعات المختلفة",
                icon: "⚡",
              },
              {
                title: "الدعم",
                description: "نقدم دعماً شاملاً من خلال المجتمع والمدربين والذكاء الاصطناعي",
                icon: "💪",
              },
            ].map((value, idx) => (
              <Card key={idx} className="p-6 border border-border hover:border-cyan-500/50 transition-colors">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-border bg-card/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">إحصائياتنا</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "متعلم نشط" },
              { number: "50+", label: "دورة متخصصة" },
              { number: "95%", label: "معدل الرضا" },
              { number: "24/7", label: "دعم مستمر" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">لماذا تختار NAI؟</h2>
          <div className="space-y-4">
            {[
              "محتوى تعليمي متخصص من خبراء في المجال",
              "دعم الذكاء الاصطناعي لتخصيص التعليم لكل متعلم",
              "مجتمع نشط من المتعلمين والمدربين",
              "شهادات معترف بها في السوق",
              "أسعار تنافسية وخطط مرنة",
              "واجهة سهلة الاستخدام وتجربة سلسة",
              "دعم عربي كامل",
              "تحديثات مستمرة للمحتوى والميزات",
            ].map((reason, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-border bg-card/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-2">
            <Users className="w-8 h-8 text-cyan-400" />
            فريقنا
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            فريق NAI يتكون من متخصصين في التعليم والتكنولوجيا والذكاء الاصطناعي، مكرسين لتقديم أفضل تجربة تعليمية.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "أحمد محمد", role: "المؤسس والرئيس التنفيذي", icon: "👨‍💼" },
              { name: "فاطمة علي", role: "مديرة المحتوى التعليمي", icon: "👩‍🏫" },
              { name: "محمود حسن", role: "مهندس الذكاء الاصطناعي", icon: "👨‍💻" },
              { name: "نور أحمد", role: "مديرة تطوير المنتج", icon: "👩‍💼" },
            ].map((member, idx) => (
              <Card key={idx} className="p-6 border border-border text-center hover:border-cyan-500/50 transition-colors">
                <div className="text-5xl mb-4">{member.icon}</div>
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد للبدء؟</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المتعلمين الذين يطورون مهاراتهم مع NAI
          </p>
          <button
            onClick={() => setLocation("/courses")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
          >
            استكشف الدورات
          </button>
        </div>
      </section>
    </div>
  );
}
