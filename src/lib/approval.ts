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
  const base: ButtonVisibility = {
    canApprove: false,
    canReject: false,
    canUpdateStatus: false,
  };

  if (user.role === "member") {
    return base;
  }

  const elevatedRoles: UserRole[] = ["admin", "nationaladmin"];
  if (elevatedRoles.includes(user.role)) {
    if (memberStatus === "Approved") {
      return { ...base, canUpdateStatus: true };
    }
    return { canApprove: true, canReject: true, canUpdateStatus: true };
  }

  const roleStatusMap: Partial<Record<UserRole, MembershipStatus>> = {
    sectionadmin: "Pending Section Review",
    branchadmin: "Pending Branch Review",
    wardadmin: "Pending Ward Review",
    districtadmin: "Pending District Review",
    provinceadmin: "Pending Provincial Review",
  };

  const requiredStatus = roleStatusMap[user.role];
  if (requiredStatus && memberStatus === requiredStatus) {
    return { canApprove: true, canReject: true, canUpdateStatus: true };
  }

  return base;
}

/**
 * Determines the next status when a user approves a member
 */
export function getNextStatus(user: User, currentStatus: MembershipStatus): MembershipStatus {
  const elevatedRoles: UserRole[] = ["admin", "nationaladmin"];
  if (elevatedRoles.includes(user.role)) {
    return "Approved";
  }

  const transitionMap: Partial<Record<UserRole, { from: MembershipStatus; to: MembershipStatus }>> = {
    sectionadmin: { from: "Pending Section Review", to: "Pending Branch Review" },
    branchadmin: { from: "Pending Branch Review", to: "Pending Ward Review" },
    wardadmin: { from: "Pending Ward Review", to: "Pending District Review" },
    districtadmin: { from: "Pending District Review", to: "Pending Provincial Review" },
    provinceadmin: { from: "Pending Provincial Review", to: "Approved" },
  };

  const transition = transitionMap[user.role];
  if (transition && transition.from === currentStatus) {
    return transition.to;
  }

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