import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const faqs = [
  {
    question: "What is KESI?",
    answer: "KESI is an immersive virtual courtroom platform designed to help legal professionals and students practice and master courtroom skills through realistic simulations and AI-powered feedback."
  },
  {
    question: "Who can use KESI?",
    answer: "KESI is ideal for law students, educators, and legal professionals seeking to improve their advocacy, argumentation, and courtroom presence."
  },
  {
    question: "Do I need prior legal experience?",
    answer: "No prior experience is required. KESI offers learning modes for all levels, from beginners to advanced practitioners."
  },
  {
    question: "Is KESI available internationally?",
    answer: "Yes, KESI is accessible worldwide and features global legal scenarios."
  },
];

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Check if we should show the prompt based on session
  const shouldShowPrompt = () => {
    const lastPromptTime = localStorage.getItem('lastPromptTime');
    const promptDismissed = localStorage.getItem('promptDismissed');
    
    if (!lastPromptTime) return true;
    
    // Show prompt again after 24 hours
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const timeSinceLastPrompt = Date.now() - parseInt(lastPromptTime);
    
    return timeSinceLastPrompt > ONE_DAY && !promptDismissed;
  };

  // Save prompt interaction to localStorage
  const savePromptInteraction = (action) => {
    localStorage.setItem('lastPromptTime', Date.now().toString());
    if (action === 'dismiss') {
      localStorage.setItem('promptDismissed', 'true');
    }
  };

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed');
      setIsInstallable(false);
      return;
    }

    // For iOS devices
    if (isIOSDevice) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
      if (!isInStandaloneMode && shouldShowPrompt()) {
        console.log('iOS device detected, showing install prompt');
        setIsInstallable(true);
        setShowInstall(true);
      }
      return;
    }

    // For Android/other devices
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      console.log('Device supports PWA installation');
      setIsInstallable(true);
    }

    const handler = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShowPrompt()) {
        setShowInstall(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('App was installed');
      setShowInstall(false);
      setIsInstallable(false);
      // Clear prompt history when app is installed
      localStorage.removeItem('lastPromptTime');
      localStorage.removeItem('promptDismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions
      alert('To install KESI on your iPhone:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install');
      savePromptInteraction('install');
      return;
    }

    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    console.log('Showing install prompt');
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      savePromptInteraction('install');
    } else {
      savePromptInteraction('dismiss');
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleDismiss = () => {
    setShowInstall(false);
    savePromptInteraction('dismiss');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {isInstallable && showInstall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isIOS ? 'Add KESI to Home Screen' : 'Install KESI App'}
                </h3>
                <button 
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <img src="/icons/icon.png" alt="KESI" className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-gray-600 mb-1">
                    {isIOS 
                      ? 'Add KESI to your home screen for quick access'
                      : 'Get a better experience with our app!'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isIOS 
                      ? 'Access KESI faster and work offline'
                      : 'Access KESI faster and work offline'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleInstallClick}
                  className="w-full bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isIOS ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add to Home Screen
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Install App
                    </>
                  )}
                </button>
                <button 
                  onClick={handleDismiss}
                  className="w-full text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-sm z-50 shadow-md sticky top-0">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="text-2xl font-extrabold text-blue-700 tracking-tight">KESI</div>
          <div className="space-x-0 sm:space-x-4 flex flex-col sm:flex-row gap-2 sm:gap-0 w-full sm:w-auto items-center">
            <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium transition w-full sm:w-auto text-center">Login</Link>
            <Link to="/signup" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 shadow transition font-semibold w-full sm:w-auto text-center">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-10 md:py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/steptodown.com611962.jpg" 
            alt="Courtroom Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
        </div>
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Master Legal Practice in a
            <span className="block text-blue-200">Virtual Courtroom</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Experience realistic legal simulations, practice courtroom skills, and advance your legal career with KESI's immersive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link to="/signup" className="bg-white text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 shadow-lg transition w-full sm:w-auto">Start Learning</Link>
            <a href="#about" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition w-full sm:w-auto">Learn More</a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About KESI</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            KESI is a next-generation legal education platform that bridges the gap between theory and practice. Our mission is to empower legal professionals and students with hands-on experience in a safe, virtual environment. Whether you're preparing for moot court, sharpening your litigation skills, or exploring international law, KESI provides the tools and feedback you need to succeed.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
            <div className="flex-1 bg-blue-50 rounded-xl p-6 shadow text-left">
              <h3 className="font-semibold text-blue-700 mb-2">Realistic Courtroom Simulations</h3>
              <p className="text-gray-600">Step into virtual courtrooms modeled after real-world settings, complete with judges, juries, and opposing counsel.</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-6 shadow text-left">
              <h3 className="font-semibold text-blue-700 mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600">Receive instant, actionable feedback on your arguments, objections, and courtroom demeanor from our advanced AI system.</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-6 shadow text-left">
              <h3 className="font-semibold text-blue-700 mb-2">Global Community</h3>
              <p className="text-gray-600">Connect, compete, and collaborate with peers and mentors from around the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-12 md:py-16 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="text-4xl text-blue-700 mb-4">📝</div>
              <h3 className="font-semibold text-lg mb-2">Sign Up & Choose Your Path</h3>
              <p className="text-gray-600">Create your account and select your learning mode: solo practice, case library, or multiplayer simulation.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="text-4xl text-blue-700 mb-4">🎮</div>
              <h3 className="font-semibold text-lg mb-2">Engage in Simulations</h3>
              <p className="text-gray-600">Participate in realistic legal scenarios, present arguments, and interact with AI or real participants.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="text-4xl text-blue-700 mb-4">📈</div>
              <h3 className="font-semibold text-lg mb-2">Get Feedback & Improve</h3>
              <p className="text-gray-600">Receive detailed feedback, track your progress, and unlock new challenges as you grow.</p>
          </div>
        </div>
      </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose KESI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-blue-50 shadow-lg hover:shadow-2xl transition-shadow border border-blue-100 flex flex-col items-center text-center">
                <div className="text-blue-700 text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Modes Section */}
      <section className="bg-gray-50 py-16 md:py-20 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Learning Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningModes.map((mode, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-blue-700 text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{mode.title}</h3>
                  <p className="text-gray-600 mb-4">{mode.description}</p>
                  <ul className="space-y-2 text-left">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-700 text-white py-16 md:py-20 border-t border-blue-800">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow flex flex-col items-center text-center border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl text-blue-700 font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 md:py-16 border-t border-gray-100">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-blue-700 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
        </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-16 md:py-20 border-t border-blue-900">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Legal Practice?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals and students who are already using KESI to enhance their courtroom skills.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-white text-blue-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-100 shadow transition">Join KESI Today</Link>
            <a href="#features" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition">Learn More</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} KESI. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="mailto:info@kesi.com" className="hover:text-blue-700">Contact</a>
            <a href="#" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="hover:text-blue-700">Terms of Service</a>
        </div>
      </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: "🎓",
    title: "Realistic Simulations",
    description: "Practice in virtual courtrooms with AI-powered scenarios and real-time feedback."
  },
  {
    icon: "🤖",
    title: "AI-Powered Learning",
    description: "Get personalized feedback and guidance from our advanced AI system."
  },
  {
    icon: "🌐",
    title: "Global Community",
    description: "Connect with legal professionals and students from around the world."
  }
];

