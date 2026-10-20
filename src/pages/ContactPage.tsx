import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  Globe2,
  Clock,
  Lock,
  ArrowRight
} from 'lucide-react';
import { apiClient, ContactInquiry } from '../services/apiClient';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactInquiry>({
    fullName: '',
    organizationName: '',
    officialEmail: '',
    phoneNumber: '',
    jurisdiction: 'United Arab Emirates / GCC',
    currentSystem: 'Hybrid (Spreadsheets & Email)',
    annualCertificates: '500 - 2,500 Certificates/Year',
    inquiryDetails: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      setErrorMessage('Please provide your full professional name.');
      return;
    }
    if (!formData.organizationName.trim() || formData.organizationName.length < 2) {
      setErrorMessage('Please enter your authority or organization name.');
      return;
    }
    if (!formData.officialEmail.includes('@') || !formData.officialEmail.includes('.')) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }
    if (!formData.inquiryDetails.trim() || formData.inquiryDetails.length < 10) {
      setErrorMessage('Please provide at least 10 characters describing your digital workflow requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.submitContactInquiry(formData);
      if (res.success) {
        setConfirmation({
          id: res.confirmationId,
          message: res.message
        });
      } else {
        setErrorMessage(res.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-12 text-left">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Institutional Consultations
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Discuss Your Certification Processing Requirements
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Connect with our systems architects to evaluate digital transformation options for your certification body, authority, or manufacturing enterprise.
          </p>
        </div>
      </section>

      {/* 2. Main Content: Form + Information Column */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="card-enterprise rounded-2xl p-8 sm:p-10 bg-white border border-slate-200">
              
              {confirmation ? (
                /* Success State */
                <div className="space-y-6 text-center py-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006837] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Inquiry Successfully Registered
                    </h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      {confirmation.message}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 inline-block text-left text-xs space-y-1">
                    <div className="text-slate-500 uppercase font-mono text-[10px]">Reference Tracking Identifier</div>
                    <div className="font-mono font-bold text-slate-900 text-sm">{confirmation.id}</div>
                    <div className="text-slate-500 text-[11px]">Logged to HCPT Enterprise Intake Ledger</div>
                  </div>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmation(null);
                        setFormData({
                          fullName: '',
                          organizationName: '',
                          officialEmail: '',
                          phoneNumber: '',
                          jurisdiction: 'United Arab Emirates / GCC',
                          currentSystem: 'Hybrid (Spreadsheets & Email)',
                          annualCertificates: '500 - 2,500 Certificates/Year',
                          inquiryDetails: ''
                        });
                      }}
                      className="px-5 py-2.5 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                    <Link
                      to="/platform-demo"
                      className="px-5 py-2.5 bg-[#006837] text-white rounded text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Explore Interactive Demo
                    </Link>
                  </div>
                </div>
              ) : (
                /* Form Input State */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                      Enterprise Engagement Form
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      All submissions are evaluated under standard institutional confidentiality protocols.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>{errorMessage}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Dr. Tariq Al-Hashimi"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="organizationName" className="text-xs font-bold text-slate-700">
                        Organization / Authority <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="organizationName"
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. Gulf Halal Assurance Board"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="officialEmail" className="text-xs font-bold text-slate-700">
                        Official Institutional Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="officialEmail"
                        type="email"
                        required
                        value={formData.officialEmail}
                        onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                        placeholder="tariq@authority.gov"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phoneNumber" className="text-xs font-bold text-slate-700">
                        Direct Telephone (Optional)
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+971 4 000 0000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="jurisdiction" className="text-xs font-bold text-slate-700">
                        Primary Region
                      </label>
                      <select
                        id="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="United Arab Emirates / GCC">United Arab Emirates / GCC</option>
                        <option value="Saudi Arabia (SASO / SFDA)">Saudi Arabia (SASO / SFDA)</option>
                        <option value="Malaysia / ASEAN (JAKIM)">Malaysia / ASEAN (JAKIM)</option>
                        <option value="Indonesia (BPJPH / MUI)">Indonesia (BPJPH / MUI)</option>
                        <option value="European Union / UK">European Union / UK</option>
                        <option value="North America / Americas">North America / Americas</option>
                        <option value="OIC Member State (Universal)">OIC Member State (Universal)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="currentSystem" className="text-xs font-bold text-slate-700">
                        Current Operating Model
                      </label>
                      <select
                        id="currentSystem"
                        value={formData.currentSystem}
                        onChange={(e) => setFormData({ ...formData, currentSystem: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="Paper & Physical Binders">Paper & Physical Binders</option>
                        <option value="Hybrid (Spreadsheets & Email)">Hybrid (Spreadsheets & Email)</option>
                        <option value="Custom In-House Legacy Database">Custom In-House Legacy Database</option>
                        <option value="General Commercial ERP">General Commercial ERP</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="annualCertificates" className="text-xs font-bold text-slate-700">
                        Estimated Annual Scale
                      </label>
                      <select
                        id="annualCertificates"
                        value={formData.annualCertificates}
                        onChange={(e) => setFormData({ ...formData, annualCertificates: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="Under 500 Certificates/Year">Under 500 Certificates/Year</option>
                        <option value="500 - 2,500 Certificates/Year">500 - 2,500 Certificates/Year</option>
                        <option value="2,500 - 10,000 Certificates/Year">2,500 - 10,000 Certificates/Year</option>
                        <option value="10,000+ Certificates/Year (Statutory)">10,000+ Certificates/Year (Statutory)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inquiryDetails" className="text-xs font-bold text-slate-700">
                      Processing Objectives & Operational Scope <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="inquiryDetails"
                      rows={4}
                      required
                      value={formData.inquiryDetails}
                      onChange={(e) => setFormData({ ...formData, inquiryDetails: e.target.value })}
                      placeholder="Please summarize your target timeline, key compliance standards, number of inspection personnel, and whether on-premises or sovereign cloud hosting is required..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#006837] text-white text-xs font-bold hover:bg-[#00502b] disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Logging Inquiry to HCPT System...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Official Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* Right Column: Informational Overview */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="card-enterprise rounded-xl p-6 bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Institutional Engagement Protocol
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Following submission of your inquiry, our enterprise architecture team conducts the following discovery sequence:
              </p>
              
              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="block text-slate-900">Initial Scope Review (48 Hours)</strong>
                    Evaluation of jurisdictional parameters and existing database schemas.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-900">Bespoke Platform Walkthrough</strong>
                    A live demonstration using simulated workflows matching your specific sector.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="block text-slate-900">Architecture & Deployment Proposal</strong>
                    Detailed specification of cloud hosting, data migration, and training timeline.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Security & Confidentiality</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All inquiries are treated with strict confidentiality. Non-Disclosure Agreements (NDAs) can be executed prior to technical discussions regarding formulation datasets or sovereign auditing workflows.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                Direct Email: contact@hcpt.example.com
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Immediate Access</span>
              </div>
              <div className="text-sm font-bold">Prefer to test the system self-service?</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our interactive platform demo allows you to inspect synthetic applications, verify document checklists, and issue sample certificates right now.
              </p>
              <Link
                to="/platform-demo"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
