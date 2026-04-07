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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
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

export function IntakeWizard({
  mortuaryId,
  mortuaryName,
  mortuarySlug,
  citySlug,
}: IntakeWizardProps) {
  const router = useRouter();
  const { t } = useLanguage();
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
        return data.death_scenario !== "" as never;
      case 2:
        return true; // Doctor info is optional
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
      <div className="max-w-lg mx-auto text-center py-16 px-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Form Submitted Successfully
        </h2>
        <p className="text-gray-600 mb-2">
          Your details have been sent to <strong>{mortuaryName}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          They will contact you shortly on <strong>{data.nok_phone}</strong> to
          confirm arrangements. If this is urgent, please call them directly.
        </p>
        <Button
          onClick={() => router.push(`/mortuaries/${citySlug}/${mortuarySlug}`)}
          className="bg-[#1B4965] hover:bg-[#143A50]"
        >
          Back to {mortuaryName}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
          Submitting to: <strong>{mortuaryName}</strong>
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Intake Form
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          We understand this is a difficult time. Take your time filling in the details below.
          Fields marked * are required.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;

          return (
            <button
              key={s.key}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${
                isActive
                  ? "text-[#1B4965]"
                  : isDone
                  ? "text-green-600 cursor-pointer"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive
                    ? "border-[#1B4965] bg-[#1B4965] text-white"
                    : isDone
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-200 bg-white text-gray-300"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form steps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {step === 0 && (
          <StepDeceased data={data} update={update} />
        )}
        {step === 1 && (
          <StepDeathDetails data={data} update={update} />
        )}
        {step === 2 && (
          <StepDoctor data={data} update={update} />
        )}
        {step === 3 && (
          <StepNextOfKin data={data} update={update} />
        )}
        {step === 4 && (
          <StepPreferences data={data} update={update} />
        )}
        {step === 5 && (
          <StepInsurance data={data} update={update} />
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gap-2 bg-[#1B4965] hover:bg-[#143A50]"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
              className="gap-2 bg-green-600 hover:bg-green-700"
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Deceased Information</h2>
      <p className="text-sm text-gray-500">Details of the person who has passed away.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="deceased_full_name">Full Name *</Label>
          <Input id="deceased_full_name" value={data.deceased_full_name} onChange={(e) => update("deceased_full_name", e.target.value)} placeholder="Full name as on ID" />
        </div>
        <div>
          <Label htmlFor="deceased_id_number">SA ID Number</Label>
          <Input id="deceased_id_number" value={data.deceased_id_number} onChange={(e) => update("deceased_id_number", e.target.value)} placeholder="13-digit ID number" maxLength={13} />
        </div>
        <div>
          <Label htmlFor="deceased_gender">Gender *</Label>
          <select id="deceased_gender" value={data.deceased_gender} onChange={(e) => update("deceased_gender", e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="deceased_date_of_birth">Date of Birth</Label>
          <Input id="deceased_date_of_birth" type="date" value={data.deceased_date_of_birth} onChange={(e) => update("deceased_date_of_birth", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="deceased_date_of_death">Date of Death *</Label>
          <Input id="deceased_date_of_death" type="date" value={data.deceased_date_of_death} onChange={(e) => update("deceased_date_of_death", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="deceased_marital_status">Marital Status</Label>
          <select id="deceased_marital_status" value={data.deceased_marital_status} onChange={(e) => update("deceased_marital_status", e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]">
            <option value="">-- Select --</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        {data.deceased_marital_status === "married" && (
          <div>
            <Label htmlFor="deceased_spouse_name">Spouse Name</Label>
            <Input id="deceased_spouse_name" value={data.deceased_spouse_name} onChange={(e) => update("deceased_spouse_name", e.target.value)} placeholder="Spouse's full name" />
          </div>
        )}
        <div className="sm:col-span-2">
          <Label htmlFor="deceased_address">Last Known Address</Label>
          <Input id="deceased_address" value={data.deceased_address} onChange={(e) => update("deceased_address", e.target.value)} placeholder="Street address, suburb, city" />
        </div>
      </div>
    </div>
  );
}

function StepDeathDetails({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Death Details</h2>
      <p className="text-sm text-gray-500">Where and how the death occurred. This helps the mortuary prepare the correct paperwork.</p>

      <div className="space-y-4">
        <div>
          <Label>Where did the death occur? *</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { value: "hospital", label: "Hospital / Clinic" },
              { value: "home", label: "At Home" },
              { value: "unnatural", label: "Unnatural (accident, crime)" },
              { value: "other", label: "Other" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("death_scenario", opt.value)}
                className={`rounded-lg border px-4 py-3 text-sm text-left transition-colors ${
                  data.death_scenario === opt.value
                    ? "border-[#1B4965] bg-blue-50 text-[#1B4965] font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {data.death_scenario === "hospital" && (
          <div>
            <Label htmlFor="hospital_name">Hospital / Clinic Name</Label>
            <Input id="hospital_name" value={data.hospital_name} onChange={(e) => update("hospital_name", e.target.value)} placeholder="e.g. Groote Schuur Hospital" />
          </div>
        )}

        {data.death_scenario === "unnatural" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium mb-2">Important: Unnatural Deaths</p>
            <p className="text-sm text-amber-700">
              For unnatural deaths (accident, suicide, homicide), SAPS must be contacted first.
              A post-mortem will be required before the body can be released to a private mortuary.
            </p>
            <div className="mt-3">
              <Label htmlFor="saps_case_number">SAPS Case Number (if available)</Label>
              <Input id="saps_case_number" value={data.saps_case_number} onChange={(e) => update("saps_case_number", e.target.value)} placeholder="e.g. CAS 123/2026" className="mt-1" />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="death_location">Specific Location / Address</Label>
          <Input id="death_location" value={data.death_location} onChange={(e) => update("death_location", e.target.value)} placeholder="Where the body currently is" />
        </div>
      </div>
    </div>
  );
}

function StepDoctor({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Doctor Details</h2>
      <p className="text-sm text-gray-500">
        The certifying doctor completes Section B of the DHA-1663 form.
        Provide these details if you have them — the mortuary can follow up if not.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="doctor_name">Doctor&apos;s Full Name</Label>
          <Input id="doctor_name" value={data.doctor_name} onChange={(e) => update("doctor_name", e.target.value)} placeholder="Dr. ..." />
        </div>
        <div>
          <Label htmlFor="doctor_practice_number">Practice Number</Label>
          <Input id="doctor_practice_number" value={data.doctor_practice_number} onChange={(e) => update("doctor_practice_number", e.target.value)} placeholder="HPCSA practice number" />
        </div>
        <div>
          <Label htmlFor="doctor_phone">Doctor&apos;s Phone</Label>
          <Input id="doctor_phone" value={data.doctor_phone} onChange={(e) => update("doctor_phone", e.target.value)} placeholder="+27..." />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          Don&apos;t have the doctor&apos;s details? No problem — the mortuary can obtain these from the hospital or attending physician.
        </p>
      </div>
    </div>
  );
}

function StepNextOfKin({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Next-of-Kin / Your Details</h2>
      <p className="text-sm text-gray-500">
        Your details as the person arranging the funeral. This is used for Section A of the DHA-1663 form.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="nok_full_name">Your Full Name *</Label>
          <Input id="nok_full_name" value={data.nok_full_name} onChange={(e) => update("nok_full_name", e.target.value)} placeholder="Full name as on ID" />
        </div>
        <div>
          <Label htmlFor="nok_id_number">Your SA ID Number</Label>
          <Input id="nok_id_number" value={data.nok_id_number} onChange={(e) => update("nok_id_number", e.target.value)} placeholder="13-digit ID number" maxLength={13} />
        </div>
        <div>
          <Label htmlFor="nok_relationship">Relationship to Deceased *</Label>
          <select id="nok_relationship" value={data.nok_relationship} onChange={(e) => update("nok_relationship", e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]">
            <option value="">-- Select --</option>
            <option value="spouse">Spouse</option>
            <option value="child">Son / Daughter</option>
            <option value="parent">Parent</option>
            <option value="sibling">Brother / Sister</option>
            <option value="grandchild">Grandchild</option>
            <option value="other_relative">Other Relative</option>
            <option value="friend">Friend</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <div>
          <Label htmlFor="nok_phone">Your Phone Number *</Label>
          <Input id="nok_phone" value={data.nok_phone} onChange={(e) => update("nok_phone", e.target.value)} placeholder="+27..." />
        </div>
        <div>
          <Label htmlFor="nok_email">Email Address</Label>
          <Input id="nok_email" type="email" value={data.nok_email} onChange={(e) => update("nok_email", e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="nok_address">Your Address</Label>
          <Input id="nok_address" value={data.nok_address} onChange={(e) => update("nok_address", e.target.value)} placeholder="Street address, suburb, city" />
        </div>
      </div>
    </div>
  );
}

function StepPreferences({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Burial / Cremation Preferences</h2>
      <p className="text-sm text-gray-500">
        Let the mortuary know your preferences so they can prepare accordingly.
      </p>

      <div className="space-y-4">
        <div>
          <Label>Burial or Cremation?</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { value: "burial", label: "Burial" },
              { value: "cremation", label: "Cremation" },
              { value: "undecided", label: "Not Sure Yet" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("disposition", opt.value)}
                className={`rounded-lg border px-4 py-3 text-sm text-center transition-colors ${
                  data.disposition === opt.value
                    ? "border-[#1B4965] bg-blue-50 text-[#1B4965] font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="religion">Religion / Faith</Label>
          <select id="religion" value={data.religion} onChange={(e) => update("religion", e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]">
            <option value="">-- Select (optional) --</option>
            <option value="Christian">Christian</option>
            <option value="Muslim">Muslim</option>
            <option value="Hindu">Hindu</option>
            <option value="Jewish">Jewish</option>
            <option value="Traditional African">Traditional African</option>
            <option value="No religion">No religion</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {data.religion === "Muslim" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.urgent_burial} onChange={(e) => update("urgent_burial", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]" />
              <div>
                <p className="text-sm font-medium text-blue-900">Urgent burial required (within 24 hours)</p>
                <p className="text-xs text-blue-700">The mortuary will prioritise this request.</p>
              </div>
            </label>
          </div>
        )}

        <div>
          <Label htmlFor="cultural_requirements">Cultural or Religious Requirements</Label>
          <textarea id="cultural_requirements" value={data.cultural_requirements} onChange={(e) => update("cultural_requirements", e.target.value)} placeholder="Any specific rituals, washing requirements, dress code, or other needs..." rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]" />
        </div>
      </div>
    </div>
  );
}

function StepInsurance({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Insurance / Funeral Policy</h2>
      <p className="text-sm text-gray-500">
        If the deceased had a funeral policy, provide the details below. This helps the mortuary assist with the claim.
      </p>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <input type="checkbox" checked={data.has_funeral_policy} onChange={(e) => update("has_funeral_policy", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#1B4965] focus:ring-[#1B4965]" />
          <div>
            <p className="text-sm font-medium text-gray-900">The deceased had a funeral policy / insurance</p>
          </div>
        </label>

        {data.has_funeral_policy && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2 border-l-2 border-[#1B4965]">
            <div>
              <Label htmlFor="insurance_provider">Insurance Provider</Label>
              <select id="insurance_provider" value={data.insurance_provider} onChange={(e) => update("insurance_provider", e.target.value)} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]">
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
              </select>
            </div>
            <div>
              <Label htmlFor="policy_number">Policy Number</Label>
              <Input id="policy_number" value={data.policy_number} onChange={(e) => update("policy_number", e.target.value)} placeholder="Policy or membership number" />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="additional_notes">Additional Notes</Label>
          <textarea id="additional_notes" value={data.additional_notes} onChange={(e) => update("additional_notes", e.target.value)} placeholder="Anything else the mortuary should know..." rows={3} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4965]" />
        </div>
      </div>
    </div>
  );
}
