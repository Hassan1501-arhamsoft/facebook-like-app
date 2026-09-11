import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [particles, setParticles] = useState([]);

  // Generate random particles for the background
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050511] overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Custom Keyframes embedded for out-of-the-box extreme animations */}
      <style>
        {`
          @keyframes floatY {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }
          @keyframes glitch {
            0% { text-shadow: 4px 4px 0px #ff00ea, -4px -4px 0px #00ffff; }
            25% { text-shadow: -4px 4px 0px #ff00ea, 4px -4px 0px #00ffff; }
            50% { text-shadow: 4px -4px 0px #ff00ea, -4px 4px 0px #00ffff; }
            75% { text-shadow: -4px -4px 0px #ff00ea, 4px 4px 0px #00ffff; }
            100% { text-shadow: 4px 4px 0px #ff00ea, -4px -4px 0px #00ffff; }
          }
          @keyframes moveBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float-fast { animation: floatY 3s ease-in-out infinite; }
          .animate-glitch { animation: glitch 0.3s ease-in-out infinite alternate; }
          .bg-animated-gradient {
            background: linear-gradient(-45deg, #4f46e5, #c026d3, #db2777, #2563eb);
            background-size: 400% 400%;
            animation: moveBackground 8s ease infinite;
          }
        `}
      </style>

      {/* Heavy Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-[spin_10s_linear_infinite]"></div>
      </div>

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white opacity-40 mix-blend-screen"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `floatY ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        
        {/* Animated Picture / Graphic */}
        <div className="relative mb-8 animate-float-fast group cursor-not-allowed">
          <div className="absolute inset-0 bg-animated-gradient rounded-full blur-2xl opacity-70 group-hover:scale-125 transition-transform duration-500"></div>
          <img
  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png"
  alt="Lost in Space"
  className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-[0_0_40px_rgba(0,255,255,0.4)] group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500 animate-pulse"
/>
        </div>

        {/* 404 Glitch Text */}
        <h1 className="text-[120px] sm:text-[180px] font-black text-transparent bg-clip-text bg-white leading-none tracking-tighter mb-2 animate-glitch opacity-90">
          404
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 tracking-wide drop-shadow-lg">
          Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 animate-pulse">Void</span>
        </h2>
        
        <p className="text-gray-300 text-sm sm:text-base max-w-md mb-10 font-medium">
          The page you are looking for has vanished into deep space. Let's get you back to familiar territory.
        </p>

        {/* Action Button */}
        <Link 
          to="/dashboard"
          className="relative inline-flex group items-center justify-center"
        >
          {/* Button Outer Glow */}
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-animated-gradient rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          
          <button className="relative inline-flex items-center gap-3 px-8 py-4 bg-[#0a0a1a] border border-white/10 rounded-full text-white font-bold text-lg transition-all duration-300 group-hover:scale-105 overflow-hidden">
            
            {/* Inner moving light sweep */}
            <span className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[moveBackground_1.5s_ease-in-out_infinite]"></span>
            
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
}