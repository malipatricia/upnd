import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase';
import { MemberMapData, MembershipStatus } from '../../types';
import { MapPin, Users, Filter, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { zambia } from '../../data/zambia';

const ZAMBIA_CENTER: [number, number] = [-13.1339, 27.8493];
const ZAMBIA_BOUNDS: [[number, number], [number, number]] = [
  [-18.0, 21.9],
  [-8.2, 33.7]
];

interface ProvinceStats {
  province: string;
  count: number;
  center: [number, number];
  members: MemberMapData[];
}

function MapBoundsController({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(new LatLngBounds(bounds[0], bounds[1]));
    }
  }, [bounds, map]);

  return null;
}

export function GeoMapping() {
  const [members, setMembers] = useState<MemberMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<MembershipStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'markers' | 'clusters'>('clusters');
  const [provinceStats, setProvinceStats] = useState<ProvinceStats[]>([]);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    calculateProvinceStats();
  }, [members, selectedProvince, selectedDistrict, selectedStatus]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, membership_id, latitude, longitude, province, district, constituency, status, membership_level')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      const mappedMembers: MemberMapData[] = (data || []).map((m: any) => ({
        id: m.id,
        fullName: m.full_name,
        membershipId: m.membership_id,
        latitude: m.latitude,
        longitude: m.longitude,
        province: m.province,
        district: m.district,
        constituency: m.constituency,
        status: m.status,
        membershipLevel: m.membership_level
      }));

      setMembers(mappedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProvinceStats = () => {
    const filtered = getFilteredMembers();
    const provinceMap = new Map<string, MemberMapData[]>();

    filtered.forEach(member => {
      if (!provinceMap.has(member.province)) {
        provinceMap.set(member.province, []);
      }
      provinceMap.get(member.province)!.push(member);
    });

    const stats: ProvinceStats[] = Array.from(provinceMap.entries()).map(([province, members]) => {
      const avgLat = members.reduce((sum, m) => sum + m.latitude, 0) / members.length;
      const avgLng = members.reduce((sum, m) => sum + m.longitude, 0) / members.length;

      return {
        province,
        count: members.length,
        center: [avgLat, avgLng],
        members
      };
    });

    setProvinceStats(stats.sort((a, b) => b.count - a.count));
  };

  const getFilteredMembers = (): MemberMapData[] => {
    return members.filter(member => {
      if (selectedProvince !== 'all' && member.province !== selectedProvince) return false;
      if (selectedDistrict !== 'all' && member.district !== selectedDistrict) return false;
      if (selectedStatus !== 'all' && member.status !== selectedStatus) return false;
      return true;
    });
  };

  const getDistrictsForProvince = (province: string): string[] => {
    if (province === 'all') return [];
    const provinceData = zambia.provinces.find(p => p.name === province);
    return provinceData ? provinceData.districts : [];
  };

  const getMarkerColor = (status: MembershipStatus): string => {
    if (status === 'Approved') return '#16a34a';
    if (status.includes('Pending')) return '#eab308';
    if (status === 'Rejected') return '#dc2626';
    if (status === 'Suspended' || status === 'Expelled') return '#7f1d1d';
    return '#6b7280';
  };

  const handleZoomToProvince = (province: string) => {
    const provinceMembers = members.filter(m => m.province === province);
    if (provinceMembers.length === 0) return;

    const lats = provinceMembers.map(m => m.latitude);
    const lngs = provinceMembers.map(m => m.longitude);

    const minLat = Math.min(...lats) - 0.5;
    const maxLat = Math.max(...lats) + 0.5;
    const minLng = Math.min(...lngs) - 0.5;
    const maxLng = Math.max(...lngs) + 0.5;

    setMapBounds([[minLat, minLng], [maxLat, maxLng]]);
  };

  const handleExportData = () => {
    const filtered = getFilteredMembers();
    const csv = [
      ['Member ID', 'Name', 'Province', 'District', 'Constituency', 'Status', 'Latitude', 'Longitude'].join(','),
      ...filtered.map(m => [
        m.membershipId,
        m.fullName,
        m.province,
        m.district,
        m.constituency,
        m.status,
        m.latitude,
        m.longitude
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upnd-members-geolocation-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredMembers = getFilteredMembers();
  const totalMembers = filteredMembers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Geolocation Map</h1>
          <p className="text-gray-600 mt-1">Visualize member distribution across Zambia</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadMembers}
            className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Provinces</p>
              <p className="text-2xl font-bold text-gray-900">{provinceStats.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredMembers.filter(m => m.status === 'Approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredMembers.filter(m => m.status.includes('Pending')).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('all');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Provinces</option>
                  {zambia.provinces.map(province => (
                    <option key={province.name} value={province.name}>{province.name}</option>
                  ))}
                </select>
              </div>

              {selectedProvince !== 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Districts</option>
                    {getDistrictsForProvince(selectedProvince).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Section Review">Pending Section Review</option>
                  <option value="Pending Branch Review">Pending Branch Review</option>
                  <option value="Pending Ward Review">Pending Ward Review</option>
                  <option value="Pending District Review">Pending District Review</option>
                  <option value="Pending Provincial Review">Pending Provincial Review</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Expelled">Expelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('markers')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'markers'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Markers
                  </button>
                  <button
                    onClick={() => setViewMode('clusters')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'clusters'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Clusters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Province Statistics</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {provinceStats.map(stat => (
                <button
                  key={stat.province}
                  onClick={() => handleZoomToProvince(stat.province)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{stat.province}</span>
                    <span className="text-sm font-semibold text-red-600">{stat.count}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Click to zoom</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '700px' }}>
            <MapContainer
              center={ZAMBIA_CENTER}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              bounds={ZAMBIA_BOUNDS}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapBoundsController bounds={mapBounds} />

              {viewMode === 'markers' && filteredMembers.map(member => (
                <CircleMarker
                  key={member.id}
                  center={[member.latitude, member.longitude]}
                  radius={6}
                  fillColor={getMarkerColor(member.status)}
                  color="white"
                  weight={2}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold text-gray-900">{member.fullName}</p>
                      <p className="text-sm text-gray-600">{member.membershipId}</p>
                      <p className="text-sm text-gray-600 mt-1">{member.province}</p>
                      <p className="text-sm text-gray-600">{member.district}</p>
                      <p className="text-sm text-gray-600">{member.constituency}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        member.status === 'Approved' ? 'text-green-600' :
                        member.status.includes('Pending') ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {member.status}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {viewMode === 'clusters' && provinceStats.map(stat => (
                <CircleMarker
                  key={stat.province}
                  center={stat.center}
                  radius={Math.sqrt(stat.count) * 5}
                  fillColor="#dc2626"
                  color="#7f1d1d"
                  weight={3}
                  fillOpacity={0.6}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold text-gray-900 text-lg">{stat.province}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">{stat.count}</span> members
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-sm text-gray-600">Rejected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-900"></div>
            <span className="text-sm text-gray-600">Suspended/Expelled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-600"></div>
            <span className="text-sm text-gray-600">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
}
