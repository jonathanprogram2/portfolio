const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed"});
    }

    try {
        const { company, name, email, message } = req.body || {};
        if (!company || !name || !email || !message) {
            return res.status(400).json({ ok: false, error: "Missing fields" });
        }

        // Create SMTP transporter (Outlook / Office365)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,  
                pass: process.env.SMTP_PASS, 
            },
            tls: {
                // helpful on servless, lets STARTTLS upgrade properly
                ciphers: "TLSv1.2",
            }
        });

        await transporter.verify();

        const subject = `New JAMX inquiry: ${name} (${company})`;
        const text =
            `Company: ${company}\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}\n`;

        const html = `
            <h2>New JAMX Inquiry</h2>
            <p><b>Company:</b> ${company}</p>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b></p>
            <pre style="white-space:pre-wrap;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${message}</pre>
        `;

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.TO_EMAIL || "jamxstudios@outlook.com",
            replyTo: email,
            subject,
            text,
            html,
        });

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("contact api error:", err);
        // in prod keep it geenric; in preview/dev return message to help debug
        const safe = process.env.VERCEL_ENV === "production" ? "Email failed" : (err?.message || "Email failed");
        return res.status(500).json({ ok: false, error: "Email failed" });
    }
};
