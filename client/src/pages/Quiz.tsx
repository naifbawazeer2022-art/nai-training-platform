import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Clock, BarChart3, ArrowRight } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Quiz() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/quiz/:id");
  const quizId = params?.id ? parseInt(params.id) : 0;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quiz data
  const { data: quiz, isLoading } = trpc.courses.getById.useQuery(
    { id: quizId },
    { enabled: quizId > 0 }
  );

  const handleSelectAnswer = (questionId: number, answerIndex: number): void => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Calculate score
      let correctCount = 0;
      mockQuestions.forEach((q: any, idx: number) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      
      const percentage = Math.round((correctCount / mockQuestions.length) * 100);
      
      // Show results
      setShowResults(true);
      
      if (percentage >= 70) {
        toast.success(`تهانينا! حصلت على ${percentage}%`);
      } else {
        toast.error(`النتيجة: ${percentage}%. حاول مرة أخرى!`);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تصحيح الاختبار");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">الاختبار غير موجود</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Mock questions for now - in real app would come from assessment data
  const mockQuestions = [
    {
      id: 1,
      question: "ما هو الذكاء الاصطناعي؟",
      options: ["محاكاة ذكاء الإنسان", "برنامج حاسوب عادي", "لعبة فيديو", "نظام تشغيل"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "ما هو التعلم الآلي؟",
      options: ["تعليم الآلات", "فرع من الذكاء الاصطناعي", "برنامج تدريب", "كل ما سبق"],
      correctAnswer: 3,
    },
  ];
  
  const currentQ = mockQuestions[currentQuestion];
  const totalQuestions = mockQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const quizTitle = quiz?.title || "اختبار الدورة";
  const quizDescription = quiz?.description || "اختبر معلوماتك عن موضوعات الدورة";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setLocation("/courses")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-2">{quizTitle}</h1>
          <p className="text-muted-foreground">{quizDescription}</p>
        </div>
      </div>

      <div className="container py-8">
        {!showResults ? (
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">السؤال {currentQuestion + 1} من {totalQuestions}</span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} من {totalQuestions} مجاب عليه
                </span>
              </div>
              <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            {currentQ && (
              <Card className="p-8 border border-border mb-8">
                <h2 className="text-2xl font-bold mb-6">{currentQ.question}</h2>

                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                  {currentQ?.options?.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(currentQ.id, idx)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAnswers[currentQ.id] === idx
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-border hover:border-cyan-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQ.id] === idx
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-border"
                          }`}
                        >
                          {selectedAnswers[currentQ.id] === idx && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-semibold">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    السابق
                  </button>

                  {currentQuestion === totalQuestions - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting || answeredCount < totalQuestions}
                      className="px-8 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "جاري التصحيح..." : "إنهاء الاختبار"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200"
                    >
                      التالي
                    </button>
                  )}
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 border border-border text-center mb-8">
              <div className="mb-6">
                <BarChart3 className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">تم إنهاء الاختبار!</h2>
              </div>

              {/* Score Calculation */}
              {(() => {
                let correctCount = 0;
                mockQuestions.forEach((q: any) => {
                  if (selectedAnswers[q.id] === q.correctAnswer) {
                    correctCount++;
                  }
                });
                const percentage = Math.round((correctCount / totalQuestions) * 100);
                const passed = percentage >= 70;

                return (
                  <div>
                    <div className={`text-6xl font-bold mb-4 ${passed ? "text-green-400" : "text-orange-400"}`}>
                      {percentage}%
                    </div>
                    <p className={`text-xl font-semibold mb-6 ${passed ? "text-green-400" : "text-orange-400"}`}>
                      {passed ? "ممتاز! لقد نجحت في الاختبار" : "حاول مرة أخرى لتحسين درجتك"}
                    </p>
                    <div className="bg-card p-6 rounded-lg border border-border mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground">الإجابات الصحيحة</span>
                        <span className="text-lg font-bold text-green-400">{correctCount}/{totalQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الإجابات الخاطئة</span>
                        <span className="text-lg font-bold text-red-400">{totalQuestions - correctCount}/{totalQuestions}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {passed && (
                        <button
                          onClick={() => setLocation("/dashboard")}
                          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-cyan-600 text-white font-semibold hover:from-green-700 hover:to-cyan-700 transition-all duration-200"
                        >
                          عرض الشهادة
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCurrentQuestion(0);
                          setSelectedAnswers({});
                          setShowResults(false);
                        }}
                        className="w-full px-6 py-3 rounded-lg bg-card border border-border text-muted-foreground hover:border-cyan-500/50 transition-colors font-semibold"
                      >
                        إعادة الاختبار
                      </button>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
