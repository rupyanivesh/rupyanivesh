import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=918889998057&text=${encodeURIComponent('Hi, I want to know about your services.')}&type=phone_number&app_absent=0`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden" />
        
        <MessageCircle size={30} fill="currentColor" strokeWidth={0} />
        
        {/* Tooltip-like label on hover */}
        <span className="absolute left-full ml-4 px-4 py-2 bg-navy-900 text-white text-xs font-bold whitespace-nowrap rounded-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
          Chat with us
        </span>
      </a>
    </motion.div>
  );
};

export default WhatsAppButton;
