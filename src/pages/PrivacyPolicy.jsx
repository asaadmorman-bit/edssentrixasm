import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold text-white mb-3 border-b border-slate-800 pb-2">{title}</h2>
    <div className="text-slate-400 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Effective Date: May 12, 2026 &nbsp;·&nbsp; Last Updated: May 12, 2026</p>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl">
            This Privacy Policy describes how <strong className="text-white">Emerging Defense Solutions, LLC</strong> ("EDS," "we," "us," or "our") collects, uses, and protects information in connection with the <strong className="text-white">EDS Sentrix ASM</strong> platform.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p><strong className="text-slate-200">Account & Identity Information:</strong> When you register or request beta access, we collect your name, business email address, organization name, and role.</p>
          <p><strong className="text-slate-200">Personally Identifiable Information (PII):</strong> When you use the Dispatch Center or related services, we may collect client names, service addresses, contact phone numbers, and case reference numbers. All PII fields are masked at rest and in the UI pursuant to SOC 2 Control CC6.1.</p>
          <p><strong className="text-slate-200">Legal & Case Documents:</strong> Files uploaded to the platform (e.g., affidavits, court orders, powers of attorney) are encrypted and stored in private cloud storage. Re-authentication is required to access document contents.</p>
          <p><strong className="text-slate-200">Security & Operational Data:</strong> We collect endpoint telemetry, authentication logs, network event data, and threat intelligence signals for SOCaaS / MSSP monitoring purposes.</p>
          <p><strong className="text-slate-200">Usage Data:</strong> We automatically collect browser type, IP address, pages visited, and actions taken within the platform to improve service quality.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc list-inside space-y-2">
            <li>To provision and operate your EDS Sentrix ASM account and dashboard.</li>
            <li>To process and fulfill legal, property, and security dispatch requests via our ClickUp-integrated operations system.</li>
            <li>To deliver 24/7 SOCaaS / MSSP monitoring, threat detection, and incident response services.</li>
            <li>To manage compliance training progress and generate insurance-eligible completion certificates.</li>
            <li>To communicate service updates, security alerts, and ETA confirmations via email or SMS.</li>
            <li>To comply with applicable law, court orders, or regulatory obligations.</li>
            <li>To detect, investigate, and prevent fraudulent or unauthorized activity.</li>
          </ul>
        </Section>

        <Section title="3. PII Protection & Access Controls">
          <p>EDS Sentrix ASM implements multi-layered PII protection consistent with SOC 2 Type II principles:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-slate-200">Masking at rest:</strong> All PII fields are obscured in the UI by default.</li>
            <li><strong className="text-slate-200">Re-authentication gates:</strong> PIN or MFA verification is required to reveal PII or view uploaded documents.</li>
            <li><strong className="text-slate-200">Zero Trust network:</strong> All requests traverse Cloudflare's Zero Trust layer — no implicit trust for any user or device.</li>
            <li><strong className="text-slate-200">AES-256 encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
            <li><strong className="text-slate-200">Role-based access control (RBAC):</strong> Access to sensitive data is restricted to authorized roles only.</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing & Third Parties">
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong className="text-slate-200">ClickUp:</strong> Dispatch requests and operational task data are transmitted to ClickUp for workflow management. ClickUp's own privacy policy governs their handling of such data.</li>
            <li><strong className="text-slate-200">HubSpot:</strong> Beta waitlist and lead information is stored in HubSpot CRM for follow-up communications.</li>
            <li><strong className="text-slate-200">Cloudflare:</strong> Network traffic is routed through Cloudflare's Zero Trust and WAF infrastructure.</li>
            <li><strong className="text-slate-200">Microsoft Azure:</strong> Platform infrastructure is hosted on Azure with geo-redundant backups.</li>
            <li><strong className="text-slate-200">Law enforcement or regulators:</strong> Only when required by law or to protect the rights and safety of individuals.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your data for as long as your account is active or as needed to provide services. Case documents and legal files are retained per your service agreement and applicable recordkeeping laws. You may request deletion of your account and associated data by contacting us at <a href="mailto:privacy@emergingdefensesolutions.com" className="text-amber-400 hover:underline">privacy@emergingdefensesolutions.com</a>.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (subject to legal retention requirements).</li>
            <li>Opt out of marketing communications at any time.</li>
            <li>Lodge a complaint with a supervisory authority (e.g., state attorney general).</li>
          </ul>
          <p className="mt-3">To exercise these rights, contact: <a href="mailto:privacy@emergingdefensesolutions.com" className="text-amber-400 hover:underline">privacy@emergingdefensesolutions.com</a></p>
        </Section>

        <Section title="7. HIPAA Considerations">
          <p>EDS Sentrix ASM may process information on behalf of medical clinic clients. Where applicable, EDS operates as a Business Associate under HIPAA. A Business Associate Agreement (BAA) is available upon request for covered entity clients.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>EDS Sentrix ASM is a B2B platform intended for business professionals. We do not knowingly collect personal information from individuals under the age of 18.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy periodically. We will notify active users of material changes via email or an in-platform alert. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>Emerging Defense Solutions, LLC<br />
          Washington, DC Metro Area (DMV)<br />
          Email: <a href="mailto:privacy@emergingdefensesolutions.com" className="text-amber-400 hover:underline">privacy@emergingdefensesolutions.com</a><br />
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