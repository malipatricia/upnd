# Role-Based Member Approval System

## Overview

The UPND Member Management System now implements a comprehensive role-based approval workflow that ensures proper hierarchical review of member applications. This system provides granular control over who can approve members at each stage of the approval process.

## User Roles

The system now supports 7 distinct user roles:

1. **`member`** - Regular members with no approval permissions
2. **`sectionadmin`** - Section-level administrators
3. **`branchadmin`** - Branch-level administrators  
4. **`wardadmin`** - Ward-level administrators
5. **`districtadmin`** - District-level administrators
6. **`provinceadmin`** - Provincial-level administrators
7. **`admin`** - System administrators with full permissions

## Member Status Flow

Members progress through the following status stages:

1. **`pending section review`** - Initial application awaiting section review
2. **`pending branch review`** - Approved by section, awaiting branch review
3. **`pending ward review`** - Approved by branch, awaiting ward review
4. **`pending district review`** - Approved by ward, awaiting district review
5. **`pending provincial review`** - Approved by district, awaiting provincial review
6. **`Approved`** - Fully approved member
7. **`Rejected`** - Application rejected at any stage
8. **`Suspended`** - Member suspended
9. **`Expelled`** - Member expelled

## Approval Permissions

### Member Role
- **Cannot view or interact with** Approve, Reject, or Update Status buttons
- **No permissions** to modify member approval status

### Section Admin
- **Can view buttons** when member status is `pending section review`
- **On Approve**: Status changes to `pending branch review`
- **On Reject**: Status changes to `Rejected`

### Branch Admin
- **Can view buttons** when member status is `pending branch review`
- **On Approve**: Status changes to `pending ward review`
- **On Reject**: Status changes to `Rejected`

### Ward Admin
- **Can view buttons** when member status is `pending ward review`
- **On Approve**: Status changes to `pending district review`
- **On Reject**: Status changes to `Rejected`

### District Admin
- **Can view buttons** when member status is `pending district review`
- **On Approve**: Status changes to `pending provincial review`
- **On Reject**: Status changes to `Rejected`

### Province Admin
- **Can view buttons** when member status is `pending provincial review`
- **On Approve**: Status changes to `Approved`
- **On Reject**: Status changes to `Rejected`

### System Admin
- **Can always view** Approve, Reject, and Update Status buttons regardless of member status
- **On Approve**: Status immediately changes to `Approved` (skips all intermediate steps)
- **When status is `Approved`**: Only Update Status button is visible (Approve and Reject are hidden)

## Implementation Details

### Core Functions

#### `getButtonVisibility(user, memberStatus)`
Determines which buttons should be visible based on user role and member status.

```typescript
interface ButtonVisibility {
  canApprove: boolean;
  canReject: boolean;
  canUpdateStatus: boolean;
}
```

#### `getNextStatus(user, currentStatus)`
Determines the next status when a user approves a member.

#### `getStatusDisplayName(status)`
Converts internal status format to user-friendly display names.

#### `getApprovalLevel(status)`
Returns the approval level description for a given status.

### Database Changes

- Updated member status values to use lowercase format
- Added migration script to update existing data
- Updated schema to reflect new status format

### UI Components Updated

- **MemberCard**: Now uses role-based button visibility
- **MemberApproval**: Updated to work with new status format
- **AuthContext**: Updated with new role names and permissions

## Testing

Comprehensive test suite included in `src/lib/__tests__/approval.test.ts` covering:

- Button visibility for all role and status combinations
- Status transitions for all roles
- Display name formatting
- Approval level descriptions

## Usage Examples

### Testing Button Visibility

```typescript
// Member cannot see any buttons
const memberUser = { role: 'member' };
const visibility = getButtonVisibility(memberUser, 'pending section review');
// Result: { canApprove: false, canReject: false, canUpdateStatus: false }

// Section admin can see buttons for pending section review
const sectionAdmin = { role: 'sectionadmin' };
const visibility = getButtonVisibility(sectionAdmin, 'pending section review');
// Result: { canApprove: true, canReject: true, canUpdateStatus: true }
```

### Testing Status Transitions

```typescript
// Section admin approval moves to branch review
const nextStatus = getNextStatus({ role: 'sectionadmin' }, 'pending section review');
// Result: 'pending branch review'

// Admin approval moves directly to approved
const nextStatus = getNextStatus({ role: 'admin' }, 'pending section review');
// Result: 'Approved'
```

## Security Considerations

- All approval actions are validated server-side
- Role-based permissions are enforced at the component level
- Status transitions are controlled by the approval logic
- No user can bypass the approval workflow without admin privileges

## Future Enhancements

- Audit logging for all approval actions
- Email notifications for status changes
- Bulk approval capabilities
- Approval deadline tracking
- Escalation procedures for delayed approvals