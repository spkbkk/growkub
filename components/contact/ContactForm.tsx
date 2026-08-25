"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Locale, Dictionary } from "@/lib/i18n";

interface ContactFormProps {
  locale: Locale;
  dict: Dictionary;
}

export const ContactForm: React.FC<ContactFormProps> = ({ locale, dict }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project_type: "Web Application",
    budget: "100,000 - 300,000",
    message: "",
    website_hp: "", // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = locale === "th" ? "กรุณากรอกชื่อของคุณ" : "Please enter your name";
    }
    if (!formData.email.trim()) {
      newErrors.email = locale === "th" ? "กรุณากรอกอีเมล" : "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        locale === "th"
          ? "รูปแบบอีเมลไม่ถูกต้อง"
          : "Please enter a valid email address";
    }
    if (!formData.project_type) {
      newErrors.project_type =
        locale === "th" ? "กรุณาเลือกประเภทโปรเจกต์" : "Please select a project type";
    }
    if (!formData.message.trim()) {
      newErrors.message =
        locale === "th"
          ? "กรุณาระบุรายละเอียดโปรเจกต์สั้นๆ"
          : "Please describe your project";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        locale === "th"
          ? "กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร"
          : "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project request");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.message || dict.contactPage.form.errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      project_type: "Web Application",
      budget: "100,000 - 300,000",
      message: "",
      website_hp: "",
    });
    setErrors({});
    setIsSuccess(false);
    setServerError(null);
  };

  const formDict = dict.contactPage.form;

  return (
    <Card className="p-6 sm:p-10 bg-smoke-dark/90 border-border relative shadow-card">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-10 space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-text-primary">
                {formDict.successTitle}
              </h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                {formDict.successMessage}
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={resetForm}
              >
                {formDict.sendAnother}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {serverError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Honeypot hidden input for anti-spam bots */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_hp}
                onChange={(e) =>
                  setFormData({ ...formData, website_hp: e.target.value })
                }
              />
            </div>

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label={formDict.name}
                required
                placeholder={formDict.namePlaceholder}
                value={formData.name}
                error={errors.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                label={formDict.email}
                required
                type="email"
                placeholder={formDict.emailPlaceholder}
                value={formData.email}
                error={errors.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Row 2: Phone/LINE & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label={formDict.phone}
                placeholder={formDict.phonePlaceholder}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <Input
                label={formDict.company}
                placeholder={formDict.companyPlaceholder}
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            {/* Row 3: Project Type & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                label={formDict.projectType}
                required
                options={formDict.projectTypes}
                value={formData.project_type}
                error={errors.project_type}
                onChange={(e) =>
                  setFormData({ ...formData, project_type: e.target.value })
                }
              />
              <Select
                label={formDict.budget}
                required
                options={formDict.budgetOptions}
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
              />
            </div>

            {/* Row 4: Message */}
            <Textarea
              label={formDict.message}
              required
              rows={4}
              placeholder={formDict.messagePlaceholder}
              value={formData.message}
              error={errors.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full font-semibold shadow-glow justify-center"
              >
                <Send className="w-4 h-4 mr-1" />
                <span>
                  {isSubmitting ? formDict.submitting : formDict.submitButton}
                </span>
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
};
