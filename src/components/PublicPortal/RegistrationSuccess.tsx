'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Shield, Clock, Phone, Mail, Home } from 'lucide-react';

interface RegistrationData {
  fullName: string;
  membershipId: string;
  registrationDate: string;
}

export function RegistrationSuccess() {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('upnd_registration_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setRegistrationData(data);
      } catch (error) {
        console.error('Failed to parse registration data:', error);
      }
    }
  }, []);

  const approvalSteps = [
    { step: 1, title: 'Application Received', status: 'completed', description: 'Your application has been successfully submitted' },
    { step: 2, title: 'Section Review', status: 'current', description: 'Local section officials will review your application' },
    { step: 3, title: 'Branch Approval', status: 'pending', description: 'Branch leadership will verify your information' },
    { step: 4, title: 'Ward Confirmation', status: 'pending', description: 'Ward officials will confirm your jurisdiction' },
    { step: 5, title: 'District Validation', status: 'pending', description: 'District administration will validate your membership' },
    { step: 6, title: 'Final Approval', status: 'pending', description: 'Your UPND membership will be officially confirmed' }
  ];

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Registration data not found.</p>
          <Link href="/" className="text-upnd-red hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-upnd-red via-upnd-red-dark to-upnd-yellow">
      <div className="container mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center p-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                alt="UPND Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to UPND, {registrationData.fullName}!
          </h1>
          <p className="text-xl text-white/90 mb-2">Your membership application has been successfully submitted</p>
          <p className="text-2xl font-bold text-upnd-yellow">Unity, Work, Progress</p>
        </div>

        {/* Registration Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 text-center">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Membership ID</h3>
              <p className="text-2xl font-mono text-upnd-yellow bg-white/10 rounded-lg py-2 px-4">
                {registrationData.membershipId}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Registration Date</h3>
              <p className="text-xl text-white/90">
                {new Date(registrationData.registrationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Expected Processing Time</h3>
              <p className="text-xl text-white/90">7-14 Business Days</p>
            </div>
          </div>
        </div>

        {/* Approval Process */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">UPND Approval Process</h2>
          
          <div className="space-y-6">
            {approvalSteps.map((item, index) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : item.status === 'current'
                    ? 'bg-upnd-yellow text-upnd-black'
                    : 'bg-white/20 text-white/60'
                }`}>
                  {item.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : item.status === 'current' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{item.step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    item.status === 'completed' ? 'text-green-300' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm">{item.description}</p>
                </div>
                {item.status === 'current' && (
                  <div className="text-upnd-yellow">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-upnd-yellow" />
              Important Reminders
            </h3>
            <ul className="space-y-3 text-white/90 text-sm">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                UPND membership is completely FREE - never pay anyone for membership
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                Keep your membership ID safe for future reference
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                You will receive updates on your application status via phone/email
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                Once approved, you can collect your membership card from your local branch
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            <div className="space-y-3 text-white/90 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-upnd-yellow" />
                <span>+260 211 123 456</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-upnd-yellow" />
                <span>membership@upnd.zm</span>
              </div>
              <p className="mt-4 text-xs text-white/70">
                For any questions about your application or UPND membership, please contact us using the above information.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-upnd-red px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            <span>Return to Home</span>
          </Link>
          
          <p className="text-white/80 text-sm mt-6">
            Thank you for choosing to be part of Zambia's progressive movement for Unity, Work, and Progress!
          </p>
        </div>
      </div>
    </div>
  );
}