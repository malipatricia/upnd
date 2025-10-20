import React, { useState } from 'react';
import { UPNDMember } from '../../types';
import { Download, Eye } from 'lucide-react';

interface MembershipCardProps {
  member: UPNDMember;
  cardType?: 'standard' | 'premium' | 'executive';
  onGenerate?: (member: UPNDMember) => void;
  onPreview?: (member: UPNDMember) => void;
}

export function MembershipCard({ member, cardType = 'standard', onGenerate, onPreview }: MembershipCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== GENERATE BUTTON CLICKED ===');
    console.log('Member:', member.fullName);

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onGenerate) {
        onGenerate(member);
      }

      alert(`✓ Card generated successfully for ${member.fullName}!\n\nMembership ID: ${member.membershipId}`);

    } catch (error) {
      console.error('Error generating card:', error);
      alert('Error generating card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== PREVIEW BUTTON CLICKED ===');
    console.log('Member:', member.fullName);

    if (onPreview) {
      onPreview(member);
    }

    setShowPreview(true);
  };

  const nameParts = member.fullName.split(' ');
  const surname = nameParts[0] || '';
  const givenName = nameParts.slice(1).join(' ') || '';

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200">
        {/* Card Preview - Front */}
        <div className="p-4">
          <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-red-600 to-red-700 rounded-lg overflow-hidden shadow-xl">
            {/* Decorative yellow map shape */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-500">
                <path d="M20,10 L40,5 L60,15 L80,10 L90,30 L85,50 L70,60 L50,55 L30,65 L15,45 Z" />
              </svg>
            </div>

            {/* UPND Logo and Title */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex items-center space-x-2 bg-yellow-500 rounded-full px-3 py-1.5">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                  alt="UPND Logo"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-xs font-bold text-red-900">UPND</span>
              </div>
              <div className="text-right">
                <div className="text-white text-xs font-bold">United Party for National Development</div>
                <div className="text-yellow-400 text-xs font-bold mt-0.5">MEMBERSHIP CARD</div>
                <div className="text-yellow-400 text-[10px] font-semibold mt-0.5">ID: {member.membershipId}</div>
              </div>
            </div>

            {/* Member Photo */}
            <div className="absolute top-16 right-3">
              <div className="w-24 h-28 bg-white rounded-lg overflow-hidden border-2 border-yellow-500 shadow-lg">
                <img
                  src="https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2021/08/235884370_2905514553049333_3681523300282842713_n-e1629125132747.jpg"
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Small profile icon top right */}
            <div className="absolute top-3 right-28 w-8 h-8 rounded-full overflow-hidden border border-yellow-500">
              <img
                src="https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2021/08/235884370_2905514553049333_3681523300282842713_n-e1629125132747.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Member Details */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-red-800/90 to-transparent">
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-yellow-400 text-[10px] font-semibold">SURNAME</span>
                  <span className="text-white text-sm font-bold uppercase">{surname}</span>
                  <span className="text-yellow-400 text-[10px] font-semibold ml-2">GIVEN NAME</span>
                  <span className="text-white text-sm font-bold uppercase">{givenName}</span>
                  <span className="text-yellow-400 text-[10px] font-semibold ml-2">SEX</span>
                  <span className="text-white text-sm font-bold">M</span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-yellow-400 text-[10px] font-semibold">Position</span>
                  <span className="text-white text-xs font-semibold">PARTY MEMBER</span>
                  <span className="text-yellow-400 text-[10px] font-semibold ml-4">Validity:</span>
                  <span className="text-white text-xs font-semibold">12.31.30</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <div className="text-yellow-400 text-[9px] font-bold">PROVINCE</div>
                    <div className="text-black bg-white/90 px-1 py-0.5 text-[10px] font-bold rounded">
                      {member.jurisdiction.province.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-yellow-400 text-[9px] font-bold">DISTRICT</div>
                    <div className="text-black bg-white/90 px-1 py-0.5 text-[10px] font-bold rounded">
                      {member.jurisdiction.district.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-yellow-400 text-[9px] font-bold">CONSTITUENCY</div>
                    <div className="text-black bg-white/90 px-1 py-0.5 text-[10px] font-bold rounded">
                      {member.jurisdiction.constituency.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zambia flag icon */}
            <div className="absolute bottom-3 right-3 w-8 h-6 bg-green-600 rounded border border-yellow-500 flex items-center justify-center">
              <div className="text-yellow-500 text-lg font-bold">🇿🇲</div>
            </div>
          </div>
        </div>

        {/* Card Details and Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{member.fullName}</h3>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
              {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
            </span>
          </div>

          <div className="space-y-1 text-xs text-gray-600 mb-4">
            <div>ID: {member.membershipId}</div>
            <div>{member.jurisdiction.province}, {member.jurisdiction.district}</div>
            <div>Member since {new Date(member.registrationDate).getFullYear()}</div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ pointerEvents: isGenerating ? 'none' : 'auto' }}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate Card</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePreviewClick}
              className="flex items-center justify-center space-x-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal - Shows both front and back */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
          onClick={() => {
            console.log('Closing preview modal');
            setShowPreview(false);
          }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-lg font-semibold cursor-pointer bg-white/10 px-4 py-2 rounded-lg"
            >
              Close Preview ×
            </button>

            <div className="bg-gray-900 rounded-xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">UPND Membership Card Preview</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Front of Card */}
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-3 text-center">FRONT</h4>
                  <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-red-600 to-red-700 rounded-lg overflow-hidden shadow-2xl">
                    {/* Decorative yellow map shape */}
                    <div className="absolute top-0 right-0 w-40 h-40 opacity-30">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-500">
                        <path d="M20,10 L40,5 L60,15 L80,10 L90,30 L85,50 L70,60 L50,55 L30,65 L15,45 Z" />
                      </svg>
                    </div>

                    {/* UPND Logo and Title */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <div className="flex items-center space-x-2 bg-yellow-500 rounded-full px-4 py-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                          alt="UPND Logo"
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-sm font-bold text-red-900">UPND</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm font-bold leading-tight">United Party for National Development</div>
                        <div className="text-yellow-400 text-sm font-bold mt-1">MEMBERSHIP CARD</div>
                        <div className="text-yellow-400 text-xs font-semibold mt-1">ID: {member.membershipId}</div>
                      </div>
                    </div>

                    {/* Member Photo */}
                    <div className="absolute top-24 right-4">
                      <div className="w-32 h-36 bg-white rounded-lg overflow-hidden border-4 border-yellow-500 shadow-2xl">
                        <img
                          src="https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2021/08/235884370_2905514553049333_3681523300282842713_n-e1629125132747.jpg"
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Small profile icon */}
                    <div className="absolute top-4 right-40 w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500 shadow-lg">
                      <img
                        src="https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2021/08/235884370_2905514553049333_3681523300282842713_n-e1629125132747.jpg"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Member Details */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-red-800/95 to-transparent">
                      <div className="space-y-2">
                        <div className="flex items-baseline space-x-3">
                          <span className="text-yellow-400 text-xs font-semibold">SURNAME</span>
                          <span className="text-white text-base font-bold uppercase">{surname}</span>
                          <span className="text-yellow-400 text-xs font-semibold ml-3">GIVEN NAME</span>
                          <span className="text-white text-base font-bold uppercase">{givenName}</span>
                          <span className="text-yellow-400 text-xs font-semibold ml-3">SEX</span>
                          <span className="text-white text-base font-bold">M</span>
                        </div>

                        <div className="flex items-baseline space-x-3">
                          <span className="text-yellow-400 text-xs font-semibold">Position</span>
                          <span className="text-white text-sm font-semibold">PARTY MEMBER</span>
                          <span className="text-yellow-400 text-xs font-semibold ml-6">Validity:</span>
                          <span className="text-white text-sm font-semibold">12.31.30</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <div className="text-yellow-400 text-[10px] font-bold">PROVINCE</div>
                            <div className="text-black bg-white/95 px-2 py-1 text-xs font-bold rounded">
                              {member.jurisdiction.province.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-400 text-[10px] font-bold">DISTRICT</div>
                            <div className="text-black bg-white/95 px-2 py-1 text-xs font-bold rounded">
                              {member.jurisdiction.district.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-yellow-400 text-[10px] font-bold">CONSTITUENCY</div>
                            <div className="text-black bg-white/95 px-2 py-1 text-xs font-bold rounded">
                              {member.jurisdiction.constituency.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Zambia flag icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-8 bg-green-600 rounded border-2 border-yellow-500 flex items-center justify-center shadow-lg">
                      <div className="text-yellow-500 text-xl">🇿🇲</div>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-3 text-center">BACK</h4>
                  <div className="relative w-full aspect-[1.586/1] bg-white rounded-lg overflow-hidden shadow-2xl">
                    {/* Red header section */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-br from-red-600 to-red-700 p-4">
                      <div className="flex items-start justify-between">
                        <div className="text-yellow-400 text-sm font-bold">
                          ID: {member.membershipId}
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Decorative yellow map shape */}
                          <div className="w-16 h-16 opacity-40">
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-500">
                              <path d="M20,10 L40,5 L60,15 L80,10 L90,30 L85,50 L70,60 L50,55 L30,65 L15,45 Z" />
                            </svg>
                          </div>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
                            <img
                              src="https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2021/08/235884370_2905514553049333_3681523300282842713_n-e1629125132747.jpg"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Red middle section */}
                    <div className="absolute top-[33%] left-0 right-0 h-[25%] bg-gradient-to-br from-red-500 to-red-600 px-4 py-3 flex items-center justify-between">
                      <div className="text-white space-y-1">
                        <div className="text-xs font-bold">National Headquarters</div>
                        <div className="text-xs font-semibold">NO.83A, Provident Street</div>
                        <div className="text-xs font-semibold">Lusaka Zambia</div>
                        <div className="text-xs font-bold">+260 965611870</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 text-xs font-bold">Validity: 10.10.30</div>
                        <div className="text-yellow-400 text-xs font-bold mt-2">Signature</div>
                        <div className="mt-1 h-8 flex items-end">
                          <div className="text-black text-xl font-cursive">___________</div>
                        </div>
                      </div>
                    </div>

                    {/* White barcode section */}
                    <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-white p-4 flex flex-col justify-center items-center">
                      <div className="text-black font-mono text-xs mb-2">
                        <div>IDUPND {member.membershipId}</div>
                        <div className="mt-1">{surname.toUpperCase()}&lt;&lt;{givenName.toUpperCase()}&lt;</div>
                      </div>

                      {/* Barcode */}
                      <div className="flex justify-center items-center h-24 w-full max-w-xs">
                        <svg viewBox="0 0 200 80" className="w-full h-full">
                          <rect x="5" y="0" width="2" height="80" fill="black"/>
                          <rect x="10" y="0" width="1" height="80" fill="black"/>
                          <rect x="13" y="0" width="3" height="80" fill="black"/>
                          <rect x="18" y="0" width="1" height="80" fill="black"/>
                          <rect x="22" y="0" width="2" height="80" fill="black"/>
                          <rect x="26" y="0" width="4" height="80" fill="black"/>
                          <rect x="32" y="0" width="1" height="80" fill="black"/>
                          <rect x="35" y="0" width="2" height="80" fill="black"/>
                          <rect x="39" y="0" width="3" height="80" fill="black"/>
                          <rect x="44" y="0" width="1" height="80" fill="black"/>
                          <rect x="47" y="0" width="2" height="80" fill="black"/>
                          <rect x="51" y="0" width="4" height="80" fill="black"/>
                          <rect x="57" y="0" width="1" height="80" fill="black"/>
                          <rect x="60" y="0" width="3" height="80" fill="black"/>
                          <rect x="65" y="0" width="2" height="80" fill="black"/>
                          <rect x="69" y="0" width="1" height="80" fill="black"/>
                          <rect x="72" y="0" width="4" height="80" fill="black"/>
                          <rect x="78" y="0" width="2" height="80" fill="black"/>
                          <rect x="82" y="0" width="1" height="80" fill="black"/>
                          <rect x="85" y="0" width="3" height="80" fill="black"/>
                          <rect x="90" y="0" width="2" height="80" fill="black"/>
                          <rect x="94" y="0" width="4" height="80" fill="black"/>
                          <rect x="100" y="0" width="1" height="80" fill="black"/>
                          <rect x="103" y="0" width="2" height="80" fill="black"/>
                          <rect x="107" y="0" width="3" height="80" fill="black"/>
                          <rect x="112" y="0" width="1" height="80" fill="black"/>
                          <rect x="115" y="0" width="4" height="80" fill="black"/>
                          <rect x="121" y="0" width="2" height="80" fill="black"/>
                          <rect x="125" y="0" width="1" height="80" fill="black"/>
                          <rect x="128" y="0" width="3" height="80" fill="black"/>
                          <rect x="133" y="0" width="2" height="80" fill="black"/>
                          <rect x="137" y="0" width="4" height="80" fill="black"/>
                          <rect x="143" y="0" width="1" height="80" fill="black"/>
                          <rect x="146" y="0" width="2" height="80" fill="black"/>
                          <rect x="150" y="0" width="3" height="80" fill="black"/>
                          <rect x="155" y="0" width="1" height="80" fill="black"/>
                          <rect x="158" y="0" width="2" height="80" fill="black"/>
                          <rect x="162" y="0" width="4" height="80" fill="black"/>
                          <rect x="168" y="0" width="1" height="80" fill="black"/>
                          <rect x="171" y="0" width="3" height="80" fill="black"/>
                          <rect x="176" y="0" width="2" height="80" fill="black"/>
                          <rect x="180" y="0" width="1" height="80" fill="black"/>
                          <rect x="183" y="0" width="4" height="80" fill="black"/>
                          <rect x="189" y="0" width="2" height="80" fill="black"/>
                          <rect x="193" y="0" width="1" height="80" fill="black"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={async () => {
                    setShowPreview(false);
                    await handleGenerateClick({} as any);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-lg cursor-pointer"
                >
                  Generate & Download Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
