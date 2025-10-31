import { useState, useEffect } from 'react';
import { UPNDMember, Statistics, MembershipStatus, UserRole } from '../types';
import { getDashboardStatistics, getAllMembers, updateMemberStatus as updateMemberStatusAction, bulkUpdateMemberStatus } from '../server/server.actions';
import { useAuth } from '@/context/AuthContext';

// Mock data for demonstration
const generateMockMembers = (): UPNDMember[] => {
  const members: UPNDMember[] = [];
  const provinces = ['Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Southern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Muchinga'];
  const statuses: MembershipStatus[] = ['Approved', 'Pending Section Review', 'Pending Branch Review', 'Pending Ward Review', 'Pending District Review', 'Rejected'];
  
  for (let i = 1; i <= 150; i++) {
  const registrationDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  members.push({
    id: `member-${i}`,
    membershipId: `UPND${i}`,
    fullName: `Member ${i}`,
    nrcNumber: `NRC${i}`,
    dateOfBirth: '1990-01-01',
    residentialAddress: 'Some Address',
    role: { id: `role-${i}`, name: 'Member' },
    phone: '0000000000',
    email: `member${i}@example.com`,
    endorsements: [],
    status: 'Pending Section Review',
    registrationDate: registrationDate.toISOString(),
    jurisdiction: { province, district: '', constituency: '', ward: '', branch: '', section: '' },
    disciplinaryRecords: [],
    appeals: [],
    partyCommitment: 'Unity, Work, Progress'
  });
}

  
  return members;
};

