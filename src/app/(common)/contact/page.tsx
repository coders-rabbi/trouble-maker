"use client";

import { FormEvent, useState } from "react";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import Swal from "sweetalert2";

const BRAND_NAME = "Trouble Maker Bangladesh";
const SUPPORT_PHONE = "01974004221";
const SUPPORT_EMAIL = "troublemakerbangladesh@gmail.com";
const SUPPORT_ADDRESS = "Dhaka, Bangladesh";

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black";

const fieldLabel =
  "mb-1.5 block text-[11px] font-semibold tracking-wide text-gray-400 uppercase";

const Page = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const messageInput = form.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;

    const name = nameInput.value;
    const phone = phoneInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    setSubmitting(true);
    try {
      // TODO: নিজের API এন্ডপয়েন্টে পাঠাও
      // await sendContactMessage({ name, phone, email, message });

      await Swal.fire({
        icon: "success",
        title: "মেসেজ পাঠানো হয়েছে!",
        text: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
        timer: 2000,
        showConfirmButton: false,
      });

      form.reset();
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "মেসেজ পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন।";

      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: errMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-12">
  <div className="mb-10 text-center">
    <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900">
      Get In Touch
    </h1>
    <p className="mt-2 text-sm text-gray-400">
      Have a question about your order or our products? We&apos;re here
      to help.
    </p>
  </div>

  <div className="grid gap-10 md:grid-cols-2">
    {/* ============ LEFT — CONTACT INFO ============ */}
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-white">
          <FaPhone size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Call Us
          </p>
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="mt-0.5 block text-base font-bold text-gray-900 hover:underline"
          >
            {SUPPORT_PHONE}
          </a>
          <p className="mt-1 text-xs text-gray-400">
            Sat – Thu, 10 AM – 8 PM
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white">
          <FaWhatsapp size={18} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            WhatsApp
          </p>
          <a
            href={`https://wa.me/880${SUPPORT_PHONE.slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 block text-base font-bold text-gray-900 hover:underline"
          >
            Message us directly
          </a>
          <p className="mt-1 text-xs text-gray-400">
            Fastest way to reach us
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-white">
          <FaEnvelope size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Email
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-0.5 block text-base font-bold text-gray-900 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-1 text-xs text-gray-400">
            We reply within 24 hours
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-white">
          <FaLocationDot size={16} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Location
          </p>
          <p className="mt-0.5 text-base font-bold text-gray-900">
            {SUPPORT_ADDRESS}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Online store — delivery nationwide
          </p>
        </div>
      </div>
    </div>

    {/* ============ RIGHT — CONTACT FORM ============ */}
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h2 className="mb-1 text-sm font-bold tracking-wide">
        SEND US A MESSAGE
      </h2>
      <p className="mb-6 text-xs text-gray-400">
        Fill out the form and we&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={fieldLabel}>Full Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={fieldLabel}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="01XXXXXXXXX"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={fieldLabel}>Email (Optional)</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={fieldLabel}>Message</label>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Tell us how we can help..."
            className={`${inputClasses} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#2C2D2D] disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  </div>

  {/* FOOTER NOTE */}
  <div className="mt-10 text-center">
    <p className="text-xs text-gray-400">
      {BRAND_NAME} — We value every message and try to respond as quickly
      as possible.
    </p>
  </div>
</div>    
    </>
  );
};

export default Page;