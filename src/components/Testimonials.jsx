import React from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sangeeta & Vivek Malhotra',
    role: 'Schoolteacher & Govt. Employee',
    city: 'Kanpur',
    quote: "When RupyaNivesh explained mutual funds to us, we were scared. They said 'start with ₹1,000 and see how it feels.' Three years later, our daughter's school fees are sorted for the next 5 years.",
    initials: 'SM'
  },
  {
    name: 'Rohit Sinha',
    role: 'Freelance Graphic Designer',
    city: 'Noida',
    quote: "My income is irregular. RupyaNivesh set up a structure that flexes with my income using regular SIPs and occasional top-ups. Finally, someone who understood non-fixed salaries.",
    initials: 'RS'
  },
  {
    name: 'Preethi Subramaniam',
    role: 'Paediatrician',
    city: 'Bengaluru',
    quote: "The free portfolio review was eye-opening. I had no idea 4 of my 7 funds basically invested in the same stocks. One clean-up later, my portfolio actually makes sense.",
    initials: 'PS'
  },
  {
    name: 'Mohammad Irfan',
    role: 'Business Owner',
    city: 'Moradabad',
    quote: "They explained everything in simple Hindi. He never made me feel like I needed to know 'finance' to invest well. Now my business cash flow is properly invested.",
    initials: 'MI'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-widest uppercase text-xs">Real Stories</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 mt-4 leading-tight">
            Trusted by 4,800+ <br /> Indian Families
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-gray-100 bg-[#FAF9F6] shadow-premium hover:shadow-premium-hover transition-all duration-300 relative"
            >
              <div className="flex items-center gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              
              <Quote className="absolute top-8 right-8 text-gray-200" size={40} />
              
              <p className="text-navy-900/80 text-sm leading-relaxed mb-8 italic relative z-10">
                "{item.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-200/50 pt-6">
                <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center font-serif font-bold text-gold text-sm shadow-lg">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-navy-900 text-sm">{item.name}</h4>
                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
                    {item.role} • {item.city}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
