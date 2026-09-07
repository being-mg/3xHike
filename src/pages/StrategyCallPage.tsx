import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Check, 
  Settings, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  X, 
  ExternalLink,
  Sparkles,
  Lock
} from "lucide-react";
import CustomCursor from "../components/CustomCursor";

interface GoogleFormConfig {
  actionUrl: string;
  emailField: string;
  companyField: string;
  nameField: string;
  phoneField: string;
  budgetField: string;
  requirementsField: string;
}

const DEFAULT_CONFIG: GoogleFormConfig = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfluFl8liCPj0to8XuV-yzjoY3HVG1zPKIE_KOBZDY59EK_ww/formResponse",
  emailField: "emailAddress",
  companyField: "entry.1275522048",
  nameField: "entry.2022293646",
  phoneField: "entry.1234063774",
  budgetField: "entry.290146654",
  requirementsField: "entry.1920848482",
};

export default function StrategyCallPage() {
  const lenisRef = useRef<Lenis | null>(null);
  const hiddenIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [submittedSubmittedToIframe, setSubmittedToIframe] = useState(false);

  // Load user's Google Form config from localStorage or fallback
  const [formConfig, setFormConfig] = useState<GoogleFormConfig>(() => {
    const saved = localStorage.getItem("3xhike_gf_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it was still pointing to old placeholders or dummy entry IDs, upgrade to real IDs
        if (
          parsed.actionUrl?.includes("YOUR_FORM_ID") ||
          parsed.companyField === "entry.123456789" ||
          !parsed.companyField ||
          parsed.companyField.startsWith("entry.YOUR_")
        ) {
          return DEFAULT_CONFIG;
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch (e) {
        console.error("Failed to parse saved Google Form config", e);
      }
    }
    return DEFAULT_CONFIG;
  });

  const [editConfig, setEditConfig] = useState<GoogleFormConfig>(formConfig);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form field state (managed in React so we can also mirror to local SQLite/Sheets API)
  const [formValues, setFormValues] = useState({
    email: "",
    company: "",
    name: "",
    phone: "",
    budget: "",
    requirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      lenisRef.current?.destroy();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormValues({ ...formValues, [e.target.dataset.field || e.target.name]: e.target.value });
  };

  // Called when the custom form submits
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    setSubmittedToIframe(true);

    // If 'Collect email addresses' is not enabled in Google Form settings, Google ignores emailAddress.
    // Ensure the lead's email is guaranteed recorded in the Custom Requirement column in Google Sheets:
    try {
      const formEl = e.currentTarget;
      const reqEl = formEl.elements.namedItem(formConfig.requirementsField) as HTMLTextAreaElement | null;
      if (reqEl && formValues.email && !formConfig.emailField.startsWith("entry.")) {
        const emailTag = `\n[Email: ${formValues.email}]`;
        if (!reqEl.value.includes(formValues.email)) {
          reqEl.value = (reqEl.value ? reqEl.value.trim() : "") + emailTag;
        }
      }
    } catch (err) {
      console.warn("Requirement field attachment notice:", err);
    }

    // 1. Simultaneously mirror the lead to our local /api/leads endpoint
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name || formValues.company,
          email: formValues.email,
          phone: formValues.phone,
          budget: formValues.budget,
          requirement: `Company: ${formValues.company} | ${formValues.requirements}`,
        })
      });
    } catch (err) {
      console.warn("Local sync notice:", err);
    }

    // Fallback timer: in case cross-origin iframe load event is delayed or suppressed
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedToIframe(false);
    }, 1500);
  };

  // 2. Triggered the moment the hidden iframe finishes loading Google's response
  const handleIframeLoad = () => {
    if (submittedSubmittedToIframe) {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedToIframe(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    let action = editConfig.actionUrl.trim();
    
    // Automatically fix /viewform to /formResponse if user pasted viewform URL
    if (action.includes("docs.google.com/forms")) {
      action = action.replace(/\/viewform(\?.*)?$/, "/formResponse");
      action = action.replace(/\/edit(\?.*)?$/, "/formResponse");
      if (!action.endsWith("/formResponse")) {
        action = action.replace(/\/+$/, "") + "/formResponse";
      }
    }

    const updated = {
      ...editConfig,
      actionUrl: action,
    };

    setFormConfig(updated);
    localStorage.setItem("3xhike_gf_config", JSON.stringify(updated));
    setShowConfigModal(false);
  };

  const handleResetConfig = () => {
    setFormConfig(DEFAULT_CONFIG);
    setEditConfig(DEFAULT_CONFIG);
    localStorage.removeItem("3xhike_gf_config");
    setShowConfigModal(false);
  };

  return (
    <main className="relative bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#00e5ff] selection:text-black">
      <CustomCursor />
      
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-black/75 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-white text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity font-display">
          3x<span className="text-[#00e5ff]">Hike</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-white/80 hover:text-white text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/20 hover:border-[#00e5ff] transition-all"
          >
            Close
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container mx-auto px-4 md:px-10 pt-28 md:pt-36 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Editorial & Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-[45%] lg:sticky lg:top-36"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
              STRATEGY CALL
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.92] mb-6 font-display">
              build something <br />
              <span className="text-[#00e5ff] drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]">
                impossible
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-xl mb-8">
              Ready to scale? We're selecting ambitious brands ready to turn attention into measurable revenue. Tell us what you're building.
            </p>

            {/* Strategic Pillars */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e5ff] flex-shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hook & Creative Drop-Off Audit</h4>
                  <p className="text-xs sm:text-sm text-white/60">We evaluate your current creative assets and identify conversion bottlenecks in the first 3 seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e5ff] flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Direct-Response Scale Blueprint</h4>
                  <p className="text-xs sm:text-sm text-white/60">Structured paid media tactics customized for your specific acquisition targets and CPA thresholds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e5ff] flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Silent Google Form Pipeline</h4>
                  <p className="text-xs sm:text-sm text-white/60">Submissions pipe directly into your Google Form responses and Google Sheets without showing Google's UI.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: 100% Custom Dark HTML Form (No Google Form iframe UI!) */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-[55%]"
          >
            <div className="rounded-3xl border border-white/15 bg-neutral-950 p-7 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              
              {/* Subtle accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-80" />

              {isSubmitted ? (
                <motion.div 
                  id="success-confirmation-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-[#00e5ff] rounded-full mx-auto mb-8 flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 font-display">
                    Inquiry Received
                  </h2>
                  <p className="text-base md:text-lg text-white/70 max-w-md mx-auto mb-8 leading-relaxed">
                    Your request has been routed to our strategy team. We will review your brand's growth goals and reach out within 24 hours.
                  </p>
                  <button 
                    id="submit-another-inquiry-btn"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormValues({ email: "", company: "", name: "", phone: "", budget: "", requirements: "" });
                    }}
                    className="border border-white/30 text-white hover:bg-white hover:text-black px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2 font-display">
                      Direct Strategy Inquiry
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60">
                      Fill out your details below. This form connects natively with zero third-party branding or redirects.
                    </p>
                  </div>

                  {/* 
                    CUSTOM HTML FORM 
                    - Action points to /formResponse
                    - Target points to hidden_iframe so the user stays on the dark 3xHike site
                  */}
                  <form 
                    id="strategy-inquiry-form"
                    action={formConfig.actionUrl} 
                    method="POST" 
                    target="hidden_iframe" 
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Email Address <span className="text-[#00e5ff]">*</span>
                      </label>
                      <input 
                        type="email" 
                        name={formConfig.emailField}
                        data-field="email"
                        required 
                        value={formValues.email}
                        onChange={handleChange}
                        placeholder="you@brand.com"
                        className="bg-transparent border-b border-white/20 focus:border-[#00e5ff] pb-3 text-lg md:text-xl text-white placeholder:text-white/25 focus:outline-none transition-colors rounded-none px-0"
                      />
                    </div>

                    {/* Company Name Field */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Company / Brand Name
                      </label>
                      <input 
                        type="text" 
                        name={formConfig.companyField}
                        data-field="company"
                        required
                        value={formValues.company}
                        onChange={handleChange}
                        placeholder="Your company or brand"
                        className="bg-transparent border-b border-white/20 focus:border-[#00e5ff] pb-3 text-lg md:text-xl text-white placeholder:text-white/25 focus:outline-none transition-colors rounded-none px-0"
                      />
                    </div>

                    {/* Two column row: Your Name & Phone Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                          Your Name
                        </label>
                        <input 
                          type="text" 
                          name={formConfig.nameField}
                          data-field="name"
                          required
                          value={formValues.name}
                          onChange={handleChange}
                          placeholder="First and last name"
                          className="bg-transparent border-b border-white/20 focus:border-[#00e5ff] pb-3 text-lg md:text-xl text-white placeholder:text-white/25 focus:outline-none transition-colors rounded-none px-0"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                          Phone Number
                        </label>
                        <input 
                          type="tel" 
                          name={formConfig.phoneField}
                          data-field="phone"
                          required
                          value={formValues.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="bg-transparent border-b border-white/20 focus:border-[#00e5ff] pb-3 text-lg md:text-xl text-white placeholder:text-white/25 focus:outline-none transition-colors rounded-none px-0"
                        />
                      </div>
                    </div>

                    {/* Budget (Multiple Choice) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Budget
                      </label>
                      <select
                        name={formConfig.budgetField}
                        data-field="budget"
                        value={formValues.budget}
                        onChange={handleChange}
                        className="bg-black border-b border-white/20 focus:border-[#00e5ff] pb-3 text-lg text-white/90 focus:outline-none transition-colors rounded-none px-0 appearance-none cursor-pointer"
                      >
                        <option value="">Select an approximate range</option>
                        <option value="Less than 10,000 Rs.">Less than 10,000 Rs.</option>
                        <option value="10,000 Rs. - 50,000 Rs.">10,000 Rs. - 50,000 Rs.</option>
                        <option value="50,000 Rs.- 1,00,000 Rs.">50,000 Rs. - 1,00,000 Rs.</option>
                        <option value="Above 1,00,000 Rs.">Above 1,00,000 Rs.</option>
                      </select>
                    </div>

                    {/* Custom Requirement */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Custom Requirement
                      </label>
                      <textarea
                        name={formConfig.requirementsField}
                        data-field="requirements"
                        rows={3}
                        value={formValues.requirements}
                        onChange={handleChange}
                        placeholder="Tell us about your brand's growth hurdles, direct-response goals, or custom requirements..."
                        className="bg-transparent border-b border-white/20 focus:border-[#00e5ff] pb-3 text-base text-white placeholder:text-white/25 focus:outline-none transition-colors rounded-none px-0 resize-none pt-2"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto bg-[#00e5ff] text-black hover:bg-white hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] px-10 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider transition-all duration-300 ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "SUBMIT INQUIRY"}
                      </button>

                      <div className="text-[11px] text-white/40 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#00e5ff]" />
                        <span>Private & direct response. Zero spam.</span>
                      </div>
                    </div>

                  </form>
                </>
              )}

              {/* 
                THE INVISIBLE IFRAME
                Catches Google's response page so the user stays on the dark-themed 3xHike website
              */}
              <iframe 
                name="hidden_iframe" 
                id="hidden_iframe" 
                ref={hiddenIframeRef}
                onLoad={handleIframeLoad}
                style={{ display: "none" }}
                title="Google Form Silent Receiver"
              />

            </div>
          </motion.div>

        </div>
      </div>

      {/* Google Form Action URL & entry.XXXX Mapping Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-white/20 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowConfigModal(false)}
                className="absolute top-6 right-6 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display">
                    Google Form Field Mapping
                  </h3>
                  <p className="text-xs text-white/60">Route data silently to your Google Form via formResponse</p>
                </div>
              </div>

              {/* Step instructions */}
              <div className="mb-6 p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white/70 space-y-2">
                <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[#00e5ff]">
                  <HelpCircle className="w-4 h-4" /> Finding your entry codes with "Pre-filled Link":
                </p>
                <ol className="list-decimal list-inside space-y-1 text-white/60">
                  <li>In Google Forms editor, click the <strong>3 dots (&vellip;)</strong> in the top right &rarr; select <strong>Get pre-filled link</strong>.</li>
                  <li>Type dummy text into each field (e.g. "TestCo", "TestName", "99999") and pick a budget option.</li>
                  <li>Click <strong>Get link</strong> at the bottom, then copy the link.</li>
                  <li>In the link, look for <code className="text-[#00e5ff]">entry.XXXXX=...</code> to grab each question's ID and paste below.</li>
                </ol>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Google Form Action URL
                  </label>
                  <input
                    type="text"
                    required
                    value={editConfig.actionUrl}
                    onChange={(e) => setEditConfig({ ...editConfig, actionUrl: e.target.value })}
                    placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfluFl8liCPj0to8XuV-yzjoY3HVG1zPKIE_KOBZDY59EK_ww/formResponse"
                    className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00e5ff] font-mono"
                  />
                  <p className="text-[11px] text-white/40 mt-1">Must end in <code className="text-[#00e5ff]">/formResponse</code> (we automatically convert /viewform).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email Field Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editConfig.emailField}
                      onChange={(e) => setEditConfig({ ...editConfig, emailField: e.target.value })}
                      placeholder="emailAddress or entry.XXXXX"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                    <p className="text-[10px] text-white/40 mt-0.5">Use <code className="text-[#00e5ff]">emailAddress</code> if "Collect email" is enabled, or <code className="text-white">entry.XXXXX</code></p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Company Name Entry Code
                    </label>
                    <input
                      type="text"
                      required
                      value={editConfig.companyField}
                      onChange={(e) => setEditConfig({ ...editConfig, companyField: e.target.value })}
                      placeholder="entry.1275522048"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Your Name Entry Code
                    </label>
                    <input
                      type="text"
                      required
                      value={editConfig.nameField}
                      onChange={(e) => setEditConfig({ ...editConfig, nameField: e.target.value })}
                      placeholder="entry.2022293646"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Phone Number Entry Code
                    </label>
                    <input
                      type="text"
                      required
                      value={editConfig.phoneField}
                      onChange={(e) => setEditConfig({ ...editConfig, phoneField: e.target.value })}
                      placeholder="entry.1234063774"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Budget Entry Code
                    </label>
                    <input
                      type="text"
                      value={editConfig.budgetField}
                      onChange={(e) => setEditConfig({ ...editConfig, budgetField: e.target.value })}
                      placeholder="entry.290146654"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Custom Requirement Entry Code
                    </label>
                    <input
                      type="text"
                      value={editConfig.requirementsField}
                      onChange={(e) => setEditConfig({ ...editConfig, requirementsField: e.target.value })}
                      placeholder="entry.1920848482"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleResetConfig}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-400/10 transition-all mr-auto"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00e5ff] text-black hover:bg-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Save Mapping
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ambient glowing atmosphere */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#00e5ff]/10 rounded-full blur-[160px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] bg-[#2B38F1]/10 rounded-full blur-[160px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
    </main>
  );
}
