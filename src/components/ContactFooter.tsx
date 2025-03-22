
import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

const ContactFooter: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-muted">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <a 
            href="mailto:jvalle@ovm-consulting.com" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail size={18} />
            <span>jvalle@ovm-consulting.com</span>
          </a>
          
          <a 
            href="https://wa.me/18295341802" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare size={18} />
            <span>+1 829 534 1802</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
