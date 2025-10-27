import { useState, useEffect } from 'react';
import { UPNDMember, Statistics, MembershipStatus, Jurisdiction } from '../types';
import { getDashboardStatistics, getAllMembers } from '../server/server.actions';

// Mock data for demonstration
const generateMockMembers = (): UPNDMember[] => {
  const members: UPNDMember[] = [];
  const provinces = ['Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Southern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Muchinga'];
  const statuses: MembershipStatus[] = ['Approved', 'Pending Section Review', 'Pending Branch Review', 'Pending Ward Review', 'Pending District Review', 'Rejected'];
  
  for (let i = 1; i <= 150; i++) {
    const registrationDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    
    members.push({
      id: `member-${i}`,
      membershipId: `UPND${Date.now() + i}`,
      fullName: `UPND Member ${i}`,
      nrcNumber: `${Math.floor(Math.random() * 900000) + 100000}/10/1`,
      dateOfBirth: '1990-01-01',
      residentialAddress: `Address ${i}, ${province} Province`,
      phone: `+260${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: Math.random() > 0.3 ? `member${i}@example.com` : undefined,
      endorsements: [],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      registrationDate: registrationDate.toISOString(),
      jurisdiction: {
        province,
        district: 'Sample District',
        constituency: 'Sample Constituency',
        ward: 'Sample Ward',
        branch: 'Sample Branch',
        section: 'Sample Section'
      },
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
          phone: member.phone,
          email: member.email || undefined,
          endorsements: [],
          status: member.status as MembershipStatus,
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
        const pendingApplications = mockMembers.filter(m => m.status.includes('Pending')).length;
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
      residentialAddress: memberData.residentialAddress || '',
      phone: memberData.phone || '',
      email: memberData.email,
      endorsements: memberData.endorsements || [],
      status: 'Pending Section Review',
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

  const updateMemberStatus = (memberId: string, status: MembershipStatus) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, status } 
          : member
      )
    );
  };

  const getMemberById = (id: string): UPNDMember | undefined => {
    return members.find(member => member.id === id);
  };

  const bulkApprove = (memberIds: string[]) => {
    setMembers(prev => 
      prev.map(member => 
        memberIds.includes(member.id) 
          ? { ...member, status: 'Approved' as MembershipStatus } 
          : member
      )
    );
  };

  return {
    members,
    statistics,
    loading,
    addMember,
    updateMemberStatus,
    getMemberById,
    bulkApprove
  };
}