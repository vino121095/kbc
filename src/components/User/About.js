import React from "react";
import { Rocket, Lightbulb, HandHeart } from 'lucide-react';
import Header from "./Header";
import Footer from "./Footer";
import MobileFooter from './MobileFooter';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0 font-['Roboto','Helvetica','Arial',sans-serif]">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-10 sm:py-14 md:py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
          About KBC Directory
        </h1>
        <p className="text-base sm:text-lg md:text-xl opacity-90 font-normal">
          Connecting communities with trusted local businesses since 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Breadcrumbs */}
        <div className="mb-6 sm:mb-8 text-xs sm:text-sm text-gray-600">
          <span className="underline cursor-pointer">Home</span> &gt; About
        </div>

        {/* Our Story & Mission Section */}
        <div className="grid gap-12 md:grid-cols-2 mb-16">
          {/* Our Story */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our Story
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              KBC Directory was born from a simple idea: every local business
              deserves a chance to be discovered by their community.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              Founded in 2018, we started as a small team of local business
              enthusiasts who believed that supporting local commerce was
              essential for thriving communities.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
              Today, we're proud to serve over 5,000 local businesses and connect
              them with more than 50,000 customers each month. Our platform
              continues to evolve, but our mission remains.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3 font-medium transition transform hover:-translate-y-0.5 w-full sm:w-auto text-sm sm:text-base">
              Learn More
            </button>
          </div>

          {/* Mission & Vision */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Our Mission & Vision
            </h2>

            {/* Mission */}
            <div className="flex items-start mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-4 mt-1">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Mission
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To empower local businesses with the tools and visibility they
                  need to thrive in their communities.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="flex items-start mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-4 mt-1">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Vision</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To be the preferred local economies where businesses and
                  communities grow together through meaningful connections.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-4 mt-1">
                <HandHeart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Values</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Community first, transparency, innovation, and exceptional
                  service for everyone we serve.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Team */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Meet Our Team
          </h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* John Davis */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-green-600 mx-auto mb-4">
                JD
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">John Davis</h3>
              <p className="text-xs sm:text-sm text-green-600 font-medium mb-3">
                Founder & CEO
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                Passionate about connecting communities for 10+ years in local
                business development.
              </p>
            </div>

            {/* Sarah Martinez */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-blue-500 mx-auto mb-4">
                SM
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Sarah Martinez</h3>
              <p className="text-xs sm:text-sm text-blue-500 font-medium mb-3">
                Head of Technology
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                Leading our platform innovation with expertise in modern web
                technologies.
              </p>
            </div>

            {/* Mike Roberts */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-orange-500 mx-auto mb-4">
                MR
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Mike Roberts</h3>
              <p className="text-xs sm:text-sm text-orange-500 font-medium mb-3">
                Business Relations
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                Building relationships with local businesses and ensuring their
                success.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-6 sm:p-8 mb-16 shadow-xl">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">5K+</h3>
              <p className="text-xs sm:text-sm opacity-90">Active Businesses</p>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">50K+</h3>
              <p className="text-xs sm:text-sm opacity-90">Monthly Users</p>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">25K+</h3>
              <p className="text-xs sm:text-sm opacity-90">Reviews Posted</p>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">6</h3>
              <p className="text-xs sm:text-sm opacity-90">Years of Service</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Ready to Join Our Community?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8">
            List your business today and start connecting with local customers
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 sm:px-10 py-2.5 sm:py-3 font-medium transition transform hover:-translate-y-0.5 min-w-[200px] w-full sm:w-auto text-sm sm:text-base">
              Get Started
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-full px-8 sm:px-10 py-2.5 sm:py-3 font-medium transition min-w-[200px] w-full sm:w-auto text-sm sm:text-base">
              Contact Us
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <MobileFooter />
    </div>
  );
};

export default About;