// Test the role-based button visibility logic
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

console.log('=== TESTING ROLE-BASED BUTTON VISIBILITY ===\n');

// Test all admin roles with their specific statuses
const testCases = [
  { role: 'sectionadmin', status: 'pending section review', shouldShow: true },
  { role: 'branchadmin', status: 'pending branch review', shouldShow: true },
  { role: 'wardadmin', status: 'pending ward review', shouldShow: true },
  { role: 'districtadmin', status: 'pending district review', shouldShow: true },
  { role: 'provinceadmin', status: 'pending provincial review', shouldShow: true },
  { role: 'admin', status: 'pending section review', shouldShow: true },
  { role: 'admin', status: 'pending branch review', shouldShow: true },
  { role: 'admin', status: 'pending ward review', shouldShow: true },
  { role: 'admin', status: 'pending district review', shouldShow: true },
  { role: 'admin', status: 'pending provincial review', shouldShow: true },
  { role: 'admin', status: 'Approved', shouldShow: false }, // Only Update Status
  { role: 'member', status: 'pending section review', shouldShow: false },
  { role: 'sectionadmin', status: 'pending branch review', shouldShow: false }, // Wrong status
  { role: 'branchadmin', status: 'pending section review', shouldShow: false }, // Wrong status
];

testCases.forEach((testCase, index) => {
  const result = getButtonVisibility({ role: testCase.role }, testCase.status);
  const hasButtons = result.canApprove || result.canReject || result.canUpdateStatus;
  const passed = hasButtons === testCase.shouldShow;
  
  console.log(`Test ${index + 1}: ${testCase.role} + ${testCase.status}`);
  console.log(`  Expected buttons: ${testCase.shouldShow ? 'YES' : 'NO'}`);
  console.log(`  Actual result: ${hasButtons ? 'YES' : 'NO'} (${JSON.stringify(result)})`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

console.log('=== TEST COMPLETE ===');