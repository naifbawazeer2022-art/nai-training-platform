import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            اتصل بنا
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            هل لديك أسئلة أو اقتراحات؟ نود أن نسمع منك. تواصل معنا عبر أي من القنوات التالية.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border border-border text-center hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">البريد الإلكتروني</h3>
              <p className="text-muted-foreground mb-4">
                أرسل لنا بريداً إلكترونياً وسنرد عليك في أقرب وقت
              </p>
              <a
                href="mailto:info@nai.com"
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
              >
                info@nai.com
              </a>
            </Card>

            <Card className="p-8 border border-border text-center hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">الهاتف</h3>
              <p className="text-muted-foreground mb-4">
                اتصل بنا مباشرة خلال ساعات العمل
              </p>
              <a
                href="tel:+201000000000"
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
              >
                +20 100 000 0000
              </a>
            </Card>

            <Card className="p-8 border border-border text-center hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">العنوان</h3>
              <p className="text-muted-foreground">
                القاهرة، مصر
                <br />
                المقر الرئيسي
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder="بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">الموضوع</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-cyan-500/50 focus:outline-none transition-colors resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-border bg-card/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-4 max-w-2xl">
            {[
              {
                q: "كم تكلفة الدورات؟",
                a: "تختلف أسعار الدورات حسب المستوى والمدة. يمكنك الاطلاع على جميع الأسعار من صفحة الدورات.",
              },
              {
                q: "هل يمكنني الحصول على شهادة؟",
                a: "نعم، عند إكمال أي دورة بنجاح ستحصل على شهادة رقمية معترف بها.",
              },
              {
                q: "كم مدة الدورة الواحدة؟",
                a: "تتراوح مدة الدورات من 20 إلى 60 دقيقة، وتنقسم إلى دروس صغيرة يمكنك متابعتها بسهولة.",
              },
              {
                q: "هل هناك دعم تقني؟",
                a: "نعم، نوفر دعماً تقنياً 24/7 عبر البريد الإلكتروني والهاتف والدردشة.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border border-border">
                <h3 className="text-lg font-bold mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
