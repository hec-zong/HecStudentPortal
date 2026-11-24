/**
 * =============================================================================
 * HEC STUDENT PORTAL - ENTERPRISE DATA CONTRACTS
 * =============================================================================
 *
 * Single source of truth for:
 * 1. Student Session State & Profile (First-time vs. Returning student)
 * 2. Synapark Dynamic JSON Form Schema & Validation
 * 3. Pakistan Qualification Register (PQR) Master Data
 * 4. Degree Attestation Selection & E-Challan / 1-Link PSID Billing
 * 5. Application Tracking Pipeline & Worker Portal Audit / Rejection Trail
 */

// -----------------------------------------------------------------------------
// 1. STUDENT SESSION & PROFILE TYPES
// -----------------------------------------------------------------------------

export type GenderType = 'male' | 'female' | 'other';
export type MaritalStatusType = 'single' | 'married' | 'other';

export interface AddressInfo {
  line1: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface StudentProfile {
  id: string;
  cnic: string; // Format: XXXXX-XXXXXXX-X
  passportNumber?: string;
  fullName: string;
  fatherOrHusbandName: string;
  dateOfBirth: string; // ISO Date: YYYY-MM-DD
  gender: GenderType;
  maritalStatus: MaritalStatusType;
  nationality: string;
  domicileProvince: string;
  domicileDistrict: string;
  email: string;
  mobileNumber: string; // Format: +923XXXXXXXXX
  postalAddress: AddressInfo;
  permanentAddress: AddressInfo;
  hasSpecialNeeds: boolean;
  specialNeedDetails?: string;
  specialNeedDocumentUrl?: string;
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  isCnicVerified: boolean;
  profilePictureUrl?: string;
}

export interface HecWalletItem {
  id: string;
  title: string;
  degreeLevel: string;
  programName: string;
  university: string;
  serialNumber: string;
  qrCodeData: string;
  attestationDate: string;
  verificationHash: string;
  status: 'active' | 'revoked' | 'superseded';
  downloadUrl: string;
  issuedBy: string;
}

export type TaskActionType =
  'resubmit_doc' | 'pay_challan' | 'upload_receipt' | 'verify_profile';

export type TaskPriorityType = 'high' | 'medium' | 'low';

export interface PendingTask {
  id: string;
  title: string;
  description: string;
  applicationId?: string;
  actionType: TaskActionType;
  dueDate?: string;
  priority: TaskPriorityType;
  link: string;
}

export interface StudentBootstrapData {
  isFirstTimeUser: boolean;
  hasSubmittedApplication: boolean;
  profileCompletionPercentage: number;
  student: StudentProfile;
  pendingTasks: PendingTask[];
  hecWallet: HecWalletItem[];
  recentApplications: ApplicationSummary[];
}

// -----------------------------------------------------------------------------
// 2. SYNAPARK JSON FORM SCHEMA CONTRACTS
// -----------------------------------------------------------------------------

export type SynaparkFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'radio'
  | 'date'
  | 'textarea'
  | 'checkbox'
  | 'file'
  | 'repeatable_group';

export interface SynaparkValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
  allowedExtensions?: string[];
  maxFileSizeMb?: number;
}

export type SynaparkConditionalOperator =
  'equals' | 'not_equals' | 'contains' | 'in' | 'is_empty' | 'is_not_empty';

export interface SynaparkConditionalRule {
  field: string;
  operator: SynaparkConditionalOperator;
  value: unknown;
}

export interface SynaparkDropzoneConfig {
  accept: string[];
  maxSizeMb: number;
  multiple?: boolean;
  sampleDocumentUrl?: string;
  instruction?: string;
  previewThumbnail?: boolean;
}

export interface SynaparkFieldOption {
  label: string;
  value: string;
  hint?: string;
}

export interface SynaparkField {
  id: string;
  name: string;
  label: string;
  type: SynaparkFieldType;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  options?: SynaparkFieldOption[];
  validation?: SynaparkValidationRule;
  conditional?: SynaparkConditionalRule;
  dropzoneConfig?: SynaparkDropzoneConfig;
  subFields?: SynaparkField[]; // Used when type === 'repeatable_group'
}

export interface SynaparkSection {
  id: string;
  title: string;
  description?: string;
  repeatable?: boolean;
  repeatableTitle?: string;
  minItems?: number;
  maxItems?: number;
  fields: SynaparkField[];
}

export interface SynaparkStep {
  id: string;
  stepNumber: number;
  title: string;
  shortTitle?: string;
  description: string;
  sections: SynaparkSection[];
}

export interface SynaparkFormSchema {
  serviceId: string;
  title: string;
  description: string;
  version: string;
  steps: SynaparkStep[];
}

// -----------------------------------------------------------------------------
// 3. PQR (PAKISTAN QUALIFICATION REGISTER) MASTER DATA
// -----------------------------------------------------------------------------

export type UniversitySector = 'public' | 'private' | 'semi-government';

export interface PqrUniversity {
  id: string;
  code: string;
  name: string;
  shortName: string;
  sector: UniversitySector;
  province: string;
  city: string;
  charterYear?: number;
  isAccredited: boolean;
  mainCampus: string;
  campuses?: string[];
}

export type DegreeCategory =
  'SSC' | 'HSSC' | 'Undergraduate' | 'Graduate' | 'Postgraduate' | 'Doctoral';

export interface PqrDegreeLevel {
  id: string;
  level: number; // 10 (Matric), 12 (Inter), 14 (Bachelor 2-yr), 16 (BS/16-yr), 18 (MS/MPhil), 21 (PhD)
  title: string;
  category: DegreeCategory;
  standardDurationYears: number;
}

