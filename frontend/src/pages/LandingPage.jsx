import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Hash,
  Heart,
  Plus
} from 'lucide-react';

const Logo = ({ className = "w-14 h-14", color = "currentColor", innerColor = "transparent" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 18 50 C 18 15, 82 15, 82 50" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <rect x="8" y="45" width="14" height="26" rx="6" fill={color} />
      <rect x="78" y="45" width="14" height="26" rx="6" fill={color} />
      <path d="M 22 55 C 22 25, 78 25, 78 55 C 78 85, 45 85, 22 95 C 26 85, 27 75, 24 65 C 22.5 60, 22 58, 22 55 Z" fill={color} />
      <rect x="34" y="46" width="3" height="12" rx="1.5" fill={innerColor} />
      <rect x="41" y="40" width="3" height="24" rx="1.5" fill={innerColor} />
      <rect x="48" y="34" width="4" height="36" rx="2" fill={innerColor} />
      <rect x="56" y="40" width="3" height="24" rx="1.5" fill={innerColor} />
      <rect x="63" y="46" width="3" height="12" rx="1.5" fill={innerColor} />
      <circle cx="35.5" cy="72" r="3.5" fill={innerColor} />
      <circle cx="50" cy="72" r="3.5" fill={innerColor} />
      <circle cx="64.5" cy="72" r="3.5" fill={innerColor} />
    </svg>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={scrollToTop}>
          <Logo className="w-14 h-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform" color="white" innerColor="black" />
          <span className="text-2xl font-bold tracking-tight">ConnectHub</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
          >
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
          className="absolute top-full left-0 w-full glass border-t border-white/10 flex flex-col p-6 gap-4 md:hidden bg-black/90 backdrop-blur-lg"
        >
          <a href="#features" className="text-neutral-300 hover:text-white" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-neutral-300 hover:text-white" onClick={() => setIsOpen(false)}>How it Works</a>
          <a href="#community" className="text-neutral-300 hover:text-white" onClick={() => setIsOpen(false)}>Community</a>
          <hr className="border-white/10 my-2" />
          <button 
            onClick={() => { navigate('/login'); setIsOpen(false); }}
            className="text-left text-neutral-300 hover:text-white"
          >
            Log In
          </button>
          <button 
            onClick={() => { navigate('/register'); setIsOpen(false); }}
            className="px-5 py-3 rounded-lg bg-white text-black font-semibold mt-2"
          >
            Get Started
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen text-white">
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
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group"
          >
            Start Communicating
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/10 transition-all border border-white/10">
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
        <div className="w-full aspect-[4/3] md:aspect-[16/10] bg-white rounded-2xl border border-white/20 overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(255,255,255,0.1)] relative">
          
          {/* Top Nav */}
          <div className="h-14 border-b border-neutral-200 flex items-center px-6 justify-between bg-white flex-shrink-0 text-black">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" color="black" innerColor="white" />
              <span className="text-sm font-bold hidden sm:block">ConnectHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-xs text-neutral-600 font-medium">
              <span className="flex items-center gap-2 hover:text-black cursor-pointer transition-colors"><Globe size={14}/> Posts</span>
              <span className="flex items-center gap-2 hover:text-black cursor-pointer transition-colors"><Users size={14}/> Friends</span>
              <span className="flex items-center gap-2 text-white bg-black px-3 py-1.5 rounded-md"><Hash size={14}/> Chat Rooms</span>
              <span className="flex items-center gap-2 hover:text-black cursor-pointer transition-colors">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-neutral-200 to-neutral-300 flex items-center justify-center overflow-hidden border border-neutral-200">
                  <img src="https://i.pravatar.cc/150?img=47" alt="Profile" className="w-full h-full object-cover" />
                </div> 
                Profile
              </span>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="h-14 border-b border-neutral-200 flex items-center px-6 justify-between bg-neutral-50 flex-shrink-0">
            <div className="flex items-center gap-2 w-1/2 md:w-1/3">
               <div className="bg-white border border-neutral-200 rounded-md px-3 py-2 flex items-center gap-2 w-full">
                 <Search size={14} className="text-neutral-400" />
                 <span className="text-neutral-400 text-xs">Search chat rooms...</span>
               </div>
            </div>
            <button className="bg-black text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center gap-1 hover:bg-neutral-800 transition-colors">
               <Plus size={14} /> Create Room
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden bg-white text-black">
            {/* Sidebar */}
            <div className="w-72 border-r border-neutral-200 flex flex-col bg-white hidden md:flex">
              <div className="p-4 border-b border-neutral-200">
                <h3 className="text-sm font-semibold mb-3 text-black">Chat Rooms</h3>
                <p className="text-[10px] text-neutral-500 mb-3">6 rooms available</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="bg-black text-white px-3 py-1.5 rounded font-medium">All</span>
                  <span className="border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-50 cursor-pointer"><MessageSquare size={10}/> Text</span>
                  <span className="border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-50 cursor-pointer"><Mic size={10}/> Voice</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-2 custom-scrollbar">
                {/* Room Item 1 */}
                <div className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2 text-neutral-800"><MessageSquare size={14} className="text-neutral-400"/> Web Development</span>
                    <span className="text-[9px] border border-neutral-200 bg-white px-1.5 py-0.5 rounded text-neutral-500">Text Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3 mt-1 leading-relaxed">Discuss all things web dev - React, Vue, Angular, and more</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Users size={10}/> 245 members</span>
                    <span>2 weeks ago</span>
                  </div>
                </div>

                {/* Room Item 2 (Active) */}
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-lg"></div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2 text-black"><Mic size={14} className="text-black"/> Gaming Voice Chat</span>
                    <span className="text-[9px] bg-white border border-neutral-200 text-black px-1.5 py-0.5 rounded font-medium">Voice Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2 mb-3 mt-1 leading-relaxed">Voice chat for gamers - drop in and chat while playing</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1"><Users size={10}/> 47 members</span>
                    <span>5 weeks ago</span>
                  </div>
                </div>
                
                {/* Room Item 3 */}
                <div className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer border border-transparent transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold flex items-center gap-2 text-neutral-800"><MessageSquare size={14} className="text-neutral-400"/> Photography Lovers</span>
                    <span className="text-[9px] border border-neutral-200 bg-white px-1.5 py-0.5 rounded text-neutral-500">Text Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3 mt-1 leading-relaxed">Share your best shots and photography tips</p>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Users size={10}/> 109 members</span>
                    <span>1 month ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content (Voice Room) */}
            <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
               {/* Room Header */}
               <div className="p-6 border-b border-neutral-200 bg-white flex-shrink-0">
                 <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-black"><Mic size={20} className="text-black"/> Gaming Voice Chat <span className="text-[10px] border border-neutral-200 bg-neutral-50 px-2 py-0.5 rounded text-neutral-500 ml-2 font-normal align-middle">Voice Chat</span></h2>
                 <p className="text-sm text-neutral-500 mb-3">Voice chat for gamers - drop in and chat while playing</p>
                 <div className="text-[11px] text-neutral-400 flex gap-6">
                   <span className="flex items-center gap-1"><Users size={12}/> 47 members</span>
                   <span>Created by Emma Davis</span>
                 </div>
               </div>

               {/* Voice Participants Area */}
               <div className="flex-1 flex items-center justify-center relative p-8">
                  <div className="relative w-full max-w-md h-[300px] flex items-center justify-center">
                    
                    {/* User 1 */}
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="absolute top-[10%] left-[20%] flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full border-2 border-white shadow-lg bg-neutral-200 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=1" className="w-full h-full object-cover" alt="User 1" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                         <Mic size={10} className="text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded-full shadow-sm">User 1</span>
                    </motion.div>
                    
                    {/* User 2 */}
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[30%] right-[15%] flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg bg-neutral-200 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=12" className="w-full h-full object-cover" alt="User 2" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                         <Mic size={10} className="text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded-full shadow-sm">User 2</span>
                    </motion.div>

                    {/* You (Center) */}
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[40%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                      <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-neutral-200 relative overflow-hidden ring-4 ring-green-500/20">
                         <img src="https://i.pravatar.cc/150?img=33" className="w-full h-full object-cover" alt="You" />
                      </div>
                      <div className="absolute bottom-4 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                         <Mic size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-black bg-white px-3 py-1 rounded-full shadow-md border border-neutral-100">You</span>
                    </motion.div>

                    {/* User 3 */}
                    <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-[20%] left-[15%] flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg bg-neutral-200 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=4" className="w-full h-full object-cover" alt="User 3" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                         <Mic size={8} className="text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded-full shadow-sm">User 3</span>
                    </motion.div>

                    {/* User 4 */}
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[10%] right-[25%] flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full border-2 border-white shadow-lg bg-neutral-200 relative overflow-hidden">
                         <img src="https://i.pravatar.cc/150?img=8" className="w-full h-full object-cover" alt="User 4" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                         <Mic size={10} className="text-white" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded-full shadow-sm">User 4</span>
                    </motion.div>

                  </div>
               </div>
               
               <div className="absolute bottom-8 w-full flex flex-col items-center gap-3">
                 <div className="flex gap-4">
                   <button className="w-12 h-12 rounded-full bg-neutral-100 text-black border border-neutral-200 flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-sm">
                     <Mic size={20} />
                   </button>
                   <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm">
                     <PhoneOff size={20} />
                   </button>
                 </div>
                 <span className="text-[10px] text-neutral-400">Click the phone icon to leave voice chat</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });

  function onMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const xPct = (mouseXPos / width - 0.5) * 2;
    const yPct = (mouseYPos / height - 0.5) * 2;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-1, 1], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-1, 1], ["-10deg", "10deg"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ perspective: 1000 }}
      className="relative w-full h-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full p-8 rounded-2xl glass transition-colors group cursor-pointer border border-white/5 hover:border-white/20 relative overflow-hidden bg-white/5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
      >
        <div style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full relative z-10 pointer-events-none">
          <div 
            style={{ transform: "translateZ(40px)" }} 
            className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform shadow-lg border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] group-hover:bg-black group-hover:border-white/30"
          >
            {feature.icon}
          </div>
          <h3 style={{ transform: "translateZ(30px)" }} className="text-xl md:text-2xl font-bold mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all">{feature.title}</h3>
          <p style={{ transform: "translateZ(20px)" }} className="text-neutral-400 leading-relaxed">
            {feature.description}
          </p>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
      </motion.div>
    </motion.div>
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
    <section id="features" className="py-24 relative bg-neutral-950 text-white border-b border-white/5 overflow-hidden">
      {/* Dynamic background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-neutral-300 mb-6 bg-white/5 backdrop-blur-sm"
          >
            <Zap size={14} className="text-white" />
            Powerful Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Everything you need. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-white">Nothing you don't.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg md:text-xl"
          >
            ConnectHub strips away the clutter of modern platforms, giving you powerful tools designed purely for seamless communication.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Create Your Profile",
      desc: "Sign up in seconds. Set up your avatar, bio, and preferences to start connecting."
    },
    {
      num: "02",
      title: "Discover Rooms",
      desc: "Browse hundreds of topic-based rooms or use the search feature to find exactly what you're interested in."
    },
    {
      num: "03",
      title: "Jump In & Connect",
      desc: "Join a text channel or hop into a voice room instantly. Collaborate, discuss, and meet new people."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 relative bg-black text-white overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block -translate-y-1/2 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Seamlessly <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-white">Simple</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            Getting started with ConnectHub is frictionless. You'll be chatting with your community in under a minute.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-black border border-white/20 flex items-center justify-center text-2xl font-bold mb-8 group-hover:border-white transition-colors duration-500 relative z-10">
                {step.num}
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-neutral-400 leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Community = () => {
  return (
    <section id="community" className="py-32 relative bg-neutral-950 text-white overflow-hidden border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-neutral-300 mb-6 bg-white/5">
              <Heart size={14} className="text-white" />
              Loved by thousands
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              A growing network of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">creators and builders</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              ConnectHub isn't just a tool; it's a vibrant ecosystem. Join a thriving community of developers, designers, gamers, and students who are collaborating and sharing ideas every day.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-2 border-white/20 pl-4">
                <div className="text-3xl font-bold text-white mb-1">50k+</div>
                <div className="text-sm text-neutral-500">Active Users</div>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                <div className="text-sm text-neutral-500">Live Rooms</div>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-neutral-500">Uptime</div>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-neutral-500">Connections</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 sm:mt-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl glass hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full" alt="User" />
                    <div>
                      <div className="font-semibold text-sm">Alex M.</div>
                      <div className="text-xs text-neutral-500">Software Engineer</div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">"The voice rooms are incredibly stable. I use them daily with my remote team. Much better than anything else we've tried."</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl glass hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://i.pravatar.cc/150?img=5" className="w-10 h-10 rounded-full" alt="User" />
                    <div>
                      <div className="font-semibold text-sm">Sarah J.</div>
                      <div className="text-xs text-neutral-500">UI/UX Designer</div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">"ConnectHub is so clean and minimal. It gets out of the way and lets us just communicate."</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl glass hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://i.pravatar.cc/150?img=33" className="w-10 h-10 rounded-full" alt="User" />
                    <div>
                      <div className="font-semibold text-sm">David K.</div>
                      <div className="text-xs text-neutral-500">Student</div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">"Found an amazing study group here. The topic-based rooms are a game changer for university students."</p>
                </div>
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center text-center h-[200px] hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-3">
                    <Plus size={24} />
                  </div>
                  <div className="font-semibold">Join the Community</div>
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
  const navigate = useNavigate();
  return (
    <section className="py-24 relative bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-16 rounded-[2rem] bg-white text-black text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        >
          <Logo className="w-16 h-16 mx-auto mb-6 object-contain" color="black" innerColor="white" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to build your community?</h2>
          <p className="text-neutral-600 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of students and teams already using ConnectHub to streamline their communication. Free to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-full bg-black text-white font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
            >
              Create an Account <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-full bg-neutral-100 text-black font-semibold hover:bg-neutral-200 transition-colors border border-neutral-300">
              Explore Rooms
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-8 bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={scrollToTop}>
              <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" color="white" innerColor="black" />
              <span className="text-2xl font-bold tracking-tight">ConnectHub</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              The modern, lightweight communication platform for learning, gaming, and collaborating in real-time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all">
                <MessageSquare size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all">
                <Users size={18} />
              </a>
            </div>
          </div>
          
          <div className="lg:ml-auto">
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#features" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white hover:translate-x-1 inline-block transition-transform">How it Works</a></li>
              <li><a href="#community" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Community</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Pricing</a></li>
            </ul>
          </div>

          <div className="lg:ml-auto">
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Documentation</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Help Center</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">API Reference</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Blog</a></li>
            </ul>
          </div>

          <div className="lg:ml-auto">
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Careers</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none pointer-events-none mb-8"
          >
            CONNECTHUB
          </motion.h1>
          <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Community />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;