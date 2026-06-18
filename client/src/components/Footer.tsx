import { useLocation } from "wouter";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [, setLocation] = useLocation();

  const footerLinks = {
    platform: [
      { label: "الرئيسية", href: "/" },
      { label: "الدورات", href: "/courses" },
      { label: "المجتمع", href: "/community" },
      { label: "الفعاليات", href: "/events" },
    ],
    resources: [
      { label: "المدونة", href: "/" },
      { label: "الموارد", href: "/courses" },
      { label: "الشهادات", href: "/certificates" },
      { label: "لوحة المتصدرين", href: "/leaderboard" },
    ],
    company: [
      { label: "من نحن", href: "/about" },
      { label: "اتصل بنا", href: "/contact" },
      { label: "سياسة الخصوصية", href: "/privacy" },
      { label: "شروط الاستخدام", href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/nai-platform", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/nai-platform", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/nai-platform", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/nai-platform", label: "Instagram" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="container py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="text-xl font-bold">NAI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              منصة تعليمية متكاملة تجمع بين التعلم الرقمي والذكاء الاصطناعي
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-card border border-border hover:border-cyan-500/50 flex items-center justify-center hover:text-cyan-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold mb-4">المنصة</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link, idx) => (
                <li key={`platform-${idx}`}>
                  <button
                    onClick={() => setLocation(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">الموارد</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, idx) => (
                <li key={`resource-${idx}`}>
                  <button
                    onClick={() => setLocation(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">الشركة</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, idx) => (
                <li key={`company-${idx}`}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => setLocation(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-cyan-400" />
                <a href="mailto:info@nai.com" className="hover:text-foreground transition-colors">
                  info@nai.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-cyan-400" />
                <a href="tel:+201000000000" className="hover:text-foreground transition-colors">
                  +20 100 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 NAI – Training & Artificial Intelligence. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/privacy")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              سياسة الخصوصية
            </button>
            <div className="w-1 h-1 rounded-full bg-border"></div>
            <button
              onClick={() => setLocation("/terms")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              شروط الخدمة
            </button>
            <div className="w-1 h-1 rounded-full bg-border"></div>
            <button
              onClick={() => setLocation("/contact")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
