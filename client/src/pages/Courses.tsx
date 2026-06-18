import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Search, Filter, Star, Users, Clock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Courses() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  // Fetch courses
  const { data: courses, isLoading } = trpc.courses.list.useQuery({
    limit: 20,
    offset: 0,
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === "" || course.level === selectedLevel;
    const matchesSpecialty = selectedSpecialty === "" || course.specialty === selectedSpecialty;

    return matchesSearch && matchesLevel && matchesSpecialty;
  });

  const levels = ["beginner", "intermediate", "advanced"];
  const specialties = ["AI", "Productivity", "Management", "Entrepreneurship"];

  const handleCourseClick = (courseId: number) => {
    if (isAuthenticated) {
      setLocation(`/course/${courseId}`);
    } else {
      window.location.href = `/api/oauth/callback?returnTo=/course/${courseId}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              الدورات التدريبية
            </h1>
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
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن دورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Level Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">المستوى</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="">جميع المستويات</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "beginner" && "مبتدئ"}
                    {level === "intermediate" && "متوسط"}
                    {level === "advanced" && "متقدم"}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">التخصص</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="">جميع التخصصات</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel("");
                  setSelectedSpecialty("");
                }}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-cyan-500/50 transition-colors font-semibold"
              >
                <Filter className="w-4 h-4 inline mr-2" />
                مسح الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : filteredCourses && filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="border border-border hover:border-cyan-500/50 transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                {/* Course Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50 group-hover:scale-110 transition-transform" />
                  </div>
                  {/* Level Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/90 text-slate-900">
                      {course.level === "beginner" && "مبتدئ"}
                      {course.level === "intermediate" && "متوسط"}
                      {course.level === "advanced" && "متقدم"}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration || 0} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount} متعلم</span>
                    </div>
                    {course.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(parseFloat(course.rating?.toString() || "0"))
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">
                          ({course.reviewCount} تقييم)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCourseClick(course.id);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    عرض التفاصيل
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground mb-4">لم نجد دورات تطابق معاييرك</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("");
                setSelectedSpecialty("");
              }}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              مسح الفلاتر والمحاولة مجدداً
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
