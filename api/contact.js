import nodemailer from "nodemailer";
import { z } from "zod";

const ContactSchema = z.object({
    company: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
});

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    try {
        const data = ContactSchema.parse(req.body);

        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.OUTLOOK_USER,
                pass: process.env.OUTLOOK_PASS,
            },
        });

        await transporter.sendMail({
            from: `"JAMX Studios Website" <${process.env.OUTLOOK_USER}>`,
            to: "jamxstudios@outlook.com",
            replyTo: data.email,
            subject: `New inquiry from ${data.name} — ${data.company}`,
            text: `
Company: ${data.company}
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
            `,
            html: `
                <h2>New Website Inquiry</h2>
                <p><b>Company:</b> ${data.company}</p>
                <p><b>Name:</b> ${data.name}</p>
                <p><b>Email:</b> ${data.email}</p>
                <p><b>Message:</b><br/>${data.message.replace(/\n/g, "<br/>")}</p>
            `,
        });

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ ok: false, error: "Invalid data or mail send failed" });
    }
}