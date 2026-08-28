"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  Phone,
  User,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Locale, Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Official Facebook Messenger SVG Icon
export const MessengerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.512 3.734 7.209v3.533a.75.75 0 0 0 1.155.632l3.418-2.008c.552.095 1.118.146 1.693.146 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm1.08 12.38-2.613-2.787-5.099 2.787 5.607-5.952 2.68 2.787 5.033-2.787-5.608 5.952Z" />
  </svg>
);

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickReplies?: Array<{
    label: string;
    text: string;
    action?: "link" | "form" | "chat";
    url?: string;
  }>;
  showLeadForm?: boolean;
}

interface MessengerFloatingWidgetProps {
  locale: Locale;
  dict: Dictionary;
  facebookPageUsername?: string;
}

export const MessengerFloatingWidget: React.FC<MessengerFloatingWidgetProps> = ({
  locale,
  dict,
  facebookPageUsername = "growkub",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "messenger">("chat");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // In-chat Contact Form State
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadProjectType, setLeadProjectType] = useState("Web Application");
  const [leadBudget, setLeadBudget] = useState("30,000 - 70,000 บาท");
  const [leadNote, setLeadNote] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showInChatForm, setShowInChatForm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messengerUrl = `https://m.me/${facebookPageUsername}`;
  const t = dict.messengerWidget;

  // Initial welcome message
  useEffect(() => {
    const initialGreeting: Message = {
      id: "msg-welcome",
      sender: "bot",
      text:
        locale === "th"
          ? "สวัสดีครับ! ยินดีต้อนรับสู่ Growkub 🚀 พิมพ์สอบถามราคา รายละเอียดโปรเจกต์ หรือเลือกหัวข้อด้านล่างได้ทันทีครับ"
          : "Hello! Welcome to Growkub 🚀 Ask about project pricing, tech stacks, or pick a quick topic below.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickReplies: [
        {
          label: locale === "th" ? "💻 ทำ Web App" : "💻 Web App",
          text: locale === "th" ? "สนใจพัฒนา Web Application ครับ" : "I want to build a Web Application",
          action: "chat",
        },
        {
          label: locale === "th" ? "📱 ทำ Mobile App" : "📱 Mobile App",
          text: locale === "th" ? "สนใจทำ Mobile App iOS/Android ครับ" : "I want to build a Mobile App",
          action: "chat",
        },
        {
          label: locale === "th" ? "⚡ ขอใบเสนอราคา" : "⚡ Quote Request",
          text: locale === "th" ? "ขอใบเสนอราคา / ประเมินงบ" : "Request a quotation",
          action: "form",
        },
        {
          label: locale === "th" ? "🏢 ระบบธุรกิจ / ERP" : "🏢 ERP Systems",
          text: locale === "th" ? "ปรึกษาระบบจัดการธุรกิจ ERP ครับ" : "Consult about Enterprise ERP",
          action: "chat",
        },
      ],
    };
    setMessages([initialGreeting]);
  }, [locale]);

  // Auto prompt tooltip
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen && activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, activeTab, showInChatForm]);

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, locale }),
      });

      const data = await res.json();

      if (data.showLeadForm) {
        setShowInChatForm(true);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "ขอบคุณครับ ทีมงานกำลังตรวจสอบข้อมูลให้ครับ",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: data.quickReplies,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text:
          locale === "th"
            ? "สามารถทักข้อความพูดคุยกับทีม Senior Developer บน Facebook Messenger ได้โดยตรงเลยครับ"
            : "You can also chat directly with our Senior Developers on Facebook Messenger.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: [
          {
            label: locale === "th" ? "💬 เปิด Messenger" : "💬 Open Messenger",
            text: "เปิด Messenger",
            action: "link",
            url: messengerUrl,
          },
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit in-chat Lead form
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadContact.trim() || isSubmittingLead) return;

    setIsSubmittingLead(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[ขอใบเสนอราคา] ${leadProjectType} (${leadBudget})\nรายละเอียด: ${leadNote || "ไม่ได้ระบุ"}`,
          locale,
          contactInfo: {
            name: leadName,
            contact: leadContact,
            projectType: leadProjectType,
            budget: leadBudget,
            note: leadNote,
          },
        }),
      });

      const data = await res.json();

      const confirmationMessage: Message = {
        id: `bot-confirm-${Date.now()}`,
        sender: "bot",
        text:
          data.reply ||
          (locale === "th"
            ? `ขอบคุณครับคุณ ${leadName}! ทีมงานได้รับรายละเอียดโปรเจกต์ (${leadProjectType} - งบ ${leadBudget}) เรียบร้อยแล้ว จะติดต่อกลับทาง ${leadContact} ภายใน 24 ชม. ครับ`
            : `Thank you ${leadName}! We have received your project details (${leadProjectType} - ${leadBudget}) and will contact you via ${leadContact} within 24 hours.`),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickReplies: data.quickReplies,
      };

      setMessages((prev) => [...prev, confirmationMessage]);
      setShowInChatForm(false);
      setLeadName("");
      setLeadContact("");
      setLeadNote("");
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleQuickReplyClick = (qr: {
    label: string;
    text: string;
    action?: "link" | "form" | "chat";
    url?: string;
  }) => {
    if (qr.action === "link" && qr.url) {
      window.open(qr.url, "_blank", "noopener,noreferrer");
    } else if (qr.action === "form") {
      setShowInChatForm(true);
      handleSendMessage(qr.text);
    } else {
      handleSendMessage(qr.text);
    }
  };

  return (
    <aside aria-label="Live Chat & Messenger" className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Chat Hub Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[580px] max-h-[80vh] rounded-2xl bg-smoke-dark/95 border border-border/80 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col font-sans"
            style={{
              boxShadow:
                "0 20px 45px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), 0 0 30px -5px rgba(255,106,0,0.18)",
            }}
          >
            {/* Header with Mode Switch */}
            <div className="p-3.5 bg-gradient-to-r from-smoke to-smoke-dark border-b border-border/70 flex items-center justify-between relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-orange via-blue-500 to-brand-orange" />

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-smoke-black border border-border p-1.5 flex items-center justify-center shadow-inner">
                    <Image
                      src="/logo-icon.png"
                      alt="Growkub"
                      width={28}
                      height={28}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-smoke-black flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-text-primary tracking-tight">
                      Growkub Live Chat
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                      Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {locale === "th" ? "ตอบกลับทันที (AI + Dev)" : "Online / Instant Reply"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Switch to Messenger quick button */}
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={locale === "th" ? "สลับไปคุยบน Facebook Messenger" : "Open Facebook Messenger"}
                  className="w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MessengerIcon className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-smoke-black/60 hover:bg-smoke border border-border/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                  aria-label={t.close}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex border-b border-border/60 bg-smoke-black/40 text-xs font-mono shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors border-b-2",
                  activeTab === "chat"
                    ? "border-brand-orange text-brand-orange font-bold bg-smoke/40"
                    : "border-transparent text-text-muted hover:text-text-primary"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{locale === "th" ? "แชทบนเว็บ (สด)" : "Live Web Chat"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("messenger")}
                className={cn(
                  "flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors border-b-2",
                  activeTab === "messenger"
                    ? "border-blue-500 text-blue-400 font-bold bg-blue-500/10"
                    : "border-transparent text-text-muted hover:text-text-primary"
                )}
              >
                <MessengerIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Facebook Messenger</span>
              </button>
            </div>

            {/* TAB 1: INTERACTIVE ON-SITE LIVE CHAT */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden bg-smoke-dark/60">
                {/* Messages Stream */}
                <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto custom-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2 items-start",
                        msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Bot Avatar */}
                      {msg.sender === "bot" && (
                        <div className="w-7 h-7 rounded-lg bg-smoke-black border border-border flex items-center justify-center p-1 shrink-0 mt-0.5">
                          <Image
                            src="/logo-icon.png"
                            alt="Growkub"
                            width={20}
                            height={20}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* User Avatar */}
                      {msg.sender === "user" && (
                        <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[82%] space-y-1.5",
                          msg.sender === "user" ? "items-end text-right" : "items-start text-left"
                        )}
                      >
                        <div
                          className={cn(
                            "p-3 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line",
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-brand-orange to-orange-600 text-white rounded-tr-none font-medium"
                              : "bg-smoke border border-border/70 text-text-primary rounded-tl-none font-normal"
                          )}
                        >
                          {msg.text}
                        </div>

                        <span className="text-[10px] font-mono text-text-muted px-1 block">
                          {msg.timestamp}
                        </span>

                        {/* Quick Reply Pills */}
                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.quickReplies.map((qr, qIdx) => (
                              <button
                                key={qIdx}
                                type="button"
                                onClick={() => handleQuickReplyClick(qr)}
                                className="py-1 px-2.5 rounded-lg bg-smoke hover:bg-smoke-light border border-border/80 hover:border-brand-orange/50 text-[11px] text-text-secondary hover:text-text-primary transition-all flex items-center gap-1 shadow-sm active:scale-95 text-left"
                              >
                                <span>{qr.label}</span>
                                {qr.action === "link" ? (
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                ) : (
                                  <ChevronRight className="w-2.5 h-2.5 text-brand-orange" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-lg bg-smoke-black border border-border flex items-center justify-center p-1 shrink-0">
                        <Image
                          src="/logo-icon.png"
                          alt="Growkub"
                          width={20}
                          height={20}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-3 rounded-2xl rounded-tl-none bg-smoke border border-border/70 flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-brand-orange animate-bounce" />
                      </div>
                    </div>
                  )}

                  {/* In-Chat Callback / Quote Form */}
                  {showInChatForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-smoke border border-brand-orange/40 shadow-lg space-y-3 font-sans"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                          {locale === "th" ? "แบบฟอร์มขอใบเสนอราคา / สเปกระบบ" : "Project Quote & Requirements"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowInChatForm(false)}
                          className="text-text-muted hover:text-text-primary text-xs p-1"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSubmitLead} className="space-y-2.5 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-text-muted font-mono block mb-0.5">
                              {locale === "th" ? "ชื่อของคุณ *" : "Your Name *"}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={locale === "th" ? "เช่น คุณสมชาย" : "e.g. John"}
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-smoke-black border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted font-mono block mb-0.5">
                              {locale === "th" ? "เบอร์โทร / LINE ID / อีเมล *" : "Phone / LINE / Email *"}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={locale === "th" ? "08X-XXX-XXXX หรือ LINE ID" : "Phone or Email"}
                              value={leadContact}
                              onChange={(e) => setLeadContact(e.target.value)}
                              className="w-full py-1.5 px-2.5 rounded-lg bg-smoke-black border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-text-muted font-mono block mb-0.5">
                              {locale === "th" ? "ประเภทโปรเจกต์" : "Project Type"}
                            </label>
                            <select
                              value={leadProjectType}
                              onChange={(e) => setLeadProjectType(e.target.value)}
                              className="w-full py-1.5 px-2 rounded-lg bg-smoke-black border border-border text-text-primary focus:outline-none focus:border-brand-orange text-xs"
                            >
                              <option value="Web Application">Web Application</option>
                              <option value="Mobile App (iOS/Android)">Mobile App</option>
                              <option value="Business ERP / Dashboard">Business ERP</option>
                              <option value="E-Commerce Platform">E-Commerce</option>
                              <option value="Other Custom Software">Other System</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] text-text-muted font-mono block mb-0.5">
                              {locale === "th" ? "งบประมาณโดยประมาณ" : "Budget Range"}
                            </label>
                            <select
                              value={leadBudget}
                              onChange={(e) => setLeadBudget(e.target.value)}
                              className="w-full py-1.5 px-2 rounded-lg bg-smoke-black border border-border text-text-primary focus:outline-none focus:border-brand-orange text-xs"
                            >
                              <option value="ต่ำกว่า 30,000 บาท">&lt; 30,000 บาท</option>
                              <option value="30,000 - 70,000 บาท">30,000 - 70,000 บาท</option>
                              <option value="70,000 - 150,000 บาท">70,000 - 150,000 บาท</option>
                              <option value="150,000+ บาท">150,000+ บาท</option>
                              <option value="ยังไม่แน่ใจ (ปรึกษาก่อน)">ยังไม่แน่ใจ (ปรึกษาก่อน)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-text-muted font-mono block mb-0.5">
                            {locale === "th" ? "รายละเอียดความต้องการ / สเปกระบบที่ต้องการ" : "Project Requirements / Idea"}
                          </label>
                          <textarea
                            rows={2}
                            placeholder={
                              locale === "th"
                                ? "เช่น ต้องการเว็บขายของ มีระบบชำระเงิน และระบบสต็อกสินค้า..."
                                : "e.g. Need an e-commerce platform with payment gateway and inventory..."
                            }
                            value={leadNote}
                            onChange={(e) => setLeadNote(e.target.value)}
                            className="w-full py-1.5 px-2.5 rounded-lg bg-smoke-black border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange text-xs resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-hover hover:to-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-orange/20 transition-all disabled:opacity-50 active:scale-98"
                        >
                          {isSubmittingLead ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <span>{locale === "th" ? "ส่งรายละเอียดเพื่อประเมินราคา" : "Submit Project Details"}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Input Area */}
                <div className="p-2.5 border-t border-border/70 bg-smoke-black/60 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={locale === "th" ? "พิมพ์ข้อความสอบถามที่นี่..." : "Type your message here..."}
                      disabled={isLoading}
                      className="flex-1 py-2 px-3 rounded-xl bg-smoke border border-border/80 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange text-xs transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="w-9 h-9 rounded-xl bg-brand-orange hover:bg-brand-orange-hover disabled:bg-smoke disabled:text-text-muted text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: FACEBOOK MESSENGER DIRECT */}
            {activeTab === "messenger" && (
              <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-smoke-dark/70">
                <div className="space-y-4">
                  {/* Messenger Official Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/40 to-smoke-black border border-blue-500/30 text-center space-y-3 shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
                      <MessengerIcon className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-text-primary">
                        Facebook Messenger
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        m.me/{facebookPageUsername}
                      </p>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">
                      {locale === "th"
                        ? "แชทตรงกับทีม Senior Developer ผ่านแอปพลิเคชัน Facebook Messenger บนมือถือหรือคอมพิวเตอร์ของคุณได้ทันที"
                        : "Chat directly with our senior development team via Facebook Messenger app anytime."}
                    </p>

                    <a
                      href={messengerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <MessengerIcon className="w-4 h-4" />
                      <span>{locale === "th" ? "เปิด Messenger ทันที ↗" : "Open in Messenger ↗"}</span>
                    </a>
                  </div>

                  {/* Guarantee Box */}
                  <div className="p-3.5 rounded-xl bg-smoke border border-border flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{locale === "th" ? "รับประกันการตอบกลับภายใน 24 ชม." : "Guaranteed reply within 24 hours"}</span>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className="text-xs text-brand-orange hover:underline font-mono inline-flex items-center gap-1"
                  >
                    <span>← {locale === "th" ? "กลับไปแชทบนหน้าเว็บ" : "Back to web chat"}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="flex items-center gap-2 justify-end">
        {/* Floating Callout Tooltip */}
        <AnimatePresence>
          {!isOpen && hasPrompted && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-smoke-dark/95 border border-border hover:border-brand-orange/40 text-xs text-text-primary shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
              <span className="font-medium">
                {locale === "th" ? "💬 แชทปรึกษาโปรเจกต์ได้เลยครับ" : "💬 Chat with us live"}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-expanded={isOpen}
          aria-label="Toggle Live Chat & Messenger"
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none shadow-xl",
            isOpen
              ? "bg-smoke-dark border-2 border-brand-orange text-text-primary shadow-glow"
              : "bg-gradient-to-tr from-brand-orange via-orange-500 to-amber-500 text-white shadow-brand-orange/30 hover:shadow-brand-orange/50"
          )}
        >
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-brand-orange/30 animate-ping -z-10" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-brand-orange" />
          ) : (
            <MessageSquare className="w-6 h-6 text-white" />
          )}

          {!isOpen && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-smoke-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          )}
        </motion.button>
      </div>
    </aside>
  );
};
