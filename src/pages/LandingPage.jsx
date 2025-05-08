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

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
      return;
    }

    // Check if the browser supports PWA installation
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      setIsInstallable(true);
    }

    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setShowInstall(false);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {isInstallable && showInstall && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 animate-fadeIn max-w-[90%] sm:max-w-md">
          <div className="flex-1">
            <span className="font-semibold block mb-1">Install KESI App</span>
            <span className="text-sm text-blue-100">Get a better experience with our app!</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition whitespace-nowrap" 
              onClick={handleInstallClick}
            >
              Install
            </button>
            <button 
              className="text-white text-2xl hover:text-blue-200" 
              onClick={() => setShowInstall(false)}
            >
              ×
            </button>
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
      <section className="flex-1 flex items-center justify-center py-10 md:py-24">
        <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Master Legal Practice in a
            <span className="block text-blue-700">Virtual Courtroom</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience realistic legal simulations, practice courtroom skills, and advance your legal career with KESI's immersive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link to="/signup" className="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 shadow transition w-full sm:w-auto">Start Learning</Link>
            <a href="#about" className="border-2 border-blue-700 text-blue-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition w-full sm:w-auto">Learn More</a>
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
    value: "10,000+",
    label: "Active Users"
  },
  {
    value: "50,000+",
    label: "Cases Completed"
  },
  {
    value: "95%",
    label: "User Satisfaction"
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