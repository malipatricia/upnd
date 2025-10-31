import { OrganizationalLevel, UserRole } from '@/types';

export const ROLE_ALIAS_MAP: Record<string, UserRole> = {
  admin: 'admin',
  administrator: 'admin',
  nationaladmin: 'nationaladmin',
  nationaladministrator: 'nationaladmin',
  nationalchairperson: 'nationaladmin',
  nationalchairman: 'nationaladmin',
  provinceadmin: 'provinceadmin',
  provincialadmin: 'provinceadmin',
  provinceadministrator: 'provinceadmin',
  provincialadministrator: 'provinceadmin',
  provincechairperson: 'provinceadmin',
  districtadmin: 'districtadmin',
  districtadministrator: 'districtadmin',
  districtchairperson: 'districtadmin',
  wardadmin: 'wardadmin',
  wardadministrator: 'wardadmin',
  wardchairperson: 'wardadmin',
  branchadmin: 'branchadmin',
  branchadministrator: 'branchadmin',
  branchchairperson: 'branchadmin',
  sectionadmin: 'sectionadmin',
  sectionadministrator: 'sectionadmin',
  sectionchairperson: 'sectionadmin',
  member: 'member',
};

export const ROLE_LEVEL_MAP: Record<UserRole, OrganizationalLevel> = {
  admin: 'National',
  nationaladmin: 'National',
  provinceadmin: 'Provincial',
  districtadmin: 'District',
  wardadmin: 'Ward',
  branchadmin: 'Branch',
  sectionadmin: 'Section',
  member: 'Section',
};

const ADMIN_ROLES: UserRole[] = ['admin', 'nationaladmin'];

export function normalizeRole(role?: string | null): UserRole {
  if (!role) return 'member';
  const sanitized = role.trim().toLowerCase().replace(/[^a-z]/g, '');
  return ROLE_ALIAS_MAP[sanitized] ?? 'member';
}

export function deriveLevel(role: UserRole): OrganizationalLevel {
  return ROLE_LEVEL_MAP[role] ?? 'National';
}

export function hasAdminPrivileges(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return ADMIN_ROLES.includes(normalized);
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_all',
    'approve_all',
    'manage_users',
    'generate_reports',
    'export_data',
    'approve_members',
    'system_settings',
    'manage_disciplinary',
    'manage_events',
    'approve_section',
    'approve_branch',
    'approve_ward',
    'approve_district',
    'approve_province',
  ],
  nationaladmin: [
    'view_all',
    'approve_all',
    'manage_users',
    'generate_reports',
    'export_data',
    'approve_members',
    'system_settings',
    'manage_disciplinary',
    'manage_events',
    'approve_section',
    'approve_branch',
    'approve_ward',
    'approve_district',
    'approve_province',
  ],
  provinceadmin: [
    'view_province',
    'approve_members',
    'manage_province_users',
    'generate_reports',
    'export_data',
    'manage_districts',
    'manage_branches',
    'manage_officials',
    'manage_events',
    'view_performance',
    'manage_disciplinary',
    'approve_province',
  ],
  districtadmin: [
    'view_district',
    'approve_members',
    'manage_district_users',
    'generate_reports',
    'manage_constituencies',
    'manage_events',
    'approve_district',
  ],
  wardadmin: [
    'view_ward',
    'approve_members',
    'manage_ward_users',
    'generate_reports',
    'manage_branches',
    'manage_events',
    'approve_ward',
  ],
  branchadmin: [
    'view_branch',
    'approve_members',
    'manage_branch_users',
    'generate_reports',
    'manage_sections',
    'manage_events',
    'approve_branch',
  ],
  sectionadmin: [
    'view_section',
    'review_applications',
    'generate_reports',
    'approve_section',
  ],
  member: [
    'view_profile',
    'update_profile',
  ],
};

