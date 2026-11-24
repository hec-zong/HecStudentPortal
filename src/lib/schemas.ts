import { z } from 'zod';
import type { SynaparkStep, SynaparkField } from '@/types/portal';

/**
 * =============================================================================
 * HEC STUDENT PORTAL - ZOD VALIDATION SCHEMAS
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// 1. CNIC & CONTACT VALIDATORS
// -----------------------------------------------------------------------------

export const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
export const mobileRegex = /^(\+92|0)[0-9]{10}$/;

export const cnicSchema = z
  .string()
  .regex(cnicRegex, 'CNIC must be formatted as 12345-1234567-1');

export const mobileSchema = z
  .string()
  .regex(
    mobileRegex,
    'Mobile must be a valid Pakistani mobile number (+923XXXXXXXXX or 03XXXXXXXXX)'
  );

// -----------------------------------------------------------------------------
// 2. ADDRESS SCHEMA
// -----------------------------------------------------------------------------

export const addressSchema = z.object({
  line1: z.string().min(3, 'Address line 1 is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().default('Pakistan'),
});

// -----------------------------------------------------------------------------
// 3. STUDENT PROFILE SCHEMA
// -----------------------------------------------------------------------------

export const studentProfileSchema = z.object({
  cnic: cnicSchema,
  passportNumber: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  fatherOrHusbandName: z
    .string()
    .min(2, "Father's or husband's name is required"),
  dateOfBirth: z.string().min(4, 'Valid date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender is required',
  }),
  maritalStatus: z.enum(['single', 'married', 'other']),
  nationality: z
    .string()
    .min(2, 'Nationality is required')
    .default('Pakistani'),
  domicileProvince: z.string().min(2, 'Domicile province is required'),
  domicileDistrict: z.string().min(2, 'Domicile district is required'),
  email: z.string().email('Please enter a valid email address'),
  mobileNumber: mobileSchema,
  postalAddress: addressSchema,
  permanentAddress: addressSchema,
  hasSpecialNeeds: z.boolean().default(false),
  specialNeedDetails: z.string().optional(),
  specialNeedDocumentUrl: z.string().optional(),
  cnicFrontUrl: z.string().min(1, 'CNIC Front copy is required'),
  cnicBackUrl: z.string().min(1, 'CNIC Back copy is required'),
  isCnicVerified: z.boolean().default(false),
  profilePictureUrl: z.string().optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

// -----------------------------------------------------------------------------
// 4. ACADEMIC RECORD SCHEMA (Matric, Inter, Bachelor, Master, PhD)
// -----------------------------------------------------------------------------

export const academicRecordSchema = z.object({
  id: z.string().optional(),
  degreeLevelId: z.string().min(1, 'Degree level is required'),
  degreeLevelTitle: z.string().min(1, 'Degree level title is required'),
  programTitle: z.string().min(1, 'Program title is required'),
  institutionType: z.enum(['university', 'board', 'foreign']),
  institutionName: z
    .string()
    .min(2, 'Institution / University / Board name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  passingYear: z.coerce.number().min(1950).max(new Date().getFullYear()),
  totalMarksOrCgpa: z.coerce.number().positive('Must be a positive number'),
  obtainedMarksOrCgpa: z.coerce.number().positive('Must be a positive number'),
  gradingSystem: z.enum(['percentage', 'cgpa_4', 'cgpa_5', 'division']),
  sessionType: z.enum(['morning', 'evening', 'weekend', 'distance']),
  documentDegreeUrl: z.string().optional(),
  documentTranscriptUrl: z.string().optional(),
});

export type AcademicRecordInput = z.infer<typeof academicRecordSchema>;

// -----------------------------------------------------------------------------
// 5. DEGREE ATTESTATION SELECTION & BILLING SCHEMAS
// -----------------------------------------------------------------------------

export const selectedDocumentItemSchema = z.object({
  type: z.enum([
    'Degree',
    'Transcript',
    'Provisional_Certificate',
    'Equivalence_Certificate',
  ]),
  attestOriginal: z.boolean().default(true),
  copiesCount: z.coerce.number().min(0).default(0),
  documentUrl: z.string().optional(),
  originalFee: z.number().default(1000),
  copyFee: z.number().default(700),
  subtotal: z.number(),
});

export const attestedDegreeSelectionSchema = z.object({
  academicRecordId: z.string().min(1, 'Academic record ID is required'),
  degreeLevel: z.string().min(1, 'Degree level is required'),
  programTitle: z.string().min(1, 'Program title is required'),
  universityOrBoard: z.string().min(1, 'University or Board is required'),
  passingYear: z.coerce.number().min(1950),
  rollNumber: z.string().min(1),
  registrationNumber: z.string().min(1),
  selectedDocuments: z
    .array(selectedDocumentItemSchema)
    .min(1, 'Select at least one document for attestation'),
  itemTotal: z
    .number()
    .min(1000, 'Minimum fee is PKR 1,000 per attested qualification'),
});

export type AttestedDegreeSelectionInput = z.infer<
  typeof attestedDegreeSelectionSchema
>;

export const challanPaymentSubmissionSchema = z.object({
  challanNumber: z.string().min(1, 'Challan number is required'),
  paymentMode: z.enum(['1link_atm_mobile', 'bank_counter', 'kuickpay']),
  transactionReference: z
    .string()
    .min(4, 'Transaction or Branch Ref is required'),
  paidReceiptUrl: z
    .string()
    .min(1, 'Paid challan receipt image or PDF is required'),
  paidAt: z.string().min(1, 'Payment date is required'),
  bankBranch: z.string().optional(),
});

export type ChallanPaymentSubmissionInput = z.infer<
  typeof challanPaymentSubmissionSchema
>;

export const resubmitDocumentSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  rejectionTrailId: z.string().min(1, 'Rejection Trail ID is required'),
  documentType: z.string().min(1, 'Document type is required'),
  newDocumentUrl: z.string().min(1, 'New document file is required'),
  studentNote: z.string().max(500).optional(),
});

export type ResubmitDocumentInput = z.infer<typeof resubmitDocumentSchema>;

// -----------------------------------------------------------------------------
// 6. DYNAMIC SYNAPARK FORM ZOD GENERATOR
// -----------------------------------------------------------------------------

/**
 * Dynamically converts Synapark JSON field definitions into a Zod object schema.
 * Allows runtime validation of student input against backend-configured Synapark steps.
 */
export function createDynamicFieldZodSchema(
  field: SynaparkField
): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'number': {
      let numSchema = z.coerce.number();
      if (field.validation?.min !== undefined) {
        numSchema = numSchema.min(
          field.validation.min,
          field.validation.customMessage ||
            `Must be at least ${field.validation.min}`
        );
      }
      if (field.validation?.max !== undefined) {
        numSchema = numSchema.max(
          field.validation.max,
          field.validation.customMessage ||
            `Must be at most ${field.validation.max}`
        );
      }
      schema = field.validation?.required ? numSchema : numSchema.optional();
      break;
    }
    case 'checkbox': {
      schema = field.validation?.required
        ? z.boolean().refine((val) => val === true, {
            message:
              field.validation?.customMessage || `${field.label} is required`,
          })
        : z.boolean().optional();
      break;
    }
    case 'date': {
      const strSchema = z.string().min(4, `${field.label} date is required`);
      schema = field.validation?.required ? strSchema : strSchema.optional();
      break;
    }
    case 'file': {
      const fileSchema = z
        .string()
        .min(1, `${field.label} document is required`);
      schema = field.validation?.required ? fileSchema : fileSchema.optional();
      break;
    }
    case 'select':
    case 'radio': {
      const strSchema = z.string().min(1, `Please select a ${field.label}`);
      schema = field.validation?.required ? strSchema : strSchema.optional();
      break;
    }
    case 'repeatable_group': {
      if (field.subFields && field.subFields.length > 0) {
        const itemShape: Record<string, z.ZodTypeAny> = {};
        for (const sub of field.subFields) {
          itemShape[sub.name] = createDynamicFieldZodSchema(sub);
        }
        const arraySchema = z.array(z.object(itemShape));
        schema = field.validation?.required
          ? arraySchema.min(1, `${field.label} requires at least one entry`)
          : arraySchema.optional();
      } else {
        schema = z.array(z.any()).optional();
      }
      break;
    }
    case 'text':
    case 'textarea':
    default: {
      let strSchema = z.string();
      if (field.validation?.pattern) {
        strSchema = strSchema.regex(
          new RegExp(field.validation.pattern),
          field.validation.customMessage || `Invalid format for ${field.label}`
        );
      }
      if (field.validation?.min !== undefined) {
        strSchema = strSchema.min(
          field.validation.min,
          field.validation.customMessage ||
            `Must be at least ${field.validation.min} characters`
        );
      }
      if (field.validation?.max !== undefined) {
        strSchema = strSchema.max(
          field.validation.max,
          field.validation.customMessage ||
            `Must be at most ${field.validation.max} characters`
        );
      }
      if (field.validation?.required) {
        schema = strSchema.min(
          1,
          field.validation.customMessage || `${field.label} is required`
        );
      } else {
        schema = strSchema.optional();
      }
      break;
    }
  }

  if (field.conditional) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Builds a composite Zod Object Schema for an entire Synapark Step.
 */
export function createDynamicSynaparkStepZodSchema(
  step: SynaparkStep
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of step.sections) {
    if (section.repeatable) {
      const sectionShape: Record<string, z.ZodTypeAny> = {};
      for (const field of section.fields) {
        sectionShape[field.name] =
          createDynamicFieldZodSchema(field).optional();
      }
      const sectionItemSchema = z.object(sectionShape).passthrough();
      const arraySchema = z
        .array(sectionItemSchema)
        .min(
          section.minItems || 1,
          `${section.title} requires at least ${section.minItems || 1} entries`
        );
      shape[section.id] = arraySchema.optional();
      shape['academicRecords'] = arraySchema.optional();
    } else {
      for (const field of section.fields) {
        shape[field.name] = createDynamicFieldZodSchema(field);
      }
    }
  }

  return z.object(shape);
}
