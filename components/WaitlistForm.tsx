"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  size: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  size?: string;
}

export default function WaitlistForm() {
  const [form, setForm] = useState<FormData>({ 
    name: "", 
    email: "", 
    phone: "",
    gender: "",
    size: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".waitlist-element", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
      },
    });
  }, { scope: container });

  function validate(): FormErrors {
    const errs: FormErrors = {};

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      errs.name = "Name is required";
    } else if (trimmedName.length > 200) {
      errs.name = "Name is too long";
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      errs.email = "Email is required";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      errs.email = "Enter a valid email address";
    }

    const trimmedPhone = form.phone.trim();
    if (trimmedPhone && !/^[+]?[\d\s\-()]{7,20}$/.test(trimmedPhone)) {
      errs.phone = "Enter a valid phone number";
    }

    if (!form.gender) {
      errs.gender = "Gender is required";
    }

    if (!form.size) {
      errs.size = "Size is required";
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("waitlist_users").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        gender: form.gender,
        size: form.size,
      });

      if (error) {
        // Unique constraint violation on email
        if (error.code === "23505") {
          setServerError("This email is already on the waitlist!");
          return;
        }
        throw error;
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Waitlist error:", err);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  }

  // Success state
  if (isSubmitted) {
    return (
      <section
        ref={container}
        id="waitlist"
        className="border-t border-black/10 bg-[#FFFFFF] px-6 py-32 md:px-12 lg:px-24"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="waitlist-element rounded-2xl border border-black/10 bg-[#FAFAFA] p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0350F0]/10">
              <svg className="h-8 w-8 text-[#0350F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-bebas text-4xl tracking-wide text-black/90">
              YOU&apos;RE IN
            </h2>
            <p className="mt-4 font-inter text-sm leading-relaxed text-black/60">
              We&apos;ll notify you at <span className="font-medium text-black/80">{form.email.trim().toLowerCase()}</span> when
              it&apos;s your turn. Stay tuned.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={container}
      id="waitlist"
      className="border-t border-black/10 bg-[#FFFFFF] px-6 py-32 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="waitlist-element mb-12 text-center">
          <h2 className="font-bebas text-4xl tracking-wide text-black/90 md:text-5xl">
            JOIN THE WAITLIST
          </h2>
          <p className="mx-auto mt-4 max-w-md font-inter text-sm leading-relaxed text-black/60">
            Be the first to own modular footwear. Limited spots for the first drop.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="waitlist-element space-y-5" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="waitlist-name" className="mb-1.5 block font-inter text-xs font-medium uppercase tracking-widest text-black/50">
              Full Name
            </label>
            <input
              id="waitlist-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className={`w-full border bg-white px-4 py-3.5 font-inter text-sm text-black/90 outline-none transition-colors placeholder:text-black/30 focus:border-[#0350F0] ${
                errors.name ? "border-[#0350F0]" : "border-black/10"
              }`}
            />
            {errors.name && (
              <p className="mt-1 font-inter text-xs text-[#0350F0]">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="waitlist-email" className="mb-1.5 block font-inter text-xs font-medium uppercase tracking-widest text-black/50">
              Email Address
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full border bg-white px-4 py-3.5 font-inter text-sm text-black/90 outline-none transition-colors placeholder:text-black/30 focus:border-[#0350F0] ${
                errors.email ? "border-[#0350F0]" : "border-black/10"
              }`}
            />
            {errors.email && (
              <p className="mt-1 font-inter text-xs text-[#0350F0]">{errors.email}</p>
            )}
          </div>

          {/* Gender and Size Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Gender */}
            <div>
              <label htmlFor="waitlist-gender" className="mb-1.5 block font-inter text-xs font-medium uppercase tracking-widest text-black/50">
                Gender
              </label>
              <div className="relative">
                <select
                  id="waitlist-gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`w-full appearance-none border bg-white px-4 py-3.5 font-inter text-sm text-black/90 outline-none transition-colors focus:border-[#0350F0] ${
                    errors.gender ? "border-[#0350F0]" : "border-black/10"
                  }`}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.gender && (
                <p className="mt-1 font-inter text-xs text-[#0350F0]">{errors.gender}</p>
              )}
            </div>

            {/* Size */}
            <div>
              <label htmlFor="waitlist-size" className="mb-1.5 block font-inter text-xs font-medium uppercase tracking-widest text-black/50">
                Size (UK)
              </label>
              <div className="relative">
                <select
                  id="waitlist-size"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className={`w-full appearance-none border bg-white px-4 py-3.5 font-inter text-sm text-black/90 outline-none transition-colors focus:border-[#0350F0] ${
                    errors.size ? "border-[#0350F0]" : "border-black/10"
                  }`}
                >
                  <option value="" disabled>Select Size</option>
                  {[4, 5, 6, 7, 8, 9, 10, 11].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.size && (
                <p className="mt-1 font-inter text-xs text-[#0350F0]">{errors.size}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="waitlist-phone" className="mb-1.5 block font-inter text-xs font-medium uppercase tracking-widest text-black/50">
              Phone <span className="normal-case tracking-normal text-black/30">(optional)</span>
            </label>
            <input
              id="waitlist-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className={`w-full border bg-white px-4 py-3.5 font-inter text-sm text-black/90 outline-none transition-colors placeholder:text-black/30 focus:border-[#0350F0] ${
                errors.phone ? "border-[#0350F0]" : "border-black/10"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 font-inter text-xs text-[#0350F0]">{errors.phone}</p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="border border-[#0350F0]/20 bg-[#0350F0]/5 px-4 py-3 text-center">
              <p className="font-inter text-sm text-[#0350F0]">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-[#0350F0] bg-[#0350F0] px-10 py-4 font-bebas text-xl tracking-widest text-white transition-all duration-300 hover:bg-transparent hover:text-[#0350F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                JOINING...
              </span>
            ) : (
              "JOIN WAITLIST"
            )}
          </button>

          <p className="text-center font-inter text-xs text-black/40">
            No spam. We&apos;ll only reach out when it&apos;s time.
          </p>
        </form>
      </div>
    </section>
  );
}
