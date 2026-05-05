import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mic, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  PhoneOff,
  Search,
  Hash
} from 'lucide-react';
import './App.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ConnectHub Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <span className="text-xl font-bold tracking-tight">ConnectHub</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Log In</button>
          <button className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full glass border-t border-white/10 flex flex-col p-6 gap-4 md:hidden"
        >
          <a href="#features" className="text-neutral-300 hover:text-white">Features</a>
          <a href="#how-it-works" className="text-neutral-300 hover:text-white">How it Works</a>
          <a href="#community" className="text-neutral-300 hover:text-white">Community</a>
          <hr className="border-white/10 my-2" />
          <button className="text-left text-neutral-300 hover:text-white">Log In</button>
          <button className="px-5 py-3 rounded-lg bg-white text-black font-semibold mt-2">
            Get Started
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10 glow-effect">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-neutral-300 mb-8 border border-white/10"
        >
          <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
          ConnectHub 1.0 is now live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 100 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-300 to-neutral-600 animate-gradient bg-[length:200%_auto]"
        >
          Where Communities <br className="hidden md:block" />
          Come Alive
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10"
        >
          The lightweight, real-time platform for students and teams. Create topic-based chat rooms, jump into voice channels, and collaborate instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group">
            Start Communicating
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all">
            View Live Demo
          </button>
        </motion.div>
      </div>

      {/* App Interface Mockup Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-6xl mx-auto mt-20 px-6 relative z-10"
      >
        <div className="w-full aspect-[4/3] md:aspect-[16/10] bg-[#050505] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
          
          {/* Top Nav */}
          <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-[#0a0a0a] flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ConnectHub Logo" className="w-6 h-6 object-contain" />
              <span className="text-sm font-bold hidden sm:block">ConnectHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><Globe size={14}/> Posts</span>
              <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><Users size={14}/> Friends</span>
              <span className="flex items-center gap-2 text-white bg-white/10 px-3 py-1.5 rounded-md"><Hash size={14}/> Chat Rooms</span>
              <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-neutral-600 to-neutral-400 flex items-center justify-center overflow-hidden border border-white/10">
                  <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-full h-full object-cover" />
                </div> 
                Profile
              </span>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between bg-[#0a0a0a] flex-shrink-0">
            <div className="flex items-center gap-2 w-1/2 md:w-1/3">
               <div className="bg-[#111] border border-white/10 rounded-md px-3 py-2 flex items-center gap-2 w-full">
                 <Search size={14} className="text-neutral-500" />
                 <span className="text-neutral-500 text-xs">Search chat rooms...</span>
               </div>
            </div>
            <button className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1 hover:bg-neutral-200 transition-colors">
               + Create Room
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 border-r border-white/10 flex flex-col bg-[#050505] hidden md:flex">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold mb-3">Chat Rooms</h3>
                <p className="text-[10px] text-neutral-500 mb-3">6 rooms available</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="bg-white text-black px-3 py-1.5 rounded font-medium">All</span>
                  <span className="border border-white/10 text-neutral-400 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-white/5 cursor-pointer"><MessageSquare size={10}/> Text</span>
                  <span className="border border-white/10 text-neutral-400 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-white/5 cursor-pointer"><Mic size={10}/> Voice</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-2 custom-scrollbar">
                {/* Room Item 1 */}
                <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2"><MessageSquare size={14} className="text-neutral-400"/> Web Development</span>
                    <span className="text-[9px] border border-white/10 px-1.5 py-0.5 rounded text-neutral-400">Text Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3 mt-1 leading-relaxed">Discuss all things web dev - React, Vue, Angular, and more</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-600">
                    <span className="flex items-center gap-1"><Users size={10}/> 245 members</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>

                {/* Room Item 2 (Active) */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-lg"></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2 text-white"><Mic size={14} className="text-white"/> Gaming Voice Chat</span>
                    <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-medium">Voice Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mb-3 mt-1 leading-relaxed">Voice chat for gamers - drop in and chat while playing</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Users size={10}/> 47 members</span>
                    <span>5 weeks ago</span>
                  </div>
                </div>
                
                {/* Room Item 3 */}
                <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2"><MessageSquare size={14} className="text-neutral-400"/> Photography Lovers</span>
                    <span className="text-[9px] border border-white/10 px-1.5 py-0.5 rounded text-neutral-400">Text Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3 mt-1 leading-relaxed">Share your best shots and photography tips</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-600">
                    <span className="flex items-center gap-1"><Users size={10}/> 109 members</span>
                    <span>1 month ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content (Voice Room) */}
            <div className="flex-1 bg-[#0a0a0a] flex flex-col relative overflow-hidden">
               {/* Room Header */}
               <div className="p-6 border-b border-white/10 bg-[#0a0a0a] flex-shrink-0">
                 <h2 className="text-xl font-semibold flex items-center gap-2 mb-2"><Mic size={20} className="text-white"/> Gaming Voice Chat <span className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-neutral-400 ml-2 font-normal align-middle">Voice Chat</span></h2>
                 <p className="text-sm text-neutral-400 mb-3">Voice chat for gamers - drop in and chat while playing</p>
                 <div className="text-[11px] text-neutral-500 flex gap-6">
                   <span className="flex items-center gap-1"><Users size={12}/> 47 members</span>
                   <span>Created by Emma Davis</span>
                 </div>
               </div>

               {/* Voice Participants Area */}
               <div className="flex-1 flex items-center justify-center relative p-8">
                  {/* Avatar Grid / Circle */}
                  <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    
                    {/* Top User 1 */}
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-4 left-1/4 -translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full border border-neutral-700 bg-neutral-800 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=33" className="w-full h-full object-cover" alt="User 1" />
                         <div className="absolute bottom-0 right-0 w-4 h-4 bg-black rounded-full flex items-center justify-center p-[2px]">
                           <div className="w-full h-full rounded-full bg-green-500"></div>
                         </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-300">You</span>
                    </motion.div>

                    {/* Top User 2 */}
                    <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-800 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=12" className="w-full h-full object-cover" alt="User 1" />
                         <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center p-[2px]">
                           <div className="w-full h-full rounded-full bg-green-500"></div>
                         </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-300">User 1</span>
                    </motion.div>
                    
                    {/* Top User 3 */}
                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-12 right-1/4 translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-800 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=59" className="w-full h-full object-cover" alt="User 2" />
                         <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center p-[2px]">
                           <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
                         </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-300">User 2</span>
                    </motion.div>

                    {/* Top User 4 */}
                    <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-4 right-0 translate-x-1/2 flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full border border-neutral-700 bg-neutral-800 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=68" className="w-full h-full object-cover" alt="User 3" />
                         <div className="absolute bottom-0 right-0 w-4 h-4 bg-black rounded-full flex items-center justify-center p-[2px]">
                           <div className="w-full h-full rounded-full bg-green-500"></div>
                         </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-300">User 3</span>
                    </motion.div>

                    {/* Bottom User 5 */}
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-36 left-1/4 flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full border border-neutral-700 bg-neutral-800 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=47" className="w-full h-full object-cover grayscale" alt="User 4" />
                         <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center p-[2px]">
                           <div className="w-full h-full rounded-full bg-green-500"></div>
                         </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-300">User 4</span>
                    </motion.div>
                  </div>
               </div>
               
               {/* Voice Controls Bottom Bar */}
               <div className="absolute bottom-10 w-full flex flex-col items-center gap-4">
                 <div className="flex gap-6">
                   <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                     <Mic size={24} />
                   </button>
                   <button className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                     <PhoneOff size={24} />
                   </button>
                 </div>
                 <span className="text-xs text-neutral-400 font-medium tracking-wide">Click the phone icon to leave voice chat</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <MessageSquare size={24} />,
      title: 'Real-Time Messaging',
      description: 'Instant text communication via WebSocket. Build connections without the lag.'
    },
    {
      icon: <Mic size={24} />,
      title: 'Live Voice Rooms',
      description: 'Crystal clear voice channels powered by WebRTC. Jump in and start talking.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Topic-Based Rooms',
      description: 'Organize discussions by topics. From Web Dev to Gaming, find your niche.'
    },
    {
      icon: <Users size={24} />,
      title: 'Friend System',
      description: 'Send requests, manage connections, and build your personal network easily.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightweight & Fast',
      description: 'Built for speed. Low resource usage makes it perfect for any device.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure by Design',
      description: 'JWT authentication ensures your data and conversations stay protected.'
    }
  ];

  return (
    <section id="features" className="py-24 relative bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Everything you need. <br />
            <span className="text-neutral-500">Nothing you don't.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            ConnectHub strips away the clutter of modern platforms, giving you powerful tools designed purely for seamless communication.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 rounded-2xl glass transition-colors group cursor-pointer border border-white/5 hover:border-white/20 relative overflow-hidden shadow-lg hover:shadow-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Architecture = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-neutral-900/20"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Built on a solid foundation.</h2>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              ConnectHub utilizes a modern tech stack to deliver a scalable, robust, and lightning-fast experience. From a responsive frontend to a powerful real-time backend.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Frontend', desc: 'React, Vite, and Tailwind CSS for a beautiful, responsive UI.' },
                { title: 'Backend', desc: 'Java Spring Boot with Spring Security & JWT.' },
                { title: 'Real-time', desc: 'WebSocket with STOMP & WebRTC for voice.' },
                { title: 'Database', desc: 'MongoDB Atlas for flexible, cloud-hosted storage.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2.5 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-neutral-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          >
            <div className="glass p-8 rounded-3xl border border-white/10 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 rounded-3xl pointer-events-none"></div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-sm">React + Vite Frontend</span>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="w-0.5 h-6 bg-neutral-800 mx-auto"></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 text-center">
                    <span className="font-mono text-xs block mb-1">WebSocket</span>
                    <span className="text-xs text-neutral-500">Real-time Text</span>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 text-center">
                    <span className="font-mono text-xs block mb-1">WebRTC</span>
                    <span className="text-xs text-neutral-500">Voice Comm</span>
                  </div>
                </div>
                
                <div className="w-0.5 h-6 bg-neutral-800 mx-auto"></div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-between">
                  <span className="font-mono text-sm">Spring Boot Backend API</span>
                  <Shield size={16} className="text-neutral-500" />
                </div>
                
                <div className="w-0.5 h-6 bg-neutral-800 mx-auto"></div>
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 text-center">
                  <span className="font-mono text-sm block">MongoDB Atlas</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 rounded-[2rem] bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 text-center relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white relative z-10">Ready to build your community?</h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of students and teams already using ConnectHub to streamline their communication. Free to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Create an Account <ChevronRight size={18} />
            </button>
            <button className="px-8 py-4 rounded-full bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-colors">
              Explore Rooms
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="ConnectHub Logo" className="w-6 h-6 object-contain" />
              <span className="text-lg font-bold tracking-tight">ConnectHub</span>
            </div>
            <p className="text-neutral-500 text-sm">
              The modern, lightweight communication platform for learning and collaborating.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />
      <Hero />
      <Features />
      <Architecture />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