export type ProgramAccreditationStatus =
  'accredited' | 'provisional' | 'under_review' | 'derecognized';

export interface PqrProgram {
  id: string;
  universityId: string;
  degreeLevelId: string;
  programName: string;
  discipline: string;
  department: string;
  programDurationYears: number;
  accreditationCouncil?: string; // e.g. "PEC", "PMDC", "NBEAC", "NCEAC"
  status: ProgramAccreditationStatus;
  approvedIntakeYears: {
    from: number;
    to?: number;
  };
}

export type BoardType = 'BISE' | 'Technical' | 'Cambridge/IBCC';

export interface PqrBoard {
  id: string;
  code: string;
  name: string;
  province: string;
  type: BoardType;
}

export interface PqrMasterData {
  universities: PqrUniversity[];
  degreeLevels: PqrDegreeLevel[];
  programs: PqrProgram[];
  boards: PqrBoard[];
}

// -----------------------------------------------------------------------------
// 4. DEGREE ATTESTATION SELECTION & E-CHALLAN / BILLING
// -----------------------------------------------------------------------------

export type AttestationDocumentType =
  | 'Degree'
  | 'Transcript'
  | 'Provisional_Certificate'
  | 'Equivalence_Certificate';

export interface SelectedDocumentItem {
  type: AttestationDocumentType;
  attestOriginal: boolean;
  copiesCount: number;
  documentUrl?: string;
  originalFee: number;
  copyFee: number;
  subtotal: number;
}

export interface AttestedDegreeSelection {
  academicRecordId: string;
  degreeLevel: string;
  programTitle: string;
  universityOrBoard: string;
  passingYear: number;
  rollNumber: string;
  registrationNumber: string;
  selectedDocuments: SelectedDocumentItem[];
  itemTotal: number;
}

export interface EChallanItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type ChallanStatus = 'unpaid' | 'paid' | 'expired' | 'verified';
export type PaymentMode = '1link_atm_mobile' | 'bank_counter' | 'kuickpay';

export interface EChallan {
  challanNumber: string; // e.g. "HEC-CH-2024-88491"
  psid: string; // 1-Link 17 digit PSID
  applicationId: string;
  studentCnic: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  itemsBreakdown: EChallanItem[];
  totalAmount: number;
  currency: 'PKR';
  status: ChallanStatus;
  paymentMode?: PaymentMode;
  paidReceiptUrl?: string;
  paidAt?: string;
  transactionReference?: string;
  bankBranch?: string;
}

// -----------------------------------------------------------------------------
// 5. APPLICATION TRACKING & WORKER AUDIT / REJECTION TRAIL
// -----------------------------------------------------------------------------

export type ApplicationStage =
  | 'submitted'
  | 'scrutiny'
  | 'l1_controller'
  | 'l2_controller'
  | 'attestation'
  | 'completed_dispatched';

export type StageStatus =
  'pending' | 'in_progress' | 'approved' | 'rejected' | 'resubmit_required';

export type CommentType =
  'info' | 'rejection' | 'resubmit_required' | 'approval';

export interface RejectionTrailItem {
  id: string;
  stage: ApplicationStage;
  stageName: string;
  reviewerRole: string; // e.g. "Scrutiny Desk Officer", "L1 Controller"
  reviewerName?: string;
  comment: string;
  type: CommentType;
  rejectionReason?: string;
  affectedDocumentType?: AttestationDocumentType | string;
  isReuploadAllowed: boolean;
  createdAt: string;
  resolvedAt?: string;
  studentResponseNote?: string;
  reuploadedDocUrl?: string;
}

export interface ApplicationTrackingStage {
  stage: ApplicationStage;
  title: string;
  description: string;
  status: StageStatus;
  startedAt?: string;
  completedAt?: string;
  assignedWorker?: {
    name: string;
    role: string;
    department: string;
  };
}

export type OverallApplicationStatus =
  'in_progress' | 'approved' | 'resubmit_required' | 'rejected' | 'dispatched';

export interface CourierDispatchInfo {
  courierName: string;
  trackingNumber: string;
  dispatchedAt: string;
  estimatedDelivery: string;
}

export interface ApplicationDetail {
  id: string; // e.g. "#APP-2024-9981"
  trackingId: string;
  serviceType: string;
  submittedAt: string;
  overallStatus: OverallApplicationStatus;
  currentStage: ApplicationStage;
  currentStageIndex: number;
  totalStages: number;
  stages: ApplicationTrackingStage[];
  commentsTrail: RejectionTrailItem[];
  selectedDegrees: AttestedDegreeSelection[];
  challan: EChallan;
  dispatchInfo?: CourierDispatchInfo;
}

export interface ApplicationSummary {
  id: string;
  serviceName: string;
  submittedAt: string;
  status: OverallApplicationStatus;
  statusLabel: string;
  currentStage: string;
  amountPaid: number;
  actionRequired: boolean;
  actionMessage?: string;
}

// -----------------------------------------------------------------------------
// 6. SERVICE ACTION PAYLOAD CONTRACTS
// -----------------------------------------------------------------------------

export interface CreateChallanPayload {
  applicationId: string;
  degrees: AttestedDegreeSelection[];
}

export interface SubmitPaidChallanPayload {
  challanNumber: string;
  paymentMode: PaymentMode;
  transactionReference: string;
  paidReceiptUrl: string;
  paidAt: string;
  bankBranch?: string;
}

export interface ResubmitDocumentPayload {
  applicationId: string;
  rejectionTrailId: string;
  documentType: string;
  newDocumentUrl: string;
  studentNote?: string;
}

export interface ApplicationSubmitPayload {
  serviceId: string;
  formData: Record<string, unknown>;
  attestationSelection: AttestedDegreeSelection[];
}
