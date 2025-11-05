import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
    const [form, setForm] = useState({
        company: "",
        name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // clear/update error for this field
        setErrors(prev => {
            const next = { ...prev };

            if (name === "email") {
                const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
                if (ok) delete next.email;
                else next.email = "Invalid email";
            } else {
                if (value.trim()) delete next[name];
                else next[name] = `${name[0].toUpperCase()+name.slice(1)} cannot be empty`;
            }

            return next;
        });
    };

    const validate = () => {
        const newErrors = {};
        const email = form.email.trim();

        if (!form.company.trim()) newErrors.company = "Company cannot be empty";
        if (!form.name.trim()) newErrors.name = "Name cannot be empty";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
        if (!form.message.trim()) newErrors.message = "Message cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            setSent(false);

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");

            setSent(true);
            setForm({ company: "", name: "", email: "", message: "" });
        } catch (err) {
            console.error(err);
            alert("Sorry—something went wrong sending your message.");
            setSent(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact" className="w-full bg-[#000000] scroll-mt-28 md:scroll-mt-36 text-white pt-16 md:pt-28">
            <div className="w-full max-w-[1200px] mx-auto px-6 pt-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left side */}
                <div className="max-w-md">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="chip-anim mb-4"
                    >
                        Contact
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-extrabold leading-[1.1]"
                    >
                        Ready to elevate your digital presence?
                    </motion.h2>
                    <p className="text-white/70 mt-4 leading-relaxed">
                        Share your goals. We'll engineer a high-performance
                        website built for growth, speed, and scalability.
                    </p>
                </div>

                {/* Right side */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 max-w-lg w-full"
                    noValidate
                >
                    {["company", "name", "email"].map((field) => (
                        <div key={field}>
                            <label
                                htmlFor={field}
                                className="block text-xs font-semibold uppercase text-white/60 mb-2"
                            >
                                {field}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                id={field}
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                                className={`contact-input ${
                                    errors[field] ? "error" : ""
                                }`}
                                placeholder={`Enter your ${field}`}
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-xs mt-1">
                                    ⚠ {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-xs font-semibold uppercase text-white/60 mb-2"
                        >
                            How can we help you?
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows="4"
                            className={`contact-input resize-none ${
                                errors.message ? "error" : ""
                            }`}
                            placeholder="Tell us about your project..."
                        ></textarea>
                        {errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                                ⚠ {errors.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-6 gap-4">
                        <motion.button
                            whileHover={{ scale: sent ? 1 : 1.05, boxShadow: sent ? undefined : "0 0 20px #b293ff" }}
                            whileTap={{ scale: sent ? 1 : 0.97 }}
                            type="submit"
                            disabled={submitting || sent}
                            className={`relative px-6 py-2 rounded-xl font-semibold bg-white text-black flex items-center gap-2 shadow-[0_8px_25px_rgba(255,255,255,0.1)] transition 
                                ${(submitting || sent) ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            {sent ? "Sent!" : submitting ? "Sending..." : "Contact us"}
                            {!submitting && !sent && (
                                <motion.span
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.8 }}
                                >
                                    🚀
                                </motion.span>
                            )}
                            {sent && <span>✅</span>}
                        </motion.button>
                        {sent && (
                            <p className="text-green-400 text-sm ml-4">
                                Thanks! Your message was sent. We'll get back to you soon.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}