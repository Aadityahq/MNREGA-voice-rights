import React from 'react';

const GovtFooter = () => {
  return (
    <footer className="govt-footer mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">About MGNREGA</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The Mahatma Gandhi National Rural Employment Guarantee Act aims to enhance livelihood 
              security in rural areas by providing at least 100 days of guaranteed wage employment 
              per year to every household.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://nrega.nic.in" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-300 hover:text-white transition-colors">
                  📍 Official MGNREGA Portal
                </a>
              </li>
              <li>
                <a href="https://rural.nic.in" target="_blank" rel="noopener noreferrer"
                   className="text-gray-300 hover:text-white transition-colors">
                  ��️ Ministry of Rural Development
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer"
                   className="text-gray-300 hover:text-white transition-colors">
                  🇮🇳 National Portal of India
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">Contact Information</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📧 Email: support@mgnrega.gov.in</li>
              <li>📞 Toll-Free: 1800-XXX-XXXX</li>
              <li>🏢 Ministry of Rural Development</li>
              <li>📍 Krishi Bhawan, New Delhi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Government of India. All Rights Reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
              <span>|</span>
              <span>Version 1.0</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            Developed with ❤️ for Rural India | Data from Official MGNREGA API
          </div>
        </div>
      </div>

      <div className="bg-india-flag h-2"></div>
    </footer>
  );
};

export default GovtFooter;
