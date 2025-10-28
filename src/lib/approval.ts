import { UserRole, MembershipStatus } from '@/types';

export interface ButtonVisibility {
  canApprove: boolean;
  canReject: boolean;
  canUpdateStatus: boolean;
}

export interface User {
  role: UserRole;
}

/**
 * Normalizes member status to lowercase format for consistent comparison
 */
function normalizeStatus(status: string): string {
  return status.toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Determines which buttons should be visible based on user role and member status
 */
export function getButtonVisibility(user: User, memberStatus: MembershipStatus): ButtonVisibility {
  const visibility: ButtonVisibility = {
    canApprove: false,
    canReject: false,
    canUpdateStatus: false
  };

  // Normalize the member status to handle case sensitivity
  const normalizedStatus = normalizeStatus(memberStatus);

  // i) Member cannot view approve/reject/update buttons
  if (user.role === "member") {
    return visibility;
  }

  // vii) Admin can always view buttons
  if (user.role === "admin") {
    // If already approved → only show "update status"
    if (normalizedStatus === "approved") {
      return {
        canApprove: false,
        canReject: false,
        canUpdateStatus: true
      };
    }
    // Otherwise show all
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // ii) Section Admin
  if (user.role === "sectionadmin" && normalizedStatus === "pending section review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iii) Branch Admin
  if (user.role === "branchadmin" && normalizedStatus === "pending branch review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iv) Ward Admin
  if (user.role === "wardadmin" && normalizedStatus === "pending ward review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // v) District Admin
  if (user.role === "districtadmin" && normalizedStatus === "pending district review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // vi) Province Admin
  if (user.role === "provinceadmin" && normalizedStatus === "pending provincial review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // Default: hide all
  return visibility;
}

/**
 * Determines the next status when a user approves a member
 */
export function getNextStatus(user: User, currentStatus: MembershipStatus): MembershipStatus {
  if (user.role === "admin") return "Approved";
  if (user.role === "sectionadmin") return "pending branch review";
  if (user.role === "branchadmin") return "pending ward review";
  if (user.role === "wardadmin") return "pending district review";
  if (user.role === "districtadmin") return "pending provincial review";
  if (user.role === "provinceadmin") return "Approved";
  return currentStatus;
}

/**
 * Gets the display name for a member status
 */
export function getStatusDisplayName(status: MembershipStatus): string {
  switch (status) {
    case 'pending section review':
      return 'Pending Section Review';
    case 'pending branch review':
      return 'Pending Branch Review';
    case 'pending ward review':
      return 'Pending Ward Review';
    case 'pending district review':
      return 'Pending District Review';
    case 'pending provincial review':
      return 'Pending Provincial Review';
    default:
      return status;
  }
}

/**
 * Gets the approval level description for a status
 */
export function getApprovalLevel(status: MembershipStatus): string {
  switch (status) {
    case 'pending section review':
      return 'Section Level';
    case 'pending branch review':
      return 'Branch Level';
    case 'pending ward review':
      return 'Ward Level';
    case 'pending district review':
      return 'District Level';
    case 'pending provincial review':
      return 'Provincial Level';
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Final Review';
  }
}