import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, MessageSquare, Heart, Share2, Plus, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showNewPost, setShowNewPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"post" | "question" | "achievement">("post");

  // Fetch community posts
  const { data: posts, isLoading } = trpc.community.getPosts.useQuery({
    limit: 20,
    offset: 0,
  });

  // Create post mutation
  const createPostMutation = trpc.community.createPost.useMutation({
    onSuccess: () => {
      toast.success("تم نشر المنشور بنجاح!");
      setPostTitle("");
      setPostContent("");
      setPostType("post");
      setShowNewPost(false);
    },
    onError: () => {
      toast.error("حدث خطأ في نشر المنشور");
    },
  });

  const handleCreatePost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    createPostMutation.mutate({
      title: postTitle,
      content: postContent,
      type: postType,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-cyan-400" />
              المجتمع
            </h1>
            <p className="text-muted-foreground">تواصل مع المتعلمين الآخرين وشارك خبراتك</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Post Button */}
            {isAuthenticated ? (
              <Card className="p-6 border border-border">
                <button
                  onClick={() => setShowNewPost(!showNewPost)}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-muted-foreground hover:border-cyan-500/50 transition-colors text-right flex items-center justify-between group"
                >
                  <Plus className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  <span>ما الذي تود مشاركته؟</span>
                </button>

                {/* New Post Form */}
                {showNewPost && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-border">
                    {/* Post Type Selector */}
                    <div className="flex gap-2">
                      {(["post", "question", "achievement"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setPostType(type)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            postType === type
                              ? "bg-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                              : "bg-card border border-border text-muted-foreground hover:border-cyan-500/50"
                          }`}
                        >
                          {type === "post" && "منشور"}
                          {type === "question" && "سؤال"}
                          {type === "achievement" && "إنجاز"}
                        </button>
                      ))}
                    </div>

                    {/* Title Input */}
                    <input
                      type="text"
                      placeholder="عنوان المنشور..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />

                    {/* Content Textarea */}
                    <textarea
                      placeholder="اكتب محتوى المنشور..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowNewPost(false)}
                        className="px-4 py-2 rounded-lg bg-card border border-border text-muted-foreground hover:border-border transition-colors font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={createPostMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        نشر
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 border border-border text-center">
                <p className="text-muted-foreground mb-4">يجب تسجيل الدخول لنشر منشور</p>
                <a
                  href="/api/oauth/callback"
                  className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  تسجيل الدخول
                </a>
              </Card>
            )}

            {/* Posts Feed */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-6 border border-border hover:border-cyan-500/50 transition-colors"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                          <div>
                            <p className="font-semibold">مستخدم</p>
                            <p className="text-xs text-muted-foreground">منذ ساعة</p>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300">
                        {post.type === "post" && "منشور"}
                        {post.type === "question" && "سؤال"}
                        {post.type === "achievement" && "إنجاز"}
                      </span>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>

                    {/* Post Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors group">
                        <Heart className="w-4 h-4 group-hover:fill-cyan-400" />
                        <span>{post.likesCount}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors ml-auto">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border border-border">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">لا توجد منشورات بعد</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4">إحصائيات المجتمع</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الأعضاء النشطون</span>
                  <span className="font-bold text-cyan-400">2,543</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المنشورات</span>
                  <span className="font-bold text-cyan-400">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الأسئلة</span>
                  <span className="font-bold text-cyan-400">456</span>
                </div>
              </div>
            </Card>

            {/* Top Contributors */}
            <Card className="p-6 border border-border">
              <h3 className="font-bold mb-4">أفضل المساهمين</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">مساهم #{i}</p>
                      <p className="text-xs text-muted-foreground">{i * 50} نقطة</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Guidelines */}
            <Card className="p-6 border border-border bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
              <h3 className="font-bold mb-3">قواعد المجتمع</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• احترم جميع الأعضاء</li>
                <li>• شارك معرفتك بسخاء</li>
                <li>• تجنب الرسائل المزعجة</li>
                <li>• ركز على المحتوى التعليمي</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
