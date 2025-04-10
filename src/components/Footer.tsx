
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-mindcleanse-500 mr-2"></div>
              <span className="text-lg font-semibold text-mindcleanse-700">MindCleanse</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Digital detox for better wellbeing</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            <a href="#" className="text-sm text-mindcleanse-600 hover:text-mindcleanse-800">About</a>
            <a href="#" className="text-sm text-mindcleanse-600 hover:text-mindcleanse-800">Privacy</a>
            <a href="#" className="text-sm text-mindcleanse-600 hover:text-mindcleanse-800">Terms</a>
            <a href="#" className="text-sm text-mindcleanse-600 hover:text-mindcleanse-800">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> by MindCleanse Team
          </p>
          <p className="mt-1">© {new Date().getFullYear()} MindCleanse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
