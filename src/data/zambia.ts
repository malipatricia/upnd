export const zambianProvinces = [
  'Central',
  'Copperbelt',
  'Eastern', 
  'Luapula',
  'Lusaka',
  'Muchinga',
  'Northern',
  'North-Western',
  'Southern',
  'Western'
];

export const provincialDistricts: Record<string, string[]> = {
  'Central': [
    'Chibombo', 'Chisamba', 'Chitambo', 'Kabwe', 'Kapiri Mposhi',
    'Luano', 'Mkushi', 'Mumbwa', 'Ngabwe', 'Shibuyunji'
  ],
  'Copperbelt': [
    'Chililabombwe', 'Chingola', 'Kalulushi', 'Kitwe', 'Luanshya',
    'Lufwanyama', 'Masaiti', 'Mpongwe', 'Mufulira', 'Ndola'
  ],
  'Eastern': [
    'Chadiza', 'Chapata', 'Chipata', 'Katete', 'Lundazi',
    'Mambwe', 'Nyimba', 'Petauke', 'Sinda', 'Vubwi'
  ],
  'Luapula': [
    'Chiengi', 'Chipili', 'Kawambwa', 'Lunga', 'Mansa',
    'Milenge', 'Mwansabombwe', 'Mwense', 'Nchelenge', 'Samfya'
  ],
  'Lusaka': [
    'Chongwe', 'Kafue', 'Luangwa', 'Lusaka', 'Rufunsa'
  ],
  'Muchinga': [
    'Chama', 'Chinsali', 'Isoka', 'Kanchibiya', 'Mpika',
    'Nakonde', 'Shiwang\'andu'
  ],
  'Northern': [
    'Chilubi', 'Kaputa', 'Kasama', 'Luwingu', 'Mbala',
    'Mporokoso', 'Mungwi', 'Nsama', 'Senga Hill'
  ],
  'North-Western': [
    'Chavuma', 'Ikelenge', 'Kabompo', 'Kasempa', 'Mufumbwe',
    'Mushindamo', 'Mwinilunga', 'Solwezi', 'Zambezi'
  ],
  'Southern': [
    'Chikankata', 'Chirundu', 'Gwembe', 'Itezhi-Tezhi', 'Kalomo',
    'Kazungula', 'Livingstone', 'Mazabuka', 'Monze', 'Namwala',
    'Pemba', 'Siavonga', 'Sinazongwe', 'Zimba'
  ],
  'Western': [
    'Kalabo', 'Kaoma', 'Limulunga', 'Luampa', 'Lukulu',
    'Mitete', 'Mongu', 'Mulobezi', 'Mwandi', 'Nalolo',
    'Nkeyema', 'Senanga', 'Sesheke', 'Shangombo', 'Sikongo'
  ]
};

export const violationTypes = [
  'Misconduct',
  'Breach of Party Constitution',
  'Insubordination',
  'Corruption',
  'Misuse of Party Resources',
  'Bringing Party into Disrepute',
  'Failure to Follow Directives',
  'Unauthorized Representation',
  'Financial Irregularities',
  'Anti-Party Activities'
];

export const upndPositions = [
  'National President',
  'National Vice President',
  'National Chairperson',
  'Secretary General',
  'National Treasurer',
  'Provincial Chairperson',
  'Provincial Secretary',
  'District Chairperson',
  'District Secretary',
  'Constituency Chairperson',
  'Constituency Secretary',
  'Ward Chairperson',
  'Ward Secretary',
  'Branch Chairperson',
  'Branch Secretary',
  'Section Chairperson',
  'Section Secretary'
];

export const upndPolicyAreas = [
  'Economic Development',
  'Education Reform',
  'Healthcare Improvement',
  'Infrastructure Development',
  'Agriculture Modernization',
  'Youth Empowerment',
  'Women Empowerment',
  'Good Governance',
  'Anti-Corruption',
  'Social Justice',
  'Environmental Protection',
  'Digital Transformation'
];

export const zambia = {
  provinces: [
    { name: 'Central', districts: provincialDistricts['Central'] },
    { name: 'Copperbelt', districts: provincialDistricts['Copperbelt'] },
    { name: 'Eastern', districts: provincialDistricts['Eastern'] },
    { name: 'Luapula', districts: provincialDistricts['Luapula'] },
    { name: 'Lusaka', districts: provincialDistricts['Lusaka'] },
    { name: 'Muchinga', districts: provincialDistricts['Muchinga'] },
    { name: 'Northern', districts: provincialDistricts['Northern'] },
    { name: 'North-Western', districts: provincialDistricts['North-Western'] },
    { name: 'Southern', districts: provincialDistricts['Southern'] },
    { name: 'Western', districts: provincialDistricts['Western'] }
  ]
};