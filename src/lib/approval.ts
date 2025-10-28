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
 * Determines which buttons should be visible based on user role and member status
 */
export function getButtonVisibility(user: User, memberStatus: MembershipStatus): ButtonVisibility {
  const visibility: ButtonVisibility = {
    canApprove: false,
    canReject: false,
    canUpdateStatus: false
  };

  // i) Member cannot view approve/reject/update buttons
  if (user.role === "member") {
    return visibility;
  }

  // vii) Admin can always view buttons
  if (user.role === "admin") {
    // If already approved → only show "update status"
    if (memberStatus === "Approved") {
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
  if (user.role === "sectionadmin" && memberStatus === "Pending Section Review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iii) Branch Admin
  if (user.role === "branchadmin" && memberStatus === "Pending Branch Review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iv) Ward Admin
  if (user.role === "wardadmin" && memberStatus === "Pending Ward Review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // v) District Admin
  if (user.role === "districtadmin" && memberStatus === "Pending District Review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // vi) Province Admin
  if (user.role === "provinceadmin" && memberStatus === "Pending Provincial Review") {
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
  if (user.role === "sectionadmin") return "Pending Branch Review";
  if (user.role === "branchadmin") return "Pending Ward Review";
  if (user.role === "wardadmin") return "Pending District Review";
  if (user.role === "districtadmin") return "Pending Provincial Review";
  if (user.role === "provinceadmin") return "Approved";
  return currentStatus;
}

/**
 * Gets the display name for a member status
 */
export function getStatusDisplayName(status: MembershipStatus): string {
  switch (status) {
    case 'Pending Section Review':
      return 'Pending Section Review';
    case 'Pending Branch Review':
      return 'Pending Branch Review';
    case 'Pending Ward Review':
      return 'Pending Ward Review';
    case 'Pending District Review':
      return 'Pending District Review';
    case 'Pending Provincial Review':
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
    case 'Pending Section Review':
      return 'Section Level';
    case 'Pending Branch Review':
      return 'Branch Level';
    case 'Pending Ward Review':
      return 'Ward Level';
    case 'Pending District Review':
      return 'District Level';
    case 'Pending Provincial Review':
      return 'Provincial Level';
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Final Review';
  }
}