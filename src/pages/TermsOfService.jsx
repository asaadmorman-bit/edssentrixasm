import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold text-white mb-3 border-b border-slate-800 pb-2">{title}</h2>
    <div className="text-slate-400 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-6 h-6 bg-amber-500/10 border border-amber-500/20 rounded flex items-center justify-center">
              <Shield className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-white font-bold text-sm">EDS Sentrix ASM</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-4">
            <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Effective Date: May 12, 2026 &nbsp;·&nbsp; Last Updated: May 12, 2026</p>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl">
            These Terms of Service ("Terms") govern your access to and use of the <strong className="text-white">EDS Sentrix ASM</strong> platform operated by <strong className="text-white">Emerging Defense Solutions, LLC</strong> ("EDS," "we," "us," or "our"). By accessing the platform, you agree to these Terms.
          </p>
        </div>

        <Section title="1. Eligibility & Accounts">
          <p>EDS Sentrix ASM is a business-to-business (B2B) platform. You must be at least 18 years of age and authorized to act on behalf of a registered business entity to create an account.</p>
          <p>You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized access at <a href="mailto:security@emergingdefensesolutions.com" className="text-amber-400 hover:underline">security@emergingdefensesolutions.com</a>.</p>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms or applicable law.</p>
        </Section>

        <Section title="2. Platform Services">
          <p>EDS Sentrix ASM provides access to the following integrated modules, subject to your active subscription or service agreement:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-slate-200">Command Center / Dashboard:</strong> Unified operational visibility across security, compliance, and field services.</li>
            <li><strong className="text-slate-200">SOCaaS / MSSP Monitoring:</strong> 24/7 managed threat detection, endpoint monitoring, and incident escalation.</li>
            <li><strong className="text-slate-200">Legal & Security Dispatch:</strong> On-demand booking of mobile notaries, process servers, CPTED auditors, and other field professionals across the DMV region.</li>
            <li><strong className="text-slate-200">Compliance LMS:</strong> Employee training courses for cyber awareness, active shooter response, CPR/first aid, and related certifications.</li>
            <li><strong className="text-slate-200">Tactical Ops & Partner Pro Shop:</strong> Procurement of tactical gear, legal defense policies, and infrastructure services.</li>
            <li><strong className="text-slate-200">DevSecOps & CI/CD Pipeline:</strong> Secure deployment templates and security configuration tools.</li>
          </ul>
        </Section>

        <Section title="3. Acceptable Use">
          <p>You agree to use EDS Sentrix ASM only for lawful business purposes. You may not:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Use the platform to facilitate any illegal activity, including unauthorized surveillance or collection of personal data.</li>
            <li>Attempt to reverse engineer, decompile, or access non-public areas of the platform.</li>
            <li>Upload malicious code, conduct denial-of-service attacks, or interfere with platform operations.</li>
            <li>Submit false, fraudulent, or misleading dispatch requests.</li>
            <li>Share login credentials or allow unauthorized third parties to access your account.</li>
            <li>Use the Compliance LMS certifications in a misleading or fraudulent manner with insurance providers.</li>
          </ul>
        </Section>

        <Section title="4. Dispatch Services — Scope & Limitations">
          <p>Dispatch services (legal and property) are fulfilled by vetted independent professionals within the Washington DC, Maryland, and Virginia (DMV) metro area. EDS does not guarantee specific response times beyond stated service-level targets.</p>
          <p>EDS is not a licensed law firm and does not provide legal advice. Mobile notary, process serving, and document delivery services are administrative and logistical in nature.</p>
          <p>Service availability is subject to field capacity. In cases of unavailability, EDS will contact you within 30 minutes to confirm or reschedule.</p>
        </Section>

        <Section title="5. SOCaaS / MSSP Monitoring">
          <p>The SOCaaS service provides managed threat monitoring and does not constitute a guarantee against all cyber incidents. Incident response SLAs and escalation procedures are defined in your individual service agreement.</p>
          <p>You authorize EDS to monitor network traffic, endpoint telemetry, and security logs associated with enrolled devices and infrastructure during the term of your SOCaaS subscription.</p>
        </Section>

        <Section title="6. Data & PII Responsibilities">
          <p>You are responsible for the accuracy and legality of any personal data you submit to the platform, including client PII entered into dispatch requests or uploaded documents.</p>
          <p>You represent that you have obtained any necessary consents to share personal data with EDS for the purposes of service fulfillment.</p>
          <p>EDS processes PII in accordance with our <Link to="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>.</p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>All platform content, software, branding, and documentation are the exclusive property of Emerging Defense Solutions, LLC or its licensors. You are granted a limited, non-exclusive, non-transferable license to access and use the platform for your internal business purposes.</p>
          <p>You may not reproduce, distribute, or create derivative works from any platform content without prior written consent from EDS.</p>
        </Section>

        <Section title="8. Payments & Subscriptions">
          <p>Access to certain features requires a paid subscription or per-service fee as described in your service agreement or order form. All fees are non-refundable except as required by law or as explicitly stated in your service agreement.</p>
          <p>EDS reserves the right to modify pricing with 30 days' written notice to active subscribers.</p>
        </Section>

        <Section title="9. Disclaimers">
          <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE." EDS MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR UNINTERRUPTED SERVICE.</p>
          <p>EDS does not warrant that the platform will be error-free, that security monitoring will detect every threat, or that dispatch services will meet any specific regulatory requirement for your industry without independent legal review.</p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, EDS'S TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATED TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE GREATER OF (A) THE FEES PAID BY YOU IN THE THREE (3) MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED DOLLARS ($100).</p>
          <p>EDS shall not be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits or data loss, arising from your use of the platform.</p>
        </Section>

        <Section title="11. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless EDS and its officers, employees, and agents from any claims, damages, or expenses (including reasonable attorneys' fees) arising from your use of the platform, your violation of these Terms, or your submission of unlawful or inaccurate data.</p>
        </Section>

        <Section title="12. Governing Law & Dispute Resolution">
          <p>These Terms are governed by the laws of the District of Columbia, without regard to conflict of law principles. Any disputes shall be resolved by binding arbitration in Washington, DC, under the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction.</p>
        </Section>

        <Section title="13. Modifications">
          <p>We reserve the right to update these Terms at any time. Material changes will be communicated via email or in-platform notification at least 14 days before taking effect. Continued use of the platform after the effective date constitutes acceptance.</p>
        </Section>

        <Section title="14. Contact">
          <p>Emerging Defense Solutions, LLC<br />
          Washington, DC Metro Area (DMV)<br />
          Email: <a href="mailto:legal@emergingdefensesolutions.com" className="text-amber-400 hover:underline">legal@emergingdefensesolutions.com</a><br />
          Website: <a href="https://emergingdefensesolutions.com" className="text-amber-400 hover:underline" target="_blank" rel="noopener noreferrer">emergingdefensesolutions.com</a></p>
        </Section>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/60 py-6 text-center">
        <p className="text-slate-600 text-xs">© 2026 Emerging Defense Solutions, LLC. All rights reserved.</p>
      </div>
    </div>
  );
}