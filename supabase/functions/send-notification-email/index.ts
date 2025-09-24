import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type: 'status_update' | 'resolution_request';
  issueTitle?: string;
  status?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, type, issueTitle, status }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${to} for issue: ${issueTitle}`);

    let emailHtml = html;
    
    // Generate email content based on type
    if (type === 'status_update') {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Issue Status Update</h2>
          <p>Hello,</p>
          <p>Your reported issue "<strong>${issueTitle}</strong>" has been updated.</p>
          <p><strong>New Status:</strong> ${status}</p>
          <p>Our municipal team is working on resolving this issue. We'll keep you updated on the progress.</p>
          <p>Thank you for helping improve our community!</p>
          <br>
          <p>Best regards,<br>Municipal Team</p>
        </div>
      `;
    } else if (type === 'resolution_request') {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a;">Issue Resolved - Please Confirm</h2>
          <p>Hello,</p>
          <p>Great news! Your reported issue "<strong>${issueTitle}</strong>" has been resolved by our municipal team.</p>
          <p>Please open the app and confirm if the issue has been satisfactorily resolved.</p>
          <p>Your feedback helps us ensure quality service for all citizens.</p>
          <br>
          <p>Thank you for helping improve our community!</p>
          <br>
          <p>Best regards,<br>Municipal Team</p>
        </div>
      `;
    }

    // Use Resend API directly via HTTP
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Municipal Team <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Resend API error: ${emailResponse.status} - ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);