export function useMembers(startDate?: Date, endDate?: Date) {
  const [members, setMembers] = useState<UPNDMember[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const actorRole = (user?.role ?? 'member') as UserRole;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from database
        const [statsData, membersData] = await Promise.all([
          getDashboardStatistics(startDate, endDate),
          getAllMembers(startDate, endDate)
        ]);
        
        // Transform database members to UPNDMember format
        const transformedMembers: UPNDMember[] = membersData.map(member => ({
          id: member.id,
          membershipId: member.membershipId,
          fullName: member.fullName,
          nrcNumber: member.nrcNumber,
          dateOfBirth: member.dateOfBirth,
          residentialAddress: member.residentialAddress,
          role: {
            id: member.id,
            name: member.role || null
          },
          phone: member.phone,
          email: member.email || undefined,
          endorsements: [],
          status: member.status,
          registrationDate: member.registrationDate?.toISOString() || new Date().toISOString(),
          jurisdiction: {
            province: member.province,
            district: member.district,
            constituency: member.constituency,
            ward: member.ward,
            branch: member.branch,
            section: member.section
          },
          disciplinaryRecords: [],
          appeals: [],
          partyCommitment: member.partyCommitment || 'Unity, Work, Progress'
        }));
        
        setMembers(transformedMembers);
        setStatistics({
          ...statsData,
          rejectedApplications: 0,
          suspendedMembers: 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if real data fails
        const mockMembers = generateMockMembers();
        setMembers(mockMembers);
        
        const totalMembers = mockMembers.length;
        const pendingApplications = mockMembers.filter(m => m.status?.includes('Pending')).length;
        const approvedMembers = mockMembers.filter(m => m.status === 'Approved').length;
        const rejectedApplications = mockMembers.filter(m => m.status === 'Rejected').length;
        const suspendedMembers = mockMembers.filter(m => m.status === 'Suspended').length;
        
        const provincialDistribution: Record<string, number> = {};
        mockMembers.forEach(member => {
          const province = member.jurisdiction.province;
          provincialDistribution[province] = (provincialDistribution[province] || 0) + 1;
        });
        
        const monthlyTrends = [
          { month: 'Jan', registrations: 45 },
          { month: 'Feb', registrations: 52 },
          { month: 'Mar', registrations: 61 },
          { month: 'Apr', registrations: 58 },
          { month: 'May', registrations: 67 },
          { month: 'Jun', registrations: 73 },
          { month: 'Jul', registrations: 68 },
          { month: 'Aug', registrations: 75 },
          { month: 'Sep', registrations: 82 },
          { month: 'Oct', registrations: 79 },
          { month: 'Nov', registrations: 85 },
          { month: 'Dec', registrations: 91 }
        ];
        
        const statusDistribution: Record<MembershipStatus, number> = {
          'Pending Section Review': 0,
          'Pending Branch Review': 0,
          'Pending Ward Review': 0,
          'Pending District Review': 0,
          'Pending Provincial Review': 0,
          'Approved': 0,
          'Rejected': 0,
          'Suspended': 0,
          'Expelled': 0
        };
        
        mockMembers.forEach(member => {
          statusDistribution[member.status]++;
        });
        
        setStatistics({
          totalMembers,
          pendingApplications,
          approvedMembers,
          rejectedApplications,
          suspendedMembers,
          provincialDistribution,
          monthlyTrends,
          statusDistribution
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const addMember = (memberData: Partial<UPNDMember>) => {
    const newMember: UPNDMember = {
      id: `member-${Date.now()}`,
      membershipId: `UPND${Date.now()}`,
      fullName: memberData.fullName || '',
      nrcNumber: memberData.nrcNumber || '',
      dateOfBirth: memberData.dateOfBirth || '',
      role: {
            id: memberData.role?.id || '',
            name: memberData.role?.name || ''
          },
      residentialAddress: memberData.residentialAddress || '',
      phone: memberData.phone || '',
      email: memberData.email,
      status: memberData.status || 'Pending Section Review',
      endorsements: memberData.endorsements || [],
      registrationDate: new Date().toISOString(),
      jurisdiction: memberData.jurisdiction || {
        province: '',
        district: '',
        constituency: '',
        ward: '',
        branch: '',
        section: ''
      },
      disciplinaryRecords: [],
      appeals: [],
      partyCommitment: 'Unity, Work, Progress'
    };
    
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateMemberStatus = async (memberId: string, status: MembershipStatus) => {
    try {
      // Update the database first
      const result = await updateMemberStatusAction(memberId, status, actorRole);
      
      if (result.error) {
        console.error('Failed to update member status:', result.error);
        return;
      }

      // Update local state only if database update was successful
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, status } 
            : member
        )
      );
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const approveMember = async (memberId: string, currentStatus: MembershipStatus, userRole: string) => {
    const actingRole = (userRole || actorRole) as UserRole;
    let nextStatus: MembershipStatus;
    
    // Determine next status based on current status and user role
    if (actingRole === 'admin' || actingRole === 'nationaladmin') {
      // Admin can approve at any level and skip to final approval
      nextStatus = 'Approved';
    } else {
      // Regular approval workflow
      switch (currentStatus) {
        case 'Pending Section Review':
          if (actingRole === 'sectionadmin') {
            nextStatus = 'Pending Branch Review';
          } else {
            throw new Error('Only section admins can approve at section level');
          }
          break;
        case 'Pending Branch Review':
          if (actingRole === 'branchadmin') {
            nextStatus = 'Pending Ward Review';
          } else {
            throw new Error('Only branch admins can approve at branch level');
          }
          break;
        case 'Pending Ward Review':
          if (actingRole === 'wardadmin') {
            nextStatus = 'Pending District Review';
          } else {
            throw new Error('Only ward admins can approve at ward level');
          }
          break;
        case 'Pending District Review':
          if (actingRole === 'districtadmin') {
            nextStatus = 'Pending Provincial Review';
          } else {
            throw new Error('Only district admins can approve at district level');
          }
          break;
        case 'Pending Provincial Review':
          if (actingRole === 'provinceadmin') {
            nextStatus = 'Approved';
          } else {
            throw new Error('Only province admins can approve at province level');
          }
          break;
        default:
          throw new Error('Invalid status for approval');
      }
    }

    await updateMemberStatus(memberId, nextStatus);
  };

  const getMemberById = (id: string): UPNDMember | undefined => {
    return members.find(member => member.id === id);
  };

  const bulkApprove = async (memberIds: string[]) => {
    try {
      // Update the database first
      const result = await bulkUpdateMemberStatus(memberIds, 'Approved', actorRole);
      
      if (result.error) {
        console.error('Failed to bulk update member status:', result.error);
        return;
      }

      // Update local state only if database update was successful
      setMembers(prev => 
        prev.map(member => 
          memberIds.includes(member.id) 
            ? { ...member, status: 'Approved' as MembershipStatus } 
            : member
        )
      );
    } catch (error) {
      console.error('Error bulk updating member status:', error);
    }
  };

  const updateMember = async (memberId: string, updatedData: Partial<UPNDMember>) => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state with the updated member data
        setMembers(prev => 
          prev.map(member => 
            member.id === memberId 
              ? { 
                  ...member, 
                  fullName: result.member.fullName,
                  nrcNumber: result.member.nrcNumber,
                  dateOfBirth: result.member.dateOfBirth,
                  phone: result.member.phone,
                  email: result.member.email,
                  residentialAddress: result.member.residentialAddress,
                  jurisdiction: result.member.jurisdiction,
                  partyCommitment: result.member.partyCommitment
                } 
              : member
          )
        );
        return result.member;
      }
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  return {
    members,
    statistics,
    loading,
    addMember,
    updateMemberStatus,
    approveMember,
    getMemberById,
    bulkApprove
  };
}