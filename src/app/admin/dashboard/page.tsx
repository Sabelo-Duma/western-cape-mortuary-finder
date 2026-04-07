"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { type AvailabilityStatus } from "@/types/mortuary";
import { AVAILABILITY_LABELS } from "@/lib/constants";
import {
  Eye,
  Phone,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface MortuaryData {
  id: string;
  name: string;
  availability: AvailabilityStatus;
  is_active: boolean;
  view_count: number;
  contact_clicks: number;
}

interface IntakeSubmission {
  id: string;
  status: string;
  deceased_full_name: string;
  deceased_date_of_death: string;
  death_scenario: string;
  nok_full_name: string;
  nok_phone: string;
  nok_relationship: string;
  nok_email: string | null;
  disposition: string;
  religion: string | null;
  urgent_burial: boolean;
  has_funeral_policy: boolean;
  insurance_provider: string | null;
  additional_notes: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mortuary, setMortuary] = useState<MortuaryData | null>(null);
  const [availability, setAvailability] = useState<AvailabilityStatus>("available");
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasListing, setHasListing] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("mortuaries")
        .select("id, name, availability, is_active, view_count, contact_clicks")
        .eq("owner_id", user.id)
        .single();

      if (error || !data) {
        setHasListing(false);
        setLoading(false);
        router.push("/admin/onboarding");
        return;
      }

      // Load intake submissions
      const { data: subs } = await supabase
        .from("intake_submissions")
        .select("*")
        .eq("mortuary_id", data.id)
        .order("created_at", { ascending: false });

      setMortuary(data);
      setAvailability(data.availability);
      setSubmissions(subs || []);
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  const handleUpdateAvailability = async () => {
    if (!mortuary) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("mortuaries")
      .update({ availability })
      .eq("id", mortuary.id);

    setSaving(false);

    if (error) {
      toast.error("Couldn't update status. Please try again.");
      return;
    }

    setMortuary({ ...mortuary, availability });
    toast.success("Availability updated!");
  };

  const handleUpdateSubmissionStatus = async (
    submissionId: string,
    newStatus: string
  ) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("intake_submissions")
      .update({ status: newStatus })
      .eq("id", submissionId);

    if (error) {
      toast.error("Couldn't update submission status.");
      return;
    }

    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: newStatus } : s))
    );
    toast.success(`Marked as ${newStatus}`);
  };

  const handleToggleListing = async () => {
    if (!mortuary) return;
    const newStatus = !mortuary.is_active;

    const supabase = createClient();
    const { error } = await supabase
      .from("mortuaries")
      .update({ is_active: newStatus })
      .eq("id", mortuary.id);

    if (error) {
      toast.error("Couldn't update listing status.");
      return;
    }

    setMortuary({ ...mortuary, is_active: newStatus });
    toast.success(newStatus ? "Listing is now visible" : "Listing is paused");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (!hasListing || !mortuary) {
    return null;
  }

  const newCount = submissions.filter((s) => s.status === "new").length;
  const inProgressCount = submissions.filter((s) => s.status === "in-progress").length;

  return (
    <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm">{mortuary.name}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {!mortuary.is_active && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-4">
          Your listing is paused and not visible to the public.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Eye className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{mortuary.view_count}</p>
          <p className="text-xs text-gray-500">Views</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Phone className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{mortuary.contact_clicks}</p>
          <p className="text-xs text-gray-500">Contacts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <FileText className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
          <p className="text-xs text-gray-500">Submissions</p>
        </div>
      </div>

      {/* Availability Update */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Availability Status</h2>

        <RadioGroup
          value={availability}
          onValueChange={(v) => setAvailability(v as AvailabilityStatus)}
          className="space-y-3"
        >
          {(
            Object.entries(AVAILABILITY_LABELS) as [AvailabilityStatus, string][]
          ).map(([value, label]) => (
            <div key={value} className="flex items-center space-x-3">
              <RadioGroupItem value={value} id={`avail-${value}`} />
              <Label htmlFor={`avail-${value}`} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleUpdateAvailability}
          className="w-full mt-4 bg-[#1B4965] hover:bg-[#143A50]"
          disabled={saving || availability === mortuary.availability}
        >
          {saving ? "Saving..." : "Update Availability"}
        </Button>
      </section>

      {/* Intake Submissions */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            Intake Submissions
            {newCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                {newCount} new
              </Badge>
            )}
            {inProgressCount > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs px-2 py-0.5">
                {inProgressCount} in progress
              </Badge>
            )}
          </h2>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No intake submissions yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              When families submit intake forms for your mortuary, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const isExpanded = expandedSubmission === sub.id;
              const isNew = sub.status === "new";
              const isInProgress = sub.status === "in-progress";
              const isCompleted = sub.status === "completed";

              return (
                <div
                  key={sub.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-shadow ${
                    isNew
                      ? "border-red-200 shadow-sm"
                      : isInProgress
                      ? "border-amber-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedSubmission(isExpanded ? null : sub.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0 ${
                          isNew
                            ? "bg-red-100 text-red-600"
                            : isInProgress
                            ? "bg-amber-100 text-amber-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isInProgress ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {sub.deceased_full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sub.nok_full_name} ({sub.nok_relationship}) · {sub.nok_phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {sub.urgent_burial && (
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                          URGENT
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isNew
                            ? "bg-red-50 text-red-700 border-red-200"
                            : isInProgress
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {sub.status}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {/* Deceased */}
                        <div className="sm:col-span-2">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                            <User className="h-4 w-4" /> Deceased
                          </h3>
                        </div>
                        <DetailRow label="Full Name" value={sub.deceased_full_name} />
                        <DetailRow label="Date of Death" value={sub.deceased_date_of_death} />
                        <DetailRow label="Scenario" value={sub.death_scenario} />
                        <DetailRow label="Disposition" value={sub.disposition} />
                        {sub.religion && <DetailRow label="Religion" value={sub.religion} />}

                        {/* Next-of-Kin */}
                        <div className="sm:col-span-2 mt-2">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                            <Phone className="h-4 w-4" /> Next-of-Kin
                          </h3>
                        </div>
                        <DetailRow label="Name" value={sub.nok_full_name} />
                        <DetailRow label="Relationship" value={sub.nok_relationship} />
                        <DetailRow label="Phone" value={sub.nok_phone} isPhone />
                        {sub.nok_email && <DetailRow label="Email" value={sub.nok_email} />}

                        {/* Insurance */}
                        {sub.has_funeral_policy && (
                          <>
                            <div className="sm:col-span-2 mt-2">
                              <h3 className="font-semibold text-gray-800 mb-2">Insurance</h3>
                            </div>
                            <DetailRow label="Provider" value={sub.insurance_provider || "Not specified"} />
                          </>
                        )}

                        {/* Notes */}
                        {sub.additional_notes && (
                          <div className="sm:col-span-2 mt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                              {sub.additional_notes}
                            </p>
                          </div>
                        )}

                        {/* Submitted time */}
                        <div className="sm:col-span-2 mt-2">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Submitted: {new Date(sub.created_at).toLocaleString("en-ZA")}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        {sub.status === "new" && (
                          <Button
                            size="sm"
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={() => handleUpdateSubmissionStatus(sub.id, "in-progress")}
                          >
                            Mark In Progress
                          </Button>
                        )}
                        {(sub.status === "new" || sub.status === "in-progress") && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateSubmissionStatus(sub.id, "completed")}
                          >
                            Mark Completed
                          </Button>
                        )}
                        <a
                          href={`tel:${sub.nok_phone}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B4965] hover:underline ml-auto"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Call {sub.nok_full_name}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Separator className="my-6" />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/admin/onboarding")}
        >
          Edit Listing Details &rarr;
        </Button>
        <Button
          variant={mortuary.is_active ? "destructive" : "default"}
          className="w-full"
          onClick={handleToggleListing}
        >
          {mortuary.is_active ? "Pause Listing" : "Unpause Listing"}
        </Button>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  isPhone,
}: {
  label: string;
  value: string;
  isPhone?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {isPhone ? (
        <a href={`tel:${value}`} className="text-sm text-[#1B4965] font-medium hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-sm text-gray-900">{value}</p>
      )}
    </div>
  );
}
