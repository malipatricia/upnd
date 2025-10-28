// Simple test of the authentication logic without TypeScript imports
function getButtonVisibility(user, memberStatus) {
  const visibility = {
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
  if (user.role === "sectionadmin" && memberStatus === "pending section review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iii) Branch Admin
  if (user.role === "branchadmin" && memberStatus === "pending branch review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // iv) Ward Admin
  if (user.role === "wardadmin" && memberStatus === "pending ward review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // v) District Admin
  if (user.role === "districtadmin" && memberStatus === "pending district review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // vi) Province Admin
  if (user.role === "provinceadmin" && memberStatus === "pending provincial review") {
    return {
      canApprove: true,
      canReject: true,
      canUpdateStatus: true
    };
  }

  // Default: hide all
  return visibility;
}

// Test all admin roles with their specific statuses
console.log('=== TESTING ALL ADMIN ROLES ===\n');

const adminRoles = [
  'sectionadmin',
  'branchadmin', 
  'wardadmin',
  'districtadmin',
  'provinceadmin',
  'admin'
];

const statuses = [
  'pending section review',
  'pending branch review',
  'pending ward review', 
  'pending district review',
  'pending provincial review',
  'Approved'
];

adminRoles.forEach(role => {
  console.log(`\n--- ${role.toUpperCase()} ---`);
  
  statuses.forEach(status => {
    const result = getButtonVisibility({ role }, status);
    const hasButtons = result.canApprove || result.canReject || result.canUpdateStatus;
    
    if (hasButtons) {
      console.log(`  ✅ ${status}: ${JSON.stringify(result)}`);
    } else {
      console.log(`  ❌ ${status}: No buttons`);
    }
  });
});

console.log('\n=== TEST COMPLETE ===');