// Test the authentication flow to see if roles are being passed correctly
const { getButtonVisibility } = require('./src/lib/approval.ts');

// Simulate different user scenarios
const testUsers = [
  { role: 'admin', name: 'Admin User' },
  { role: 'provinceadmin', name: 'Province Admin' },
  { role: 'districtadmin', name: 'District Admin' },
  { role: 'wardadmin', name: 'Ward Admin' },
  { role: 'branchadmin', name: 'Branch Admin' },
  { role: 'sectionadmin', name: 'Section Admin' },
  { role: 'member', name: 'Member' },
];

const testStatuses = [
  'pending section review',
  'pending branch review', 
  'pending ward review',
  'pending district review',
  'pending provincial review',
  'Approved'
];

console.log('=== TESTING AUTHENTICATION FLOW ===\n');

testUsers.forEach(user => {
  console.log(`\n--- Testing ${user.name} (${user.role}) ---`);
  
  testStatuses.forEach(status => {
    const result = getButtonVisibility(user, status);
    const hasButtons = result.canApprove || result.canReject || result.canUpdateStatus;
    
    if (hasButtons) {
      console.log(`  ${status}: ${JSON.stringify(result)}`);
    }
  });
});

console.log('\n=== TEST COMPLETE ===');