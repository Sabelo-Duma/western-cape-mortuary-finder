"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  FileText,
  Stethoscope,
  Users,
  Heart,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type IntakeFormData, INITIAL_INTAKE_DATA } from "@/types/intake";

const STEPS = [
  { key: "deceased", icon: User, label: "Deceased" },
  { key: "death", icon: FileText, label: "Details" },
  { key: "doctor", icon: Stethoscope, label: "Doctor" },
  { key: "nok", icon: Users, label: "Next-of-Kin" },
  { key: "preferences", icon: Heart, label: "Preferences" },
  { key: "insurance", icon: Shield, label: "Insurance" },
] as const;

interface IntakeWizardProps {
  mortuaryId: string;
  mortuaryName: string;
  mortuarySlug: string;
  citySlug: string;
}

// --- Reusable form components ---

function FormField({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function FormInput({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:border-transparent transition-shadow"
    />
  );
}

function FormSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:border-transparent transition-shadow appearance-none"
    >
      {children}
    </select>
  );
}

function FormTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4965] focus:border-transparent transition-shadow resize-vertical"
    />
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 px-4 py-3 text-sm text-center transition-all ${
        selected
          ? "border-[#1B4965] bg-[#1B4965]/5 text-[#1B4965] font-semibold shadow-sm"
          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

// --- Main Wizard ---

export function IntakeWizard({
  mortuaryId,
  mortuaryName,
  mortuarySlug,
  citySlug,
}: IntakeWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeFormData>(INITIAL_INTAKE_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof IntakeFormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return data.deceased_full_name.trim() !== "" && data.deceased_date_of_death !== "";
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return (
          data.nok_full_name.trim() !== "" &&
          data.nok_phone.trim() !== "" &&
          data.nok_relationship.trim() !== ""
        );
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mortuary_id: mortuaryId,
          ...data,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-8">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Form Submitted Successfully
        </h2>
        <p className="text-gray-600 mb-2">
          Your details have been sent to <strong>{mortuaryName}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          They will contact you shortly on <strong>{data.nok_phone}</strong> to
          confirm arrangements. If this is urgent, please call them directly.
        </p>
        <Button
          onClick={() => router.push(`/mortuaries/${citySlug}/${mortuarySlug}`)}
          className="bg-[#1B4965] hover:bg-[#143A50] px-8 h-12"
        >
          Back to {mortuaryName}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-[#1B4965] font-medium mb-1">
          {mortuaryName}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Digital Intake Form
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          We understand this is a difficult time. Take your time filling in the details below.
        </p>
        <p className="text-xs text-red-500 mt-2">
          Fields marked with <span className="font-bold">*</span> are required
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;

          return (
            <div key={s.key} className="flex flex-col items-center gap-1.5 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className="focus:outline-none"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all ${
                    isActive
                      ? "border-[#1B4965] bg-[#1B4965] text-white shadow-lg shadow-[#1B4965]/20"
                      : isDone
                      ? "border-green-500 bg-green-500 text-white cursor-pointer"
                      : "border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
              </button>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? "text-[#1B4965]" : isDone ? "text-green-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {/* Progress line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute h-0.5 w-[calc(100%/6-2rem)] ${
                    isDone ? "bg-green-500" : "bg-gray-200"
                  }`}
                  style={{ left: `calc(${(i + 0.5) * (100 / 6)}%)`, top: "1.375rem" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step counter */}
      <div className="text-center mb-4">
        <span className="inline-block text-xs font-semibold text-white bg-[#1B4965] rounded-full px-3 py-1">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8">
        {step === 0 && <StepDeceased data={data} update={update} />}
        {step === 1 && <StepDeathDetails data={data} update={update} />}
        {step === 2 && <StepDoctor data={data} update={update} />}
        {step === 3 && <StepNextOfKin data={data} update={update} />}
        {step === 4 && <StepPreferences data={data} update={update} />}
        {step === 5 && <StepInsurance data={data} update={update} />}

        {error && (
          <div className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-2 h-11 px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gap-2 bg-[#1B4965] hover:bg-[#143A50] h-11 px-8"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
              className="gap-2 bg-green-600 hover:bg-green-700 h-11 px-8"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit Form
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

interface StepProps {
  data: IntakeFormData;
  update: (field: keyof IntakeFormData, value: string | boolean) => void;
}

function StepDeceased({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Deceased Information"
        subtitle="Details of the person who has passed away."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Full Name" required className="sm:col-span-2">
          <FormInput value={data.deceased_full_name} onChange={(v) => update("deceased_full_name", v)} placeholder="Full name as on ID document" />
        </FormField>
        <FormField label="SA ID Number">
          <FormInput value={data.deceased_id_number} onChange={(v) => update("deceased_id_number", v)} placeholder="13-digit ID number" maxLength={13} />
        </FormField>
        <FormField label="Gender" required>
          <FormSelect value={data.deceased_gender} onChange={(v) => update("deceased_gender", v)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </FormSelect>
        </FormField>
        <FormField label="Date of Birth">
          <FormInput type="date" value={data.deceased_date_of_birth} onChange={(v) => update("deceased_date_of_birth", v)} />
        </FormField>
        <FormField label="Date of Death" required>
          <FormInput type="date" value={data.deceased_date_of_death} onChange={(v) => update("deceased_date_of_death", v)} />
        </FormField>
        <FormField label="Marital Status">
          <FormSelect value={data.deceased_marital_status} onChange={(v) => update("deceased_marital_status", v)}>
            <option value="">-- Select --</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </FormSelect>
        </FormField>
        {data.deceased_marital_status === "married" && (
          <FormField label="Spouse Name">
            <FormInput value={data.deceased_spouse_name} onChange={(v) => update("deceased_spouse_name", v)} placeholder="Spouse's full name" />
          </FormField>
        )}
        <FormField label="Last Known Address" className="sm:col-span-2">
          <FormInput value={data.deceased_address} onChange={(v) => update("deceased_address", v)} placeholder="Street address, suburb, city" />
        </FormField>
      </div>
    </div>
  );
}

function StepDeathDetails({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Death Details"
        subtitle="Where and how the death occurred. This helps the mortuary prepare the correct paperwork."
      />
      <div className="space-y-5">
        <FormField label="Where did the death occur?" required>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {[
              { value: "hospital", label: "Hospital / Clinic" },
              { value: "home", label: "At Home" },
              { value: "unnatural", label: "Unnatural (accident, crime)" },
              { value: "other", label: "Other" },
            ].map((opt) => (
              <OptionButton key={opt.value} selected={data.death_scenario === opt.value} onClick={() => update("death_scenario", opt.value)}>
                {opt.label}
              </OptionButton>
            ))}
          </div>
        </FormField>

        {data.death_scenario === "hospital" && (
          <FormField label="Hospital / Clinic Name">
            <FormInput value={data.hospital_name} onChange={(v) => update("hospital_name", v)} placeholder="e.g. Groote Schuur Hospital" />
          </FormField>
        )}

        {data.death_scenario === "unnatural" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="text-sm text-amber-800 font-semibold mb-1">Important: Unnatural Deaths</p>
            <p className="text-sm text-amber-700 mb-4">
              For unnatural deaths (accident, suicide, homicide), SAPS must be contacted first.
              A post-mortem will be required before the body can be released.
            </p>
            <FormField label="SAPS Case Number (if available)">
              <FormInput value={data.saps_case_number} onChange={(v) => update("saps_case_number", v)} placeholder="e.g. CAS 123/2026" />
            </FormField>
          </div>
        )}

        <FormField label="Specific Location / Address">
          <FormInput value={data.death_location} onChange={(v) => update("death_location", v)} placeholder="Where the body currently is" />
        </FormField>
      </div>
    </div>
  );
}

function StepDoctor({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Doctor Details"
        subtitle="The certifying doctor completes Section B of the DHA-1663 form. Provide these details if you have them."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Doctor's Full Name" className="sm:col-span-2">
          <FormInput value={data.doctor_name} onChange={(v) => update("doctor_name", v)} placeholder="Dr. ..." />
        </FormField>
        <FormField label="Practice Number">
          <FormInput value={data.doctor_practice_number} onChange={(v) => update("doctor_practice_number", v)} placeholder="HPCSA practice number" />
        </FormField>
        <FormField label="Doctor's Phone">
          <FormInput value={data.doctor_phone} onChange={(v) => update("doctor_phone", v)} placeholder="+27..." />
        </FormField>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 text-center">
        <p className="text-sm text-blue-700">
          Don&apos;t have the doctor&apos;s details? No problem — the mortuary can obtain these from the hospital or attending physician.
        </p>
      </div>
    </div>
  );
}

function StepNextOfKin({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Next-of-Kin / Your Details"
        subtitle="Your details as the person arranging the funeral. This is used for Section A of the DHA-1663 form."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Your Full Name" required className="sm:col-span-2">
          <FormInput value={data.nok_full_name} onChange={(v) => update("nok_full_name", v)} placeholder="Full name as on ID document" />
        </FormField>
        <FormField label="Your SA ID Number">
          <FormInput value={data.nok_id_number} onChange={(v) => update("nok_id_number", v)} placeholder="13-digit ID number" maxLength={13} />
        </FormField>
        <FormField label="Relationship to Deceased" required>
          <FormSelect value={data.nok_relationship} onChange={(v) => update("nok_relationship", v)}>
            <option value="">-- Select --</option>
            <option value="spouse">Spouse</option>
            <option value="child">Son / Daughter</option>
            <option value="parent">Parent</option>
            <option value="sibling">Brother / Sister</option>
            <option value="grandchild">Grandchild</option>
            <option value="other_relative">Other Relative</option>
            <option value="friend">Friend</option>
            <option value="employer">Employer</option>
          </FormSelect>
        </FormField>
        <FormField label="Your Phone Number" required>
          <FormInput value={data.nok_phone} onChange={(v) => update("nok_phone", v)} placeholder="+27..." />
        </FormField>
        <FormField label="Email Address">
          <FormInput type="email" value={data.nok_email} onChange={(v) => update("nok_email", v)} placeholder="your@email.com" />
        </FormField>
        <FormField label="Your Address" className="sm:col-span-2">
          <FormInput value={data.nok_address} onChange={(v) => update("nok_address", v)} placeholder="Street address, suburb, city" />
        </FormField>
      </div>
    </div>
  );
}

function StepPreferences({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Burial / Cremation Preferences"
        subtitle="Let the mortuary know your preferences so they can prepare accordingly."
      />
      <div className="space-y-5">
        <FormField label="Burial or Cremation?">
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              { value: "burial", label: "Burial" },
              { value: "cremation", label: "Cremation" },
              { value: "undecided", label: "Not Sure Yet" },
            ].map((opt) => (
              <OptionButton key={opt.value} selected={data.disposition === opt.value} onClick={() => update("disposition", opt.value)}>
                {opt.label}
              </OptionButton>
            ))}
          </div>
        </FormField>

        <FormField label="Religion / Faith">
          <FormSelect value={data.religion} onChange={(v) => update("religion", v)}>
            <option value="">-- Select (optional) --</option>
            <option value="Christian">Christian</option>
            <option value="Muslim">Muslim</option>
            <option value="Hindu">Hindu</option>
            <option value="Jewish">Jewish</option>
            <option value="Traditional African">Traditional African</option>
            <option value="No religion">No religion</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormField>

        {data.religion === "Muslim" && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.urgent_burial} onChange={(e) => update("urgent_burial", e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Urgent burial required (within 24 hours)</p>
                <p className="text-xs text-blue-700 mt-0.5">The mortuary will prioritise this request.</p>
              </div>
            </label>
          </div>
        )}

        <FormField label="Cultural or Religious Requirements">
          <FormTextarea value={data.cultural_requirements} onChange={(v) => update("cultural_requirements", v)} placeholder="Any specific rituals, washing requirements, dress code, or other needs..." />
        </FormField>
      </div>
    </div>
  );
}

function StepInsurance({ data, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Insurance / Funeral Policy"
        subtitle="If the deceased had a funeral policy, provide the details below. This helps the mortuary assist with the claim."
      />
      <div className="space-y-5">
        <label className="flex items-center gap-4 cursor-pointer p-5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <input type="checkbox" checked={data.has_funeral_policy} onChange={(e) => update("has_funeral_policy", e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]" />
          <span className="text-sm font-medium text-gray-900">The deceased had a funeral policy / insurance</span>
        </label>

        {data.has_funeral_policy && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pl-4 border-l-3 border-[#1B4965]">
            <FormField label="Insurance Provider">
              <FormSelect value={data.insurance_provider} onChange={(v) => update("insurance_provider", v)}>
                <option value="">-- Select --</option>
                <option value="AVBOB">AVBOB</option>
                <option value="Old Mutual">Old Mutual</option>
                <option value="Metropolitan">Metropolitan</option>
                <option value="Hollard">Hollard</option>
                <option value="Clientele">Clientele</option>
                <option value="1Life">1Life</option>
                <option value="Sanlam">Sanlam</option>
                <option value="Liberty">Liberty</option>
                <option value="Discovery">Discovery</option>
                <option value="FNB">FNB Funeral Plan</option>
                <option value="Capitec">Capitec Funeral Plan</option>
                <option value="Other">Other</option>
              </FormSelect>
            </FormField>
            <FormField label="Policy Number">
              <FormInput value={data.policy_number} onChange={(v) => update("policy_number", v)} placeholder="Policy or membership number" />
            </FormField>
          </div>
        )}

        <FormField label="Additional Notes">
          <FormTextarea value={data.additional_notes} onChange={(v) => update("additional_notes", v)} placeholder="Anything else the mortuary should know..." />
        </FormField>
      </div>
    </div>
  );
}
