-- Update existing user roles to match new role names
UPDATE members 
SET role = CASE 
  WHEN role = 'National Admin' THEN 'admin'
  WHEN role = 'Provincial Admin' THEN 'provinceadmin'
  WHEN role = 'District Admin' THEN 'districtadmin'
  WHEN role = 'Ward Admin' THEN 'wardadmin'
  WHEN role = 'Branch Admin' THEN 'branchadmin'
  WHEN role = 'Section Admin' THEN 'sectionadmin'
  WHEN role = 'Member' THEN 'member'
  ELSE role
END;

-- Insert demo users with correct roles if they don't exist
INSERT INTO members (
  id, email, password_hash, full_name, nrc_number, date_of_birth, 
  phone, residential_address, province, district, constituency, 
  ward, branch, section, role, membership_id
) VALUES 
  (
    gen_random_uuid(),
    'admin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Hakainde Hichilema',
    '1234567890',
    '1962-06-04',
    '+260977123456',
    'State House, Lusaka',
    'Lusaka',
    'Lusaka',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'admin',
    'UPND-ADMIN-001'
  ),
  (
    gen_random_uuid(),
    'provinceadmin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Cornelius Mweetwa',
    '1234567891',
    '1970-01-01',
    '+260977123457',
    'Lusaka Province',
    'Lusaka',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'provinceadmin',
    'UPND-PROV-001'
  ),
  (
    gen_random_uuid(),
    'districtadmin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Mutale Nalumango',
    '1234567892',
    '1975-01-01',
    '+260977123458',
    'Lusaka',
    'Lusaka District',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'districtadmin',
    'UPND-DIST-001'
  ),
  (
    gen_random_uuid(),
    'wardadmin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Sylvia Mweetwa',
    '1234567893',
    '1980-01-01',
    '+260977123459',
    'Lusaka',
    'Lusaka District',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'wardadmin',
    'UPND-WARD-001'
  ),
  (
    gen_random_uuid(),
    'branchadmin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Jack Mwiimbu',
    '1234567894',
    '1985-01-01',
    '+260977123460',
    'Lusaka',
    'Lusaka District',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'branchadmin',
    'UPND-BRANCH-001'
  ),
  (
    gen_random_uuid(),
    'sectionadmin@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'Peter Sinkamba',
    '1234567895',
    '1990-01-01',
    '+260977123461',
    'Lusaka',
    'Lusaka District',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'sectionadmin',
    'UPND-SECTION-001'
  ),
  (
    gen_random_uuid(),
    'member@upnd.zm',
    '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJbyJjSd6YvL6Y9C2u2', -- 'upnd2024'
    'John Doe',
    '1234567896',
    '1995-01-01',
    '+260977123462',
    'Lusaka',
    'Lusaka District',
    'Lusaka Central',
    'Lusaka Ward',
    'Lusaka Branch',
    'Lusaka Section A',
    'member',
    'UPND-MEMBER-001'
  )
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role;