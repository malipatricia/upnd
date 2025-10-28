import { getButtonVisibility, getNextStatus, getStatusDisplayName, getApprovalLevel } from '../approval';
import { UserRole, MembershipStatus } from '@/types';

describe('Approval System', () => {
  describe('getButtonVisibility', () => {
    it('should hide all buttons for member role', () => {
      const user = { role: 'member' as UserRole };
      const status = 'pending section review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: false,
        canReject: false,
        canUpdateStatus: false
      });
    });

    it('should show all buttons for admin role when status is not approved', () => {
      const user = { role: 'admin' as UserRole };
      const status = 'pending section review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });

    it('should show only update status button for admin when member is already approved', () => {
      const user = { role: 'admin' as UserRole };
      const status = 'Approved' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: false,
        canReject: false,
        canUpdateStatus: true
      });
    });

    it('should show buttons for sectionadmin when status is pending section review', () => {
      const user = { role: 'sectionadmin' as UserRole };
      const status = 'pending section review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });

    it('should hide buttons for sectionadmin when status is not pending section review', () => {
      const user = { role: 'sectionadmin' as UserRole };
      const status = 'pending branch review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: false,
        canReject: false,
        canUpdateStatus: false
      });
    });

    it('should show buttons for branchadmin when status is pending branch review', () => {
      const user = { role: 'branchadmin' as UserRole };
      const status = 'pending branch review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });

    it('should show buttons for wardadmin when status is pending ward review', () => {
      const user = { role: 'wardadmin' as UserRole };
      const status = 'pending ward review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });

    it('should show buttons for districtadmin when status is pending district review', () => {
      const user = { role: 'districtadmin' as UserRole };
      const status = 'pending district review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });

    it('should show buttons for provinceadmin when status is pending provincial review', () => {
      const user = { role: 'provinceadmin' as UserRole };
      const status = 'pending provincial review' as MembershipStatus;
      
      const result = getButtonVisibility(user, status);
      
      expect(result).toEqual({
        canApprove: true,
        canReject: true,
        canUpdateStatus: true
      });
    });
  });

  describe('getNextStatus', () => {
    it('should return Approved for admin role', () => {
      const user = { role: 'admin' as UserRole };
      const currentStatus = 'pending section review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('Approved');
    });

    it('should return pending branch review for sectionadmin role', () => {
      const user = { role: 'sectionadmin' as UserRole };
      const currentStatus = 'pending section review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('pending branch review');
    });

    it('should return pending ward review for branchadmin role', () => {
      const user = { role: 'branchadmin' as UserRole };
      const currentStatus = 'pending branch review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('pending ward review');
    });

    it('should return pending district review for wardadmin role', () => {
      const user = { role: 'wardadmin' as UserRole };
      const currentStatus = 'pending ward review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('pending district review');
    });

    it('should return pending provincial review for districtadmin role', () => {
      const user = { role: 'districtadmin' as UserRole };
      const currentStatus = 'pending district review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('pending provincial review');
    });

    it('should return Approved for provinceadmin role', () => {
      const user = { role: 'provinceadmin' as UserRole };
      const currentStatus = 'pending provincial review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe('Approved');
    });

    it('should return current status for member role', () => {
      const user = { role: 'member' as UserRole };
      const currentStatus = 'pending section review' as MembershipStatus;
      
      const result = getNextStatus(user, currentStatus);
      
      expect(result).toBe(currentStatus);
    });
  });

  describe('getStatusDisplayName', () => {
    it('should return proper display names for all statuses', () => {
      expect(getStatusDisplayName('pending section review')).toBe('Pending Section Review');
      expect(getStatusDisplayName('pending branch review')).toBe('Pending Branch Review');
      expect(getStatusDisplayName('pending ward review')).toBe('Pending Ward Review');
      expect(getStatusDisplayName('pending district review')).toBe('Pending District Review');
      expect(getStatusDisplayName('pending provincial review')).toBe('Pending Provincial Review');
      expect(getStatusDisplayName('Approved')).toBe('Approved');
      expect(getStatusDisplayName('Rejected')).toBe('Rejected');
    });
  });

  describe('getApprovalLevel', () => {
    it('should return proper approval levels for all statuses', () => {
      expect(getApprovalLevel('pending section review')).toBe('Section Level');
      expect(getApprovalLevel('pending branch review')).toBe('Branch Level');
      expect(getApprovalLevel('pending ward review')).toBe('Ward Level');
      expect(getApprovalLevel('pending district review')).toBe('District Level');
      expect(getApprovalLevel('pending provincial review')).toBe('Provincial Level');
      expect(getApprovalLevel('Approved')).toBe('Approved');
      expect(getApprovalLevel('Rejected')).toBe('Rejected');
    });
  });
});