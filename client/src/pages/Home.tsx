import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Award, Users, BookOpen, Rocket, Brain, Target, CheckCircle2, ArrowLeft } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";

interface AssessmentResult {
  level: string;
  title: string;
  description: string;
  color: string;
  recommendations: string[];
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const assessmentQuestions = [
    {
      question: "كم مرة استخدمت أدوات الذكاء الاصطناعي في عملك أو دراستك؟",
      options: ["لم أستخدمها أبداً", "استخدمت بعض الأدوات", "أستخدمها بانتظام", "أستخدمها يومياً"],
    },
    {
      question: "هل لديك معرفة بأساسيات الذكاء الاصطناعي والـ Machine Learning؟",
      options: ["لا معرفة لدي", "معرفة أساسية جداً", "معرفة جيدة", "معرفة متقدمة"],
    },
    {
      question: "كيف تقيّم جاهزيتك للعمل في بيئة تعتمد على AI؟",
      options: ["غير مستعد", "مستعد نسبياً", "مستعد جداً", "خبير وقائد"],
    },
  ];

  const getAssessmentResult = (): AssessmentResult => {
    const totalScore = assessmentAnswers.reduce((a, b) => a + b, 0);
    const avgScore = totalScore / assessmentAnswers.length;

    if (avgScore < 1) {
      return {
        level: "مبتدئ",
        title: "مرحباً بك في عالم الذكاء الاصطناعي",
        description: "أنت في البداية الصحيحة! دعنا نبني أساساً قوياً لك",
        color: "from-blue-500 to-blue-600",
        recommendations: [
          "مقدمة إلى الذكاء الاصطناعي",
          "أساسيات استخدام ChatGPT",
          "الإنتاجية الشخصية باستخدام AI",
        ],
      };
    } else if (avgScore < 2) {
      return {
        level: "متعلم",
        title: "أنت على الطريق الصحيح",
        description: "لديك أساس جيد، حان الوقت لتطوير مهاراتك",
        color: "from-cyan-500 to-cyan-600",
        recommendations: [
          "فن كتابة الأوامر (Prompt Engineering)",
          "الإدارة في عصر الذكاء الاصطناعي",
          "أتمتة العمليات باستخدام AI",
        ],
      };
    } else if (avgScore < 3) {
      return {
        level: "متقدم",
        title: "أنت متقدم في مجالك",
        description: "لديك خبرة جيدة، دعنا نرفعك للمستوى التالي",
        color: "from-orange-500 to-orange-600",
        recommendations: [
          "تطوير تطبيقات AI متقدمة",
          "استراتيجيات التحول الرقمي",
          "قيادة فرق العمل في عصر AI",
        ],
      };
    } else {
      return {
        level: "قائد رقمي",
        title: "أنت قائد في عصر الذكاء الاصطناعي",
        description: "خبرتك قيمة جداً، شارك معرفتك مع الآخرين",
        color: "from-purple-500 to-purple-600",
        recommendations: [
          "استراتيجيات الابتكار والتحول",
          "بناء فرق AI عالية الأداء",
          "الاستثمار في تقنيات المستقبل",
        ],
      };
    }
  };

  const handleAssessmentAnswer = (answerIndex: number) => {
    const newAnswers = [...assessmentAnswers, answerIndex];
    setAssessmentAnswers(newAnswers);

    if (assessmentStep < assessmentQuestions.length - 1) {
      setAssessmentStep(assessmentStep + 1);
    } else {
      setAssessmentResult(getAssessmentResult());
    }
  };

