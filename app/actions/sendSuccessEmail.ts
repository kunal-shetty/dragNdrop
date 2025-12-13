"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const PLAN_FEATURES: Record<string, string[]> = {
  basic: [
    "20 exports per day",
    "Basic components",
    "Email support",
    "Community access",
  ],
  pro: [
    "Unlimited exports",
    "All components",
    "Priority support",
    "Custom branding",
    "Team collaboration",
  ],
  lifetime: [
    "Unlimited access forever",
    "All future updates",
    "Premium support",
    "Source code access",
    "Commercial license",
  ],
}

export async function sendSuccessEmail(
  email: string,
  name: string,
  plan: string
) {
  if (!email) return

  const formattedPlan =
    plan.charAt(0).toUpperCase() + plan.slice(1)

  const features = PLAN_FEATURES[plan] || []

  const featuresHtml = features.length
    ? `
      <ul>
        ${features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    `
    : ""

  await resend.emails.send({
    from: "BuildIT <onboarding@resend.dev>",
    to: [email],
    subject: "Thank You for Choosing BuildIT 🎉",
    html: `
      <h2>Payment Successful 🎉</h2>

      <p>Hi ${name || "there"},</p>

      <p>
        Thank you for purchasing the <strong>${formattedPlan} Plan</strong> on
        <strong>BuildIT Website Builder</strong>.
        Your payment has been successfully processed, and your access is now active.
      </p>

      ${
        featuresHtml
          ? `
            <p><strong>Your plan includes:</strong></p>
            ${featuresHtml}
          `
          : ""
      }

      <p>
        You can now continue building, editing, and exporting your website projects.
      </p>

      <p>
        If you need any help, reply to this email or contact us at
        <strong>+91 9307630015</strong>.
      </p>

      <br />

      <p>
        Thanks again for trusting BuildIT.
        <br />
        — The BuildIT Team
      </p>
    `,
  })
}
