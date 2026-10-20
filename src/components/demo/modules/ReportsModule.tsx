import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { CertificationApplication, CertificateRecord, InspectionRecord } from '../../../types/certification';

interface ReportsModuleProps {
  applications: CertificationApplication[];
  certificates: CertificateRecord[];
  inspections: InspectionRecord[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  applications,
  certificates,
  inspections
}) => {
  // Compute workload metrics
  const assessorWorkload = [
    { name: 'Eng. Zayd Al-Ghamdi', role: 'Lead Assessor', activeDossiers: 3, capacity: 80 },
    { name: 'Dr. Mona Al-Saeed', role: 'Technical Assessor', activeDossiers: 2, capacity: 60 },
    { name: 'Fatima Al-Nuaimi', role: 'Pharmaceutical Specialist', activeDossiers: 2, capacity: 50 },
    { name: 'Sheikh M. Noorudeen', role: 'Shariah Board Member', activeDossiers: 1, capacity: 35 }
  ];

  const categoryBreakdown = [
    { category: 'Food & Beverage', count: 2, share: 40 },
    { category: 'Ingredients & Additives', count: 1, share: 20 },
    { category: 'Pharmaceuticals', count: 1, share: 20 },
    { category: 'Logistics & Warehousing', count: 1, share: 20 }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Executive Reports & Operational Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Throughput velocity, assessor capacity allocation, and certification compliance trends.
        </p>
      </div>

      {/* High-level performance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Average Triage Velocity
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3.2 Days</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>64% faster than manual paper intake</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Audit Conformance Rate
          </div>
          <div className="text-2xl font-extrabold text-[#006837]">94.8%</div>
          <div className="text-[11px] text-slate-500">First-time field audit pass</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            RFI Defect Clearance Time
          </div>
          <div className="text-2xl font-extrabold text-amber-900">4.5 Days</div>
          <div className="text-[11px] text-slate-500">Average applicant resubmission</div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Fraudulent Cert Incidents
          </div>
          <div className="text-2xl font-extrabold text-[#0F2C59]">Zero</div>
          <div className="text-[11px] text-emerald-700 font-semibold">100% SHA-256 protected</div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Assessor Capacity Allocation */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Assessor & Scientific Staff Workload
            </h3>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {assessorWorkload.map((staff, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{staff.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2 font-mono">({staff.role})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">
                    {staff.activeDossiers} dossiers ({staff.capacity}% capacity)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      staff.capacity > 75
                        ? 'bg-amber-600'
                        : 'bg-[#006837]'
                    }`}
                    style={{ width: `${staff.capacity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Certification Volume by Industry Sector
            </h3>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{cat.category}</span>
                  <span className="font-mono text-slate-600 font-bold">
                    {cat.count} Files ({cat.share}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0F2C59] h-full"
                    style={{ width: `${cat.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            All categories mapped to relevant ISO 17065 conformity standards and OIC/SMIIC guidelines.
          </div>
        </div>

      </div>

    </div>
  );
};