  const handleStartLearning = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const handleBrowseCourses = () => {
    if (isAuthenticated) {
      setLocation("/courses");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* AI Assessment Modal */}
      {showAssessment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            {assessmentResult ? (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${assessmentResult.color} flex items-center justify-center mx-auto mb-6`}>
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{assessmentResult.title}</h2>
                <p className="text-muted-foreground mb-6">{assessmentResult.description}</p>

                <div className="bg-card/50 border border-border rounded-xl p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">مستوى جاهزيتك:</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${assessmentResult.color} bg-clip-text text-transparent`}>
                    {assessmentResult.level}
                  </p>
                </div>

                <div className="text-left mb-6">
                  <h3 className="font-bold mb-4">المسارات التعليمية الموصى بها:</h3>
                  <ul className="space-y-2">
                    {assessmentResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBrowseCourses}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    استكشف الدورات الموصى بها
                  </button>
                  <button
                    onClick={() => {
                      setShowAssessment(false);
                      setAssessmentStep(0);
                      setAssessmentAnswers([]);
                      setAssessmentResult(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-card border border-border hover:bg-card/80 transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">ما مدى جاهزيتك لعصر الذكاء الاصطناعي؟</h2>
                  <button
                    onClick={() => {
                      setShowAssessment(false);
                      setAssessmentStep(0);
                      setAssessmentAnswers([]);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-muted-foreground mb-6">استغرق الاختبار دقيقة واحدة فقط</p>

                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {assessmentQuestions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          idx < assessmentStep ? "bg-cyan-500" : idx === assessmentStep ? "bg-cyan-300" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    السؤال {assessmentStep + 1} من {assessmentQuestions.length}
                  </p>
                </div>

                <h3 className="text-xl font-bold mb-6">{assessmentQuestions[assessmentStep].question}</h3>

                <div className="space-y-3 mb-6">
                  {assessmentQuestions[assessmentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAssessmentAnswer(idx)}
                      className="w-full p-4 text-left rounded-lg border border-border bg-card/50 hover:border-cyan-500/50 hover:bg-card transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowAssessment(false);
                    setAssessmentStep(0);
                    setAssessmentAnswers([]);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border hover:bg-card/80 transition-colors text-sm text-muted-foreground"
                >
                  تخطي الاختبار
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main headline with premium styling */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent block mb-2 animate-fade-in">
                اجعل الذكاء الاصطناعي
              </span>
              <span className="text-white block animate-fade-in" style={{ animationDelay: "0.2s" }}>
                يخدمك قبل أن يستبدلك
              </span>
            </h1>

            {/* Premium subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              اكتسب المهارات التي يحتاجها سوق العمل الحديث، وتعلم كيف توظف الذكاء الاصطناعي في الدراسة والعمل والإدارة والإنتاجية اليومية.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <button
                onClick={handleStartLearning}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-105"
              >
                ابدأ التعلم
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowAssessment(true)}
                className="px-8 py-4 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/30 hover:border-cyan-500/80 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                اختبر جاهزيتك
                <Target className="w-5 h-5" />
              </button>
              <button
                onClick={handleBrowseCourses}
                className="px-8 py-4 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-300 font-semibold hover:bg-orange-500/30 hover:border-orange-500/80 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
              >
                استكشف الدورات
                <BookOpen className="w-5 h-5" />
              </button>
            </div>

            {/* Premium trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>تعلم عملي</span>
              </div>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>شهادات رقمية قابلة للتحقق</span>
              </div>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span>مجتمع تعلم نشط</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why NAI Section */}
      <section className="py-24 md:py-32 border-t border-border bg-card/30">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              لماذا <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">NAI</span>؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              منصة متكاملة مصممة لعصر الذكاء الاصطناعي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">تعلم عملي وليس نظري</h3>
              <p className="text-muted-foreground leading-relaxed">
                دورات قصيرة من 20-60 دقيقة مقسمة إلى دروس صغيرة قابلة للتطبيق الفوري في عملك
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">مهارات قابلة للتطبيق فوراً</h3>
              <p className="text-muted-foreground leading-relaxed">
                كل درس يركز على مهارة محددة يمكنك استخدامها في نفس اليوم في عملك أو دراستك
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">شهادات رقمية قابلة للتحقق</h3>
              <p className="text-muted-foreground leading-relaxed">
                احصل على شهادات إنجاز رقمية قابلة للتحقق تعكس مهاراتك الحقيقية والمكتسبة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              الدورات <span className="text-cyan-400">المميزة</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ابدأ رحلتك مع أكثر الدورات طلباً وفائدة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "الذكاء الاصطناعي للمبتدئين", level: "مبتدئ", duration: "4 ساعات" },
              { title: "فن كتابة الأوامر للذكاء الاصطناعي", level: "متوسط", duration: "3 ساعات" },
              { title: "الإدارة في عصر الذكاء الاصطناعي", level: "متقدم", duration: "5 ساعات" },
              { title: "الإنتاجية الشخصية باستخدام AI", level: "مبتدئ", duration: "2 ساعة" },
            ].map((course, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-xl bg-card border border-border hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
                onClick={handleBrowseCourses}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-3 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">{course.level}</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleBrowseCourses}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2"
            >
              اكتشف جميع الدورات
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 border-t border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              انضم إلى آلاف المتعلمين الذين يطورون مهاراتهم في عصر الذكاء الاصطناعي
            </p>
            <button
              onClick={handleStartLearning}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              ابدأ التعلم الآن
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
