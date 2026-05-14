import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Users, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for students and personal use.',
    icon: <Zap size={20} />,
    features: [
      'Up to 5 chat rooms',
      'Real-time text messaging',
      'Up to 10 friends',
      'Basic voice rooms (2 users)',
      'Community support',
    ],
    cta: 'Get Started Free',
    popular: false,
    accent: 'from-neutral-800 to-neutral-900',
  },
  {
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    description: 'For power users and growing communities.',
    icon: <Star size={20} />,
    features: [
      'Unlimited chat rooms',
      'HD voice & priority audio',
      'Up to 500 friends',
      'Voice rooms (25 users)',
      'Custom room themes',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    accent: 'from-white to-neutral-100',
  },
  {
    name: 'Team',
    price: { monthly: 24, yearly: 19 },
    description: 'Built for teams, classrooms, and organisations.',
    icon: <Users size={20} />,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Admin dashboard',
      'Voice rooms (100 users)',
      'SSO & role management',
      'Custom domain',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
    accent: 'from-neutral-800 to-neutral-900',
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-32 relative bg-black text-white overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-white/4 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-900/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-neutral-300 mb-6 bg-white/5 backdrop-blur-sm"
          >
            <Shield size={14} className="text-white" />
            Simple, Transparent Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-5 tracking-tight font-display"
          >
            Choose your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">
              plan
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            Start free. Scale when you're ready. No hidden fees.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-4 glass px-4 py-2 rounded-full border border-white/10"
          >
            <span className={`text-sm font-medium transition-colors ${!yearly ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative flex items-center ${yearly ? 'bg-white' : 'bg-white/20'}`}
            >
              <span className={`w-4 h-4 bg-black rounded-full absolute transition-all duration-300 ${yearly ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${yearly ? 'text-white' : 'text-neutral-500'}`}>
              Yearly
              <span className="ml-2 text-xs bg-white text-black px-2 py-0.5 rounded-full font-semibold">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative flex flex-col rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                plan.popular
                  ? 'pricing-card-popular bg-white text-black shadow-[0_0_60px_rgba(255,255,255,0.15)]'
                  : 'glass border border-white/10 hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.07)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/10 whitespace-nowrap">
                  ✦ Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
                  {plan.icon}
                </div>
                <h3 className={`text-xl font-bold font-display ${plan.popular ? 'text-black' : 'text-white'}`}>{plan.name}</h3>
              </div>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-neutral-600' : 'text-neutral-400'}`}>{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className={`text-5xl font-black font-display ${plan.popular ? 'text-black' : 'text-white'}`}>
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className={`text-sm mb-2 ${plan.popular ? 'text-neutral-500' : 'text-neutral-500'}`}>/mo</span>
                  )}
                </div>
                {plan.price.monthly === 0 && (
                  <span className={`text-sm ${plan.popular ? 'text-neutral-500' : 'text-neutral-500'}`}>Free forever</span>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-black' : 'text-white'}`} />
                    <span className={plan.popular ? 'text-neutral-700' : 'text-neutral-300'}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate('/register')}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                  plan.popular
                    ? 'bg-black text-white hover:bg-neutral-800 shadow-lg'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-neutral-600 text-sm mt-10"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
