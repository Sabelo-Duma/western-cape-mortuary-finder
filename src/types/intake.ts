export interface IntakeFormData {
  // Deceased
  deceased_full_name: string;
  deceased_id_number: string;
  deceased_date_of_birth: string;
  deceased_date_of_death: string;
  deceased_gender: "male" | "female" | "other";
  deceased_address: string;
  deceased_marital_status: "single" | "married" | "divorced" | "widowed" | "";
  deceased_spouse_name: string;

  // Death details
  death_scenario: "hospital" | "home" | "unnatural" | "other";
  death_location: string;
  hospital_name: string;
  saps_case_number: string;

  // Doctor
  doctor_name: string;
  doctor_practice_number: string;
  doctor_phone: string;

  // Next-of-kin
  nok_full_name: string;
  nok_id_number: string;
  nok_relationship: string;
  nok_phone: string;
  nok_email: string;
  nok_address: string;

  // Preferences
  disposition: "burial" | "cremation" | "undecided";
  religion: string;
  cultural_requirements: string;
  urgent_burial: boolean;

  // Insurance
  has_funeral_policy: boolean;
  insurance_provider: string;
  policy_number: string;

  // Notes
  additional_notes: string;
}

export const INITIAL_INTAKE_DATA: IntakeFormData = {
  deceased_full_name: "",
  deceased_id_number: "",
  deceased_date_of_birth: "",
  deceased_date_of_death: "",
  deceased_gender: "male",
  deceased_address: "",
  deceased_marital_status: "",
  deceased_spouse_name: "",

  death_scenario: "hospital",
  death_location: "",
  hospital_name: "",
  saps_case_number: "",

  doctor_name: "",
  doctor_practice_number: "",
  doctor_phone: "",

  nok_full_name: "",
  nok_id_number: "",
  nok_relationship: "",
  nok_phone: "",
  nok_email: "",
  nok_address: "",

  disposition: "burial",
  religion: "",
  cultural_requirements: "",
  urgent_burial: false,

  has_funeral_policy: false,
  insurance_provider: "",
  policy_number: "",

  additional_notes: "",
};
