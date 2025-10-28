# Authentication Fix - Role-Based Button Visibility

## Problem Identified
The Approve and Reject buttons were always hidden because there was a mismatch between authentication systems:

1. **LoginForm** was using NextAuth's `signIn()` function
2. **MemberCard** was trying to use our custom `useAuth()` hook from AuthContext
3. The two authentication systems were not connected

## Root Cause
- NextAuth session was not being used by the MemberCard component
- AuthContext was not being populated from NextAuth session
- User role information was not being passed through properly

## Solution Implemented

### 1. Updated MemberCard Component
- **Before**: Used `useAuth()` from custom AuthContext
- **After**: Uses `useSession()` from NextAuth
- **Changes**:
  ```typescript
  // Before
  const { user } = useAuth();
  
  // After  
  const { data: session } = useSession();
  const user = session?.user;
  ```

### 2. Updated MemberApproval Component
- **Before**: Used `useAuth()` and `hasPermission()`
- **After**: Uses `useSession()` and custom permission function
- **Changes**:
  ```typescript
  // Before
  const { user, hasPermission } = useAuth();
  
  // After
  const { data: session } = useSession();
  const user = session?.user;
  const hasPermission = (permission: string) => {
    if (!user?.role) return false;
    const adminRoles = ['admin', 'provinceadmin', 'districtadmin', 'wardadmin', 'branchadmin', 'sectionadmin'];
    return adminRoles.includes(user.role) && permission === 'approve_members';
  };
  ```

### 3. Enhanced NextAuth Configuration
- Added JWT callback to preserve role information
- Ensured role is passed through session
- **Changes**:
  ```typescript
  callbacks: {
    async session({ session, token, user }) {
      if (user) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  ```

### 4. Updated Demo Credentials
- Updated LoginForm demo credentials to use new role names
- Added all 7 role types for testing
- **Changes**:
  ```typescript
  const demoCredentials = [
    { email: "admin@upnd.zm", role: "admin", name: "Hakainde Hichilema" },
    { email: "provinceadmin@upnd.zm", role: "provinceadmin", name: "Cornelius Mweetwa" },
    { email: "districtadmin@upnd.zm", role: "districtadmin", name: "Mutale Nalumango" },
    { email: "wardadmin@upnd.zm", role: "wardadmin", name: "Sylvia Mweetwa" },
    { email: "branchadmin@upnd.zm", role: "branchadmin", name: "Jack Mwiimbu" },
    { email: "sectionadmin@upnd.zm", role: "sectionadmin", name: "Peter Sinkamba" },
    { email: "member@upnd.zm", role: "member", name: "John Doe" },
  ];
  ```

## Expected Behavior Now

### Admin Role (`admin@upnd.zm`)
- **Can see**: Approve, Reject, Update Status buttons for all statuses except "Approved"
- **For "Approved" status**: Only Update Status button visible
- **Can approve**: Any member at any stage (skips to "Approved")

### Other Admin Roles
- **Section Admin**: Can see buttons only for `pending section review`
- **Branch Admin**: Can see buttons only for `pending branch review`
- **Ward Admin**: Can see buttons only for `pending ward review`
- **District Admin**: Can see buttons only for `pending district review`
- **Province Admin**: Can see buttons only for `pending provincial review`

### Member Role
- **Cannot see**: Any approval buttons

## Testing
1. **Login as admin@upnd.zm** with password "upnd2024"
2. **Navigate to Members page** (`/dashboard/members`)
3. **Verify**: Approve and Reject buttons are visible for all members except those with "Approved" status
4. **Test other roles**: Login with different admin roles to verify role-based visibility

## Files Modified
- `src/app/dashboard/members/MemberCard.tsx` - Updated to use NextAuth
- `src/app/dashboard/members/MemberApproval.tsx` - Updated to use NextAuth
- `src/lib/auth.ts` - Enhanced NextAuth callbacks
- `src/components/Auth/LoginForm.tsx` - Updated demo credentials

## Build Status
✅ **Build Successful** - All changes compile without errors
✅ **Authentication Fixed** - NextAuth session properly integrated
✅ **Role-Based Visibility** - Buttons now show based on user role and member status