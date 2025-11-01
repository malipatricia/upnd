export interface UPNDMember {
  id: string;
  membershipId: string;
  fullName: string;
  nrcNumber: string;
  dateOfBirth: string;
  gender?: 'Male' | 'Female' | 'Other';
  residentialAddress: string;
  phone: string;
  role?: { id: string; name: string | null } | null;
  roleId?: string | null;
  email?: string;
  latitude?: number;
  longitude?: number;
  education?: string;
  occupation?: string;
  skills?: string[];
  membershipLevel?: 'Youth Wing' | 'Women\'s Wing' | 'Veterans' | 'General';
  partyRole?: string;
  endorsements: Endorsement[];
  status: MembershipStatus;
  registrationDate: string;
  jurisdiction: Jurisdiction;
  profileImage?: string;
  disciplinaryRecords: DisciplinaryRecord[];
  appeals: Appeal[];
  partyCommitment: string;
}

export interface Endorsement {
  endorserName: string;
  membershipId: string;
  endorsementDate: Date;
}

export type MembershipStatus = 
  | 'Pending Section Review'
  | 'Pending Branch Review' 
  | 'Pending Ward Review'
  | 'Pending District Review'
  | 'Pending Provincial Review'
  | 'Approved'
  | 'Rejected'
  | 'Suspended'
  | 'Expelled';

export interface Jurisdiction {
  province: string;
  district: string;
  constituency: string;
  ward: string;
  branch: string;
  section: string;
}

export type UserRole = 
  | 'admin'
  | 'member'
  | 'sectionadmin'
  | 'branchadmin'
  | 'wardadmin'
  | 'districtadmin'
  | 'provinceadmin'
  | 'nationaladmin';

export type OrganizationalLevel = 
  | 'National'
  | 'Provincial'
  | 'District'
  | 'Constituency'
  | 'Ward'
  | 'Branch'
  | 'Section';

export interface UPNDUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  jurisdiction: string;
  level: OrganizationalLevel;
  isActive: boolean;
  partyPosition?: string;
}

export interface DisciplinaryCase {
  id: string;
  caseNumber: string;
  memberName: string;
  memberId: string;
  violationType: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Under Review' | 'Resolved' | 'Appealed';
  dateReported: string;
  dateIncident?: string;
  reportingOfficer: string;
  assignedOfficer?: string;
  actions?: DisciplinaryAction[];
  evidence?: Evidence[];
  notes?: CaseNote[];
}

export interface DisciplinaryAction {
  id: string;
  action: string;
  actionDate: string;
  officer: string;
  notes?: string;
}

export interface Evidence {
  id: string;
  type: 'Document' | 'Photo' | 'Video' | 'Audio' | 'Witness Statement';
  description: string;
  uploadDate: string;
  uploadedBy: string;
  fileUrl?: string;
}

export interface CaseNote {
  id: string;
  note: string;
  noteDate: string;
  author: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Status {
  id: string;
  name: string;
  description: string;
}

export interface DisciplinaryRecord {
  caseId: string;
  caseNumber: string;
  violationType: string;
  status: string;
  dateReported: string;
  resolution?: string;
}

export interface Appeal {
  id: string;
  caseId: string;
  appealDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewDate?: string;
  reviewedBy?: string;
}

export interface Statistics {
  totalMembers: number;
  pendingApplications: number;
  approvedMembers: number;
  rejectedApplications: number;
  suspendedMembers: number;
  provincialDistribution: Record<string, number>;
  monthlyTrends: { month: string; registrations: number }[];
  statusDistribution: Record<MembershipStatus, number>;
}

export interface MembershipCard {
  id: string;
  memberId: string;
  cardType: 'Standard' | 'Premium' | 'Executive';
  issueDate: string;
  expiryDate: string;
  qrCode: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

export interface UPNDEvent {
  id: string;
  eventName: string;
  eventType: string;
  description: string;
  eventDate: string;
  eventTime?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  district?: string;
  organizer: string;
  expectedAttendees?: number;
  actualAttendees?: number;
  status: 'Planned' | 'Active' | 'Completed' | 'Cancelled';
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  constituency?: string;
  ward?: string;
}

export interface MemberMapData {
  id: string;
  fullName: string;
  membershipId: string;
  latitude: number;
  longitude: number;
  province: string;
  district: string;
  constituency: string;
  status: MembershipStatus;
  membershipLevel?: string;
}