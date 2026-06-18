import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  Target,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AICoach() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "مرحباً! أنا NAI AI Coach، مساعدك الذكي في رحلة التعلم. يمكنني مساعدتك في:\n\n• **الإجابة على الأسئلة** - اسأل عن أي موضوع تدرسه\n• **شرح المفاهيم** - أشرح الأفكار المعقدة بطريقة بسيطة\n• **توصيات الدورات** - اقترح دورات مناسبة لمستواك\n• **خطط التعلم** - ساعدك في بناء خطة تعلم مخصصة\n• **حل المشاكل** - ساعدك في حل التمارين والمشاكل\n\nماذا تريد أن تتعلم اليوم؟",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const responses: Record<string, string> = {
        "الذكاء الاصطناعي":
          "الذكاء الاصطناعي (AI) هو فرع من علوم الحاسوب يهدف إلى إنشاء أنظمة ذكية قادرة على:\n\n1. **التعلم من البيانات** - تحسين الأداء مع الوقت\n2. **اتخاذ القرارات** - معالجة المعلومات واختيار الخيار الأفضل\n3. **حل المشاكل** - إيجاد حلول لمشاكل معقدة\n4. **التفاعل مع البشر** - فهم اللغة الطبيعية والاستجابة\n\nهل تريد معرفة المزيد عن تطبيقات الذكاء الاصطناعي؟",
        "دورات":
          "بناءً على مستواك الحالي، أوصي بالدورات التالية:\n\n🎓 **للمبتدئين:**\n- مقدمة إلى الذكاء الاصطناعي\n- أساسيات البرمجة بـ Python\n\n📚 **للمتوسطين:**\n- التعلم الآلي المتقدم\n- معالجة اللغات الطبيعية\n\n🚀 **للمتقدمين:**\n- الشبكات العصبية العميقة\n- تطبيقات الذكاء الاصطناعي الحقيقية\n\nأي من هذه الدورات تهمك؟",
        "مساعدة":
          "يمكنني مساعدتك في:\n\n✅ شرح المفاهيم الصعبة\n✅ حل التمارين والمشاكل\n✅ توصيات الدورات المناسبة\n✅ نصائح الدراسة الفعالة\n✅ خطط تعلم مخصصة\n✅ الإجابة على الأسئلة العامة\n\nاختر الموضوع الذي تريد المساعدة فيه!",
        default:
          "شكراً على سؤالك! هذا موضوع مهم جداً. دعني أشرحه لك بطريقة مبسطة:\n\nالنقاط الرئيسية:\n1. **الفهم الأساسي** - ابدأ بالمفاهيم الأساسية\n2. **التطبيق العملي** - مارس ما تعلمته\n3. **التعمق أكثر** - ادرس التفاصيل الدقيقة\n\nهل تريد المزيد من التفاصيل؟",
      };

      const responseText =
        Object.keys(responses).find((key) =>
          input.toLowerCase().includes(key.toLowerCase())
        ) && responses[Object.keys(responses).find((key) =>
          input.toLowerCase().includes(key.toLowerCase())
        ) as string]
          ? responses[Object.keys(responses).find((key) =>
              input.toLowerCase().includes(key.toLowerCase())
            ) as string]
          : responses.default;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center border border-border max-w-md">
          <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">
            يرجى تسجيل الدخول للتحدث مع NAI AI Coach
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              NAI AI Coach
            </h1>
            <p className="text-muted-foreground">مساعدك الذكي في التعلم</p>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            الرئيسية
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container py-8 max-w-3xl">
          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setInput("شرح الذكاء الاصطناعي")}
                className="p-4 rounded-lg border border-border hover:border-cyan-500/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">شرح المفاهيم</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  اطلب شرح أي مفهوم صعب
                </p>
              </button>

              <button
                onClick={() => setInput("أوصني بدورات مناسبة")}
                className="p-4 rounded-lg border border-border hover:border-cyan-500/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">توصيات الدورات</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  احصل على توصيات مخصصة
                </p>
              </button>

              <button
                onClick={() => setInput("خطة تعلم مخصصة")}
                className="p-4 rounded-lg border border-border hover:border-cyan-500/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">خطة التعلم</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  بناء خطة تعلم مخصصة
                </p>
              </button>

              <button
                onClick={() => setInput("كيف أحل هذه المشكلة")}
                className="p-4 rounded-lg border border-border hover:border-cyan-500/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">حل المشاكل</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ساعدة في حل التمارين
                </p>
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-xl p-4 border ${
                    message.role === "user"
                      ? "bg-cyan-600/20 border-cyan-500/50"
                      : "bg-card border-border"
                  }`}
                >
                  <Streamdown>{message.content}</Streamdown>
                </Card>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Card className="max-w-xl p-4 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200"></div>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 sticky bottom-0">
        <div className="container py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="اسأل NAI AI Coach عن أي شيء..."
              className="flex-1 bg-background border-border"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
