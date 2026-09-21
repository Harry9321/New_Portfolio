"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/lib/data";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success";

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  multiline = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  multiline?: boolean;
}) {
  const hasValue = value.length > 0;
  const commonProps = {
    id,
    value,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(e.target.value),
    placeholder: " ",
    className: `peer w-full rounded-xl border bg-zinc-900/60 px-4 pb-2.5 pt-5 text-sm text-zinc-100 outline-none transition-colors placeholder-transparent backdrop-blur-sm focus:border-violet-500/60 ${
      error ? "border-red-500/60" : "border-zinc-800/60"
    }`,
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea rows={4} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 top-3.5 text-sm text-zinc-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-violet-400 ${
          hasValue ? "top-2 text-[11px] text-zinc-400" : ""
        }`}
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): boolean {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    // Simulated network round-trip — wire this up to your form handler
    // (Formspree, Resend, a serverless function, etc.) of choice.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <section id="contact" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something reliable together"
          description="Open to backend, platform, and applied-AI roles. Reach out — I usually reply within a day."
          align="center"
        />

        <div className="card-glow rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 backdrop-blur-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FloatingField
              id="name"
              label="Name"
              value={name}
              onChange={setName}
              error={errors.name}
            />
            <FloatingField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />
            <FloatingField
              id="message"
              label="Message"
              value={message}
              onChange={setMessage}
              error={errors.message}
              multiline
            />

            <motion.button
              type="submit"
              disabled={status === "submitting"}
              whileHover={{ scale: status === "idle" ? 1.01 : 1 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_0_rgba(139,92,246,0.5)] transition-shadow duration-300 hover:shadow-[0_0_36px_2px_rgba(139,92,246,0.4)] disabled:opacity-70"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "submitting" ? (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending&hellip;
                  </motion.span>
                ) : status === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Message sent
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <p className="text-center text-xs text-zinc-500">
              Or reach me directly at{" "}
              <a
                href={`mailto:${profile.email}`}
                className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-violet-300"
              >
                {profile.email}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
