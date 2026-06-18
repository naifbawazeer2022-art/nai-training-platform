import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Lock, Bell, Eye, Palette, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Settings() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    communityDigest: true,
    darkMode: true,
    publicProfile: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("تم تحديث البيانات الشخصية بنجاح");
    setIsSaving(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("كلمات المرور الجديدة غير متطابقة");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("تم تحديث كلمة المرور بنجاح");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setIsSaving(false);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("تم تحديث الإعدادات");
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            الإعدادات
          </h1>
          <p className="text-xl text-muted-foreground">
            أدر حسابك والتفضيلات الخاصة بك
          </p>
        </div>
      </section>

      {/* Settings Tabs */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="security">الأمان</TabsTrigger>
              <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
              <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">البيانات الشخصية</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                        placeholder="بريدك الإلكتروني"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  الأمان وكلمة المرور
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      كلمة المرور الحالية
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                        placeholder="أدخل كلمة مرور جديدة"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        تأكيد كلمة المرور
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                        placeholder="أعد إدخال كلمة المرور"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isSaving ? "جاري التحديث..." : "تحديث كلمة المرور"}
                    </button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-cyan-400" />
                  إعدادات الإشعارات
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",
                      label: "الإشعارات عبر البريد الإلكتروني",
                      description: "استقبل الإشعارات المهمة عبر بريدك الإلكتروني",
                    },
                    {
                      key: "pushNotifications",
                      label: "إشعارات الدفع",
                      description: "استقبل إشعارات فورية على جهازك",
                    },
                    {
                      key: "courseUpdates",
                      label: "تحديثات الدورات",
                      description: "تنبيهات عند إضافة محتوى جديد للدورات المسجل فيها",
                    },
                    {
                      key: "communityDigest",
                      label: "ملخص المجتمع الأسبوعي",
                      description: "استقبل ملخص النقاشات والمنشورات الأسبوعية",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={preferences[item.key as keyof typeof preferences]}
                        onCheckedChange={() =>
                          handlePreferenceChange(
                            item.key as keyof typeof preferences
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-cyan-400" />
                  التفضيلات
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "darkMode",
                      label: "الوضع الداكن",
                      description: "تفعيل الوضع الداكن للواجهة",
                    },
                    {
                      key: "publicProfile",
                      label: "ملف شخصي عام",
                      description:
                        "اسمح للآخرين برؤية ملفك الشخصي والإنجازات",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-cyan-500/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={preferences[item.key as keyof typeof preferences]}
                        onCheckedChange={() =>
                          handlePreferenceChange(
                            item.key as keyof typeof preferences
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <Card className="p-8 border border-red-500/30 bg-red-500/5 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-red-400">منطقة الخطر</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">تسجيل الخروج</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  قم بتسجيل الخروج من حسابك على هذا الجهاز
                </p>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-red-600/20 text-red-400 font-semibold hover:bg-red-600/30 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
