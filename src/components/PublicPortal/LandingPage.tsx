'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  Heart, 
  Zap, 
  CheckCircle, 
  UserPlus, 
  FileText, 
  Award,
  ArrowRight,
  Star
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Democratic Governance',
      description: 'Committed to strengthening democratic institutions and good governance in Zambia'
    },
    {
      icon: Zap,
      title: 'Economic Development',
      description: 'Promoting sustainable economic growth and job creation for all Zambians'
    },
    {
      icon: Heart,
      title: 'Social Justice',
      description: 'Fighting for equality, human rights, and social justice for every citizen'
    },
    {
      icon: Users,
      title: 'National Unity',
      description: 'Bringing together all Zambians regardless of tribe, region, or background'
    }
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Complete Registration',
      description: 'Fill out your personal information and jurisdiction details'
    },
    {
      icon: FileText,
      title: 'Provide Documentation',
      description: 'Submit your NRC details and optional endorsements'
    },
    {
      icon: CheckCircle,
      title: 'Approval Process',
      description: 'Your application will be reviewed by party officials'
    },
    {
      icon: Award,
      title: 'Receive Membership',
      description: 'Get your official UPND membership card and join the movement'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-upnd-red via-upnd-red-dark to-upnd-yellow">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center p-2">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Logo_of_the_United_Party_for_National_Development.svg/400px-Logo_of_the_United_Party_for_National_Development.svg.png"
                    alt="UPND Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">UPND</h2>
                  <p className="text-white/90 text-sm">United Party for National Development</p>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join the Movement for
                <br />
                <span className="text-upnd-yellow">Unity, Work & Progress</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Be part of Zambia's progressive political movement dedicated to building a better future for all Zambians through democratic governance and inclusive development.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-upnd-red px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register Now - FREE</span>
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Login</span>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-upnd-yellow" />
                  <span>100% Free Membership</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-upnd-yellow" />
                  <span>7-14 Days Processing</span>
                </div>
              </div>
            </div>

            {/* Right Column - President Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img 
                    src="https://www.theigc.org/sites/default/files/styles/profile_image_2x/public/2022/10/His-Excellency-President-of-the-Republic-of-Zambia-Hichilema.webp"
                    alt="His Excellency President Hakainde Hichilema"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <h3 className="font-bold text-upnd-black text-lg">His Excellency</h3>
                  <p className="text-upnd-red font-semibold">Hakainde Hichilema</p>
                  <p className="text-gray-600 text-sm">President of the Republic of Zambia</p>
                  <p className="text-upnd-yellow text-xs font-medium mt-1">UPND Party President</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-upnd-black mb-4">
              Our Core Values & Commitments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The UPND is committed to building a prosperous, united, and democratic Zambia through our core principles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-upnd-red">
                  <div className="w-12 h-12 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-upnd-black mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-center">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unity, Work, Progress Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-upnd-black mb-4">Unity, Work, Progress</h2>
            <p className="text-xl text-gray-600">Our guiding principles for a better Zambia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-upnd-red to-upnd-red-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-upnd-red mb-4">Unity</h3>
              <p className="text-gray-600 leading-relaxed">
                Bringing together all Zambians regardless of tribe, region, religion, or background to build a cohesive nation where everyone belongs.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-upnd-yellow to-upnd-yellow-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-upnd-yellow mb-4">Work</h3>
              <p className="text-gray-600 leading-relaxed">
                Promoting hard work, entrepreneurship, and innovation as the foundation for sustainable economic development and prosperity for all.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-upnd-red mb-4">Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Advancing progressive policies and reforms that promote social justice, good governance, and inclusive development for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-upnd-black mb-4">How to Join UPND</h2>
            <p className="text-xl text-gray-600">Simple steps to become part of the movement</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-upnd-red to-upnd-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-upnd-yellow mb-2">Step {index + 1}</div>
                  <h3 className="text-lg font-bold text-upnd-black mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 text-upnd-yellow">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Information */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
              <div className="text-lg font-semibold text-green-800 mb-2">Membership</div>
              <div className="text-green-700 text-sm">No registration fees required</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">7-14</div>
              <div className="text-lg font-semibold text-blue-800 mb-2">Business Days</div>
              <div className="text-blue-700 text-sm">Typical approval timeline</div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-upnd-red/10 to-upnd-yellow/10 rounded-xl p-8 border border-upnd-red/20">
              <div className="text-4xl font-bold text-upnd-red mb-2">18+</div>
              <div className="text-lg font-semibold text-upnd-black mb-2">Age Requirement</div>
              <div className="text-gray-700 text-sm">Must be eligible to vote</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-upnd-red to-upnd-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the UPND Movement?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards being part of Zambia's progressive future. Register today and help us build a better tomorrow.
          </p>
          
          <Link
            href="/register"
            className="inline-flex items-center space-x-3 bg-white text-upnd-red px-10 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <UserPlus className="w-6 h-6" />
            <span>Start Your Registration</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          
          <p className="text-white/80 text-sm mt-6">
            Join thousands of Zambians committed to Unity, Work, and Progress
          </p>
        </div>
      </div>
    </div>
  );
}