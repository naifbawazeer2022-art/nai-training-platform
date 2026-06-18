import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Play,
  Download,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CourseDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/course/:id");
  const courseId = params?.id ? parseInt(params.id) : 0;

  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { id: courseId },
    { enabled: courseId > 0 }
  );

  // Fetch lessons
  const { data: lessons, isLoading: lessonsLoading } = trpc.courses.lessons.useQuery(
    { courseId },
    { enabled: courseId > 0 }
  );

  // Check if user is enrolled
  const { data: enrollment } = trpc.enrollments.getByCoursAndUser.useQuery(
    { courseId },
    { enabled: isAuthenticated && courseId > 0 }
  );

  // Enroll mutation
  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل في الدورة بنجاح!");
      setIsEnrolling(false);
    },
    onError: () => {
      toast.error("حدث خطأ في التسجيل");
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/oauth/callback";
      return;
    }
    setIsEnrolling(true);
    enrollMutation.mutate({ courseId });
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">الدورة غير موجودة</p>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">لم نتمكن من تحميل الدورة</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/courses")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للدورات
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <div className="h-96 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-white/50" />
            </div>

            {/* Course Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300">
                  {course.level === "beginner" && "مبتدئ"}
                  {course.level === "intermediate" && "متوسط"}
                  {course.level === "advanced" && "متقدم"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                  {course.specialty}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-muted-foreground">المدة</p>
                      <p className="font-bold">{course.duration || 0} دقيقة</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-muted-foreground">المتعلمون</p>
                      <p className="font-bold">{course.enrollmentCount}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-muted-foreground">التقييم</p>
                      <p className="font-bold">{course.rating || "0"}/5</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-muted-foreground">الدروس</p>
                      <p className="font-bold">{lessons?.length || 0}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Lessons */}
            <div>
              <h2 className="text-2xl font-bold mb-6">محتوى الدورة</h2>

              {lessonsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : lessons && lessons.length > 0 ? (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Card
                      key={lesson.id}
                      className="p-4 border border-border hover:border-cyan-500/50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedLesson(lesson.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          {enrollment ? (
                            <CheckCircle className="w-6 h-6 text-cyan-400" />
                          ) : (
                            <Play className="w-6 h-6 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                            الدرس {index + 1}: {lesson.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>{lesson.duration || 0} دقيقة</span>
                            {lesson.videoUrl ? <span>📹 فيديو</span> : null}
                            {lesson.resources ? <span>📄 موارد</span> : null}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center border border-border">
                  <p className="text-muted-foreground">لا توجد دروس في هذه الدورة بعد</p>
                </Card>
              )}
            </div>

            {/* Course Details */}
            <div>
              <h2 className="text-2xl font-bold mb-6">تفاصيل الدورة</h2>
              <Card className="p-6 border border-border space-y-4">
                <div>
                  <h3 className="font-bold mb-2">ما ستتعلمه</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ المبادئ الأساسية للموضوع</li>
                    <li>✓ تطبيقات عملية وواقعية</li>
                    <li>✓ أفضل الممارسات والنصائح</li>
                    <li>✓ مشاريع عملية للتطبيق</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="p-6 border border-border sticky top-20">
              <div className="mb-6">
                <p className="text-3xl font-bold text-cyan-400 mb-2">مجاني</p>
                <p className="text-sm text-muted-foreground">دورة تعليمية مفتوحة للجميع</p>
              </div>

              {enrollment ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm text-center">
                    ✓ أنت مسجل في هذه الدورة
                  </div>
                  <button className="w-full px-4 py-3 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors">
                    متابعة الدورة
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isEnrolling ? "جاري التسجيل..." : "سجل الآن"}
                </button>
              )}

              <div className="mt-6 space-y-3 pt-6 border-t border-border">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-cyan-500/50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  شارك الدورة
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-cyan-500/50 transition-colors">
                  <Download className="w-4 h-4" />
                  حمّل الموارد
                </button>
              </div>
            </Card>

            {/* Course Info */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4">معلومات الدورة</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">المستوى</p>
                  <p className="font-semibold">
                    {course.level === "beginner" && "مبتدئ"}
                    {course.level === "intermediate" && "متوسط"}
                    {course.level === "advanced" && "متقدم"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">التخصص</p>
                  <p className="font-semibold">{course.specialty}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">تاريخ النشر</p>
                  <p className="font-semibold">
                    {new Date(course.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