const learningModes = [
  {
    icon: "🏛️",
    title: "Virtual Moot Courtrooms",
    description: "Experience realistic courtroom environments with customizable settings.",
    features: [
      "High Court & Supreme Court simulations",
      "International tribunal settings",
      "Voice & text-based arguments",
      "Real-time objection handling"
    ]
  },
  {
    icon: "📚",
    title: "Case Library",
    description: "Access a vast collection of AI-generated and historical cases.",
    features: [
      "Dynamic case generation",
      "Historical case reenactments",
      "Interactive evidence examination",
      "Real-time legal document drafting"
    ]
  },
  {
    icon: "👥",
    title: "Multiplayer Mode",
    description: "Practice with peers in real-time courtroom simulations.",
    features: [
      "Live trial participation",
      "Role-based assignments",
      "Jury deliberation rooms",
      "Performance tracking"
    ]
  }
];

const stats = [
  {
    value: "1,200+",
    label: "Active Users"
  },
  {
    value: "5,000+",
    label: "Cases Generated"
  },
  {
    value: "1,200",
    label: "Historical Cases"
  },
  {
    value: "24/7",
    label: "AI Support"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Law Student",
    content: "KESI has transformed how I prepare for moot court competitions. The AI feedback is incredibly detailed and helpful."
  },
  {
    name: "Michael Chen",
    role: "Junior Associate",
    content: "The virtual courtroom experience is remarkably realistic. It's helped me build confidence in my courtroom presence."
  },
  {
    name: "Prof. David Williams",
    role: "Law Professor",
    content: "As an educator, I appreciate how KESI makes legal education more accessible and engaging for students."
  }
];

export default LandingPage; 