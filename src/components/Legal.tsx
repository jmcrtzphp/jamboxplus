import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function CookieBanner({ onOpenPreferences }: { onOpenPreferences: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('jambox_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('jambox_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem('jambox_cookie_consent', 'essential');
    setIsVisible(false);
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-24 sm:pb-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto bg-[#1A1D24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-3">Cookies on JamBox+</h2>
          <p className="text-sm text-white/70 mb-4 leading-relaxed">
            We use essential cookies to keep JamBox+ working securely. With your permission, we may also use optional cookies for analytics, personalization, and advertising.
            <br className="hidden sm:block" />
            You can accept all cookies, reject optional cookies, or customize your preferences.
          </p>
          <p className="text-xs text-white/50 mb-6">
            By selecting “Accept All,” you consent to the use of optional cookies as described in our Cookie Preferences. You can change your choices at any time.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleAcceptAll} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full text-sm transition-colors">
              Accept All
            </button>
            <button onClick={handleRejectOptional} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full text-sm transition-colors">
              Reject Optional
            </button>
            <button onClick={() => { onOpenPreferences(); setIsVisible(false); }} className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-white/80 font-medium rounded-full text-sm transition-colors">
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CookiePreferences({ onClose, onOpenPrivacy }: { onClose: () => void, onOpenPrivacy: () => void }) {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    personalization: false,
    advertising: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('jambox_cookie_consent');
    if (saved === 'all') {
      setPreferences({ essential: true, analytics: true, personalization: true, advertising: true });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('jambox_cookie_consent', 'custom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#14161B] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14161B] rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-white/80 space-y-6">
          <p>
            JamBox+ uses cookies and similar technologies to help operate, secure, and improve our website and streaming services.
            You can choose which categories of optional cookies you allow. <strong>Essential cookies cannot be disabled through this preference center because they are necessary for the website and its core functions to operate.</strong>
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-white">Essential Cookies — Always Active</h3>
                <div className="text-xs font-bold text-white/50 uppercase tracking-wider bg-black/40 px-2 py-1 rounded">Required</div>
              </div>
              <p className="text-xs text-white/60">These cookies are necessary for JamBox+ to function. They may be used for website functionality, account authentication, login sessions, security, fraud prevention, load balancing, maintaining sessions, and remembering privacy preferences.</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">Analytics Cookies — Optional</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={preferences.analytics} onChange={e => setPreferences(p => ({...p, analytics: e.target.checked}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <p className="text-xs text-white/60">Analytics cookies help us understand how visitors use JamBox+. They collect information such as pages visited, features used, approximate session duration, browser and device information.</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">Personalization Cookies — Optional</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={preferences.personalization} onChange={e => setPreferences(p => ({...p, personalization: e.target.checked}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <p className="text-xs text-white/60">These cookies may allow JamBox+ to remember preferences and personalize certain aspects of your experience.</p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-white">Advertising Cookies — Optional</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={preferences.advertising} onChange={e => setPreferences(p => ({...p, advertising: e.target.checked}))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
              <p className="text-xs text-white/60">If JamBox+ displays advertising, advertising cookies may be used to measure performance, limit repeated ads, and provide interest-based advertising.</p>
            </div>
          </div>
          
          <div className="text-xs text-white/50 pt-4 pb-2">
            For additional information about how JamBox+ collects and uses personal information, please review our <button onClick={onOpenPrivacy} className="text-amber-500 hover:underline inline">Privacy Policy</button>.
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-white/10 flex flex-wrap gap-3 justify-end bg-[#14161B] rounded-b-2xl">
          <button onClick={() => { localStorage.setItem('jambox_cookie_consent', 'essential'); onClose(); }} className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Reject Optional
          </button>
          <button onClick={() => { localStorage.setItem('jambox_cookie_consent', 'all'); onClose(); }} className="px-5 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
            Accept All
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-full transition-colors">
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#14161B] w-full max-w-4xl min-h-screen sm:min-h-[fit-content] sm:my-10 sm:rounded-2xl flex flex-col shadow-2xl relative">
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14161B]/95 backdrop-blur-md sm:rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Privacy Policy</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-10 text-white/80 space-y-6 text-sm sm:text-base leading-relaxed">
          <div className="mb-8">
            <p className="font-semibold">Effective Date: August 17, 2026</p>
            <p className="font-semibold mb-4">Last Updated: August 17, 2026</p>
            <p>Welcome to <strong>JamBox+</strong> (“JamBox+,” “we,” “us,” or “our”). This Privacy Policy explains how we collect, use, disclose, retain, and protect information when you access or use our website, services, applications, and related features (collectively, the “Services”).</p>
            <p className="mt-4">JamBox+ is accessible internationally. We respect the privacy of users around the world and seek to process personal information in accordance with applicable privacy and data-protection laws.</p>
            <p className="mt-4"><strong>Website:</strong> https://jamboxplusph.dpdns.org/</p>
          </div>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">1. Information We Collect</h3>
          <p>Depending on how you interact with JamBox+, we may collect information such as:</p>
          <h4 className="font-semibold text-white mt-4 mb-2">Information You Provide</h4>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Name or username;</li>
            <li>Email address;</li>
            <li>Account information;</li>
            <li>Login credentials;</li>
            <li>Profile information;</li>
            <li>Contact or support requests;</li>
            <li>Feedback, comments, or reports;</li>
            <li>Communications you send to us; and</li>
            <li>Other information you voluntarily provide.</li>
          </ul>
          <h4 className="font-semibold text-white mt-4 mb-2">Information Collected Automatically</h4>
          <p className="mb-2">When you access or use JamBox+, we and our service providers may automatically collect certain technical and usage information, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP address;</li>
            <li>Browser type;</li>
            <li>Operating system;</li>
            <li>Device type;</li>
            <li>Device identifiers;</li>
            <li>Approximate geographic location;</li>
            <li>Language and regional settings;</li>
            <li>Pages or content accessed;</li>
            <li>Search or navigation activity;</li>
            <li>Date and time of access;</li>
            <li>Referring and exit pages;</li>
            <li>Streaming and playback information;</li>
            <li>Network and connection information;</li>
            <li>Error and diagnostic information; and</li>
            <li>Other information necessary to operate and secure the Services.</li>
          </ul>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">2. Streaming and Usage Information</h3>
          <p className="mb-2">When you use JamBox+ to view or interact with content, we may process information relating to your use of the Services, including:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Content viewed or requested;</li>
            <li>Playback activity;</li>
            <li>Viewing duration;</li>
            <li>Playback errors;</li>
            <li>Device and browser information;</li>
            <li>Network information;</li>
            <li>General interaction with the Services; and</li>
            <li>Preferences or settings.</li>
          </ul>
          <p>We may use this information to operate the streaming service, maintain service quality, troubleshoot technical problems, improve performance, and prevent abuse.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">3. Cookies and Similar Technologies</h3>
          <p className="mb-2">JamBox+ may use cookies, local storage, pixels, SDKs, tags, and similar technologies. These technologies may be used for:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Essential website functionality;</li>
            <li>Authentication and session management;</li>
            <li>Security and fraud prevention;</li>
            <li>Remembering preferences;</li>
            <li>Analytics and performance measurement;</li>
            <li>Understanding how users interact with the Services;</li>
            <li>Personalization; and</li>
            <li>Advertising, where applicable.</li>
          </ul>
          <p>Where required by applicable law, we will request consent before using non-essential cookies or similar technologies. You may control cookies through your browser or device settings. Certain features may not function correctly if essential cookies are disabled.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">4. How We Use Personal Information</h3>
          <p className="mb-2">We may use personal information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and operate the Services;</li>
            <li>Deliver streaming and website functionality;</li>
            <li>Create and manage accounts;</li>
            <li>Authenticate users;</li>
            <li>Remember preferences;</li>
            <li>Provide customer support;</li>
            <li>Respond to inquiries;</li>
            <li>Maintain and improve the Services;</li>
            <li>Monitor performance and reliability;</li>
            <li>Diagnose technical problems;</li>
            <li>Detect and prevent fraud, abuse, unauthorized access, and security incidents;</li>
            <li>Protect our users, Services, and legal rights;</li>
            <li>Measure audience and service usage;</li>
            <li>Provide personalized features where permitted;</li>
            <li>Send service-related communications;</li>
            <li>Comply with legal obligations; and</li>
            <li>Perform other purposes disclosed when information is collected.</li>
          </ul>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">5. Legal Bases for Processing</h3>
          <p className="mb-2">Where privacy laws such as the European Union General Data Protection Regulation (“GDPR”) apply, we may process personal information based on:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Your consent;</li>
            <li>Performance of a contract or provision of a service;</li>
            <li>Compliance with a legal obligation;</li>
            <li>Legitimate interests, where those interests do not override your applicable rights;</li>
            <li>Protection of vital interests; or</li>
            <li>Another lawful basis permitted by applicable law.</li>
          </ul>
          <p>Where processing is based on consent, you may withdraw your consent subject to applicable legal limitations.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">6. International Privacy Rights</h3>
          <p className="mb-2">Depending on where you live, you may have rights concerning your personal information. These may include the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Know whether we process your personal information;</li>
            <li>Request access to personal information;</li>
            <li>Request correction of inaccurate information;</li>
            <li>Request deletion of personal information;</li>
            <li>Request restriction of certain processing;</li>
            <li>Object to certain processing;</li>
            <li>Withdraw consent where applicable;</li>
            <li>Request portability of certain information;</li>
            <li>Opt out of certain advertising or profiling;</li>
            <li>Opt out of the sale or sharing of personal information where applicable; and</li>
            <li>Lodge a complaint with an applicable privacy or data-protection authority.</li>
          </ul>
          <p>These rights may be subject to legal exceptions and limitations.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">7. European Economic Area, United Kingdom, and Switzerland</h3>
          <p>If you are located in the European Economic Area (“EEA”), United Kingdom, or Switzerland, additional privacy protections may apply. Where applicable, you may exercise rights provided by the GDPR, UK GDPR, or applicable Swiss privacy laws, including rights to access, correct, delete, restrict, transfer, or object to the processing of your personal information. You may also have the right to lodge a complaint with your local data-protection authority.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">8. California and Other U.S. State Privacy Rights</h3>
          <p className="mb-2">If you are a resident of a U.S. state with applicable privacy legislation, you may have additional rights concerning your personal information. Depending on applicable law, these may include:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>The right to know or access personal information;</li>
            <li>The right to correct inaccurate information;</li>
            <li>The right to delete personal information;</li>
            <li>The right to obtain information about personal information collected or disclosed;</li>
            <li>The right to opt out of certain targeted advertising;</li>
            <li>The right to opt out of the sale or sharing of personal information where applicable;</li>
            <li>The right to limit certain uses of sensitive personal information where applicable; and</li>
            <li>The right not to receive unlawful discriminatory treatment for exercising applicable privacy rights.</li>
          </ul>
          <p>We do not intend to discriminate against users for exercising privacy rights granted by applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">9. Advertising and Analytics</h3>
          <p className="mb-2">If JamBox+ uses third-party analytics, advertising, or measurement services, those providers may receive information concerning your use of the Services. This may include:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>IP address;</li>
            <li>Device information;</li>
            <li>Browser information;</li>
            <li>Approximate location;</li>
            <li>Interaction information;</li>
            <li>Advertising identifiers;</li>
            <li>Cookie identifiers; and</li>
            <li>Information about pages or content accessed.</li>
          </ul>
          <p>Third-party providers may process this information according to their own privacy policies. Where required by law, we will obtain consent or provide appropriate opt-out mechanisms for applicable advertising and tracking technologies.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">10. Third-Party Services and Links</h3>
          <p>JamBox+ may contain links, embedded content, advertisements, integrations, or other functionality provided by third parties. Third parties may independently collect information from you. We do not control the privacy practices of third-party websites or services. Their own privacy policies may apply when you interact with them.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">11. Service Providers</h3>
          <p className="mb-2">We may use third-party companies and service providers to help operate JamBox+, including providers of: Web hosting, Cloud infrastructure, Content delivery, Streaming infrastructure, Analytics, Security, Fraud prevention, Customer support, Email delivery, Authentication, Database management, Advertising, and Technical maintenance.</p>
          <p>Where required by applicable law, we use appropriate safeguards when engaging service providers that process personal information on our behalf.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">12. International Data Transfers</h3>
          <p>JamBox+ may process or store personal information in countries other than the country where you live. Those countries may have privacy laws that differ from those in your jurisdiction. Where required by applicable law, we use appropriate safeguards for international transfers, which may include recognized contractual protections, adequacy decisions, or other legally permitted transfer mechanisms.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">13. Data Security</h3>
          <p>We use reasonable administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, disclosure, loss, misuse, alteration, destruction, and other unauthorized processing. However, no internet transmission, website, server, or electronic storage system can be guaranteed to be completely secure.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">14. Data Retention</h3>
          <p className="mb-2">We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy. Retention periods may depend on: The purpose for which the information was collected; Whether you maintain an account; Legal and regulatory requirements; Security and fraud-prevention requirements; Dispute resolution; Enforcement of agreements; and Legitimate operational requirements.</p>
          <p>When personal information is no longer required, we will take reasonable steps to delete, anonymize, or securely dispose of it, subject to applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">15. Children's Privacy</h3>
          <p>JamBox+ does not knowingly collect personal information from children in circumstances where such collection is prohibited by applicable law. Different countries have different minimum ages and requirements for online services. Where legally required, we may implement age restrictions, parental consent mechanisms, or other safeguards. If you believe that a child has provided personal information to us in violation of applicable requirements, please contact us so that we can investigate and take appropriate action.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">16. User Accounts</h3>
          <p>If JamBox+ provides account functionality, you are responsible for maintaining the confidentiality of your account credentials. You should not share your password or account credentials with unauthorized persons. We may process account information necessary to authenticate users, maintain account security, provide account features, and prevent unauthorized use.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">17. Communications</h3>
          <p>If you provide an email address or other contact information, we may use it to communicate with you about your account, requested services, security matters, technical issues, changes to the Services, changes to this Privacy Policy, and other service-related matters. Where required by law, we will obtain consent before sending promotional or marketing communications.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">18. Do Not Track and Similar Signals</h3>
          <p>Some browsers and devices provide “Do Not Track” or similar privacy signals. Because there is no universal standard for responding to every such signal, our Services may not respond to all browser-based Do Not Track settings. Where applicable law requires recognition of a legally valid universal opt-out preference signal, we will take reasonable steps to honor it.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">19. Data Breaches</h3>
          <p>If we become aware of a personal-information security incident, we will investigate and take reasonable steps to contain, mitigate, and remediate the incident. Where notification is legally required, we will notify affected users, regulators, or other relevant parties in accordance with applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">20. Your Privacy Requests</h3>
          <p>To submit a privacy request, complaint, or question concerning your personal information, contact us at: <strong>Email:</strong> <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:underline">uj2b6eb4dfna@mail.dpdns.org</a>. Please provide enough information for us to identify and properly respond to your request. We may request additional information to verify your identity before providing access to personal information or processing certain requests. We will respond to valid requests within the time periods required by applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">21. Changes to This Privacy Policy</h3>
          <p>We may modify this Privacy Policy from time to time to reflect changes to our Services, technology, data-processing practices, third-party services, applicable privacy laws, or other operational or legal requirements. When we make material changes, we may provide additional notice where required by applicable law. The updated version will be posted on this page with a revised Last Updated date.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">22. Contact Us</h3>
          <p>If you have questions, concerns, complaints, or requests concerning this Privacy Policy or our handling of personal information, please contact us:<br/><br/>
          <strong>JamBox+</strong><br/>
          <strong>Website:</strong> https://jamboxplusph.dpdns.org/<br/>
          <strong>Privacy Email:</strong> <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:underline">uj2b6eb4dfna@mail.dpdns.org</a></p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">23. Applicable Law</h3>
          <p>This Privacy Policy is intended to operate alongside, and not replace, mandatory privacy protections that apply to you under the laws of your country, state, province, or territory. Nothing in this Privacy Policy limits any privacy rights that cannot legally be waived or excluded under applicable law. Where mandatory local privacy law provides greater protection than this Privacy Policy, those mandatory requirements will apply to the extent required.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">24. Acknowledgment</h3>
          <p className="mb-8">By accessing or using JamBox+, you acknowledge that you have had an opportunity to review this Privacy Policy. Where applicable law requires consent for a particular processing activity, we will obtain that consent through an appropriate mechanism rather than relying solely on your general use of the Services.</p>

          <p className="text-center text-white/50 pb-8">End of Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
}

export function TermsOfService({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/90 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#14161B] w-full max-w-4xl min-h-screen sm:min-h-[fit-content] sm:my-10 sm:rounded-2xl flex flex-col shadow-2xl relative">
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#14161B]/95 backdrop-blur-md sm:rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Terms & Conditions</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 sm:p-10 text-white/80 space-y-6 text-sm sm:text-base leading-relaxed">
          <div className="mb-8">
            <p className="font-semibold">Effective Date: August 17, 2026</p>
            <p className="font-semibold mb-4">Last Updated: August 17, 2026</p>
            <p>Welcome to <strong>JamBox+</strong> (“JamBox+,” “we,” “us,” or “our”).</p>
            <p className="mt-4">These Terms & Conditions / Terms of Service (“Terms”) govern your access to and use of the JamBox+ website, streaming services, applications, features, content, and related services (collectively, the “Services”).</p>
            <p className="mt-4"><strong>Website:</strong> https://jamboxplusph.dpdns.org/</p>
            <p className="mt-4 font-bold text-white">By accessing or using JamBox+, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the Services.</p>
          </div>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">1. Acceptance of These Terms</h3>
          <p>By accessing, browsing, or using JamBox+, you confirm that you have read and understood these Terms; you agree to comply with these Terms; you will use the Services only for lawful purposes; and you will comply with all applicable local, national, and international laws. If you are using JamBox+ on behalf of another person or organization, you represent that you have authority to accept these Terms on their behalf.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">2. Eligibility</h3>
          <p>You may use JamBox+ only if you are legally permitted to do so under the laws applicable to you. Certain content or features may have age restrictions or other eligibility requirements. If you are under the applicable age of majority or minimum age required to use a particular feature, you must use the Services only with appropriate parental or guardian involvement where required by law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">3. The JamBox+ Service</h3>
          <p>JamBox+ may provide access to movies, television programs, videos, trailers, artwork, information, metadata, links, and other audiovisual or informational material. The availability of particular content may vary depending on factors including geographic location, licensing arrangements, availability of third-party sources, technical limitations, device compatibility, internet connectivity, and other operational considerations. We do not guarantee that any particular movie, television program, video, or other content will always be available. We may add, remove, modify, replace, suspend, or discontinue content or features at any time.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">4. Content and Sources</h3>
          <p>JamBox+ may display or provide access to content obtained from or hosted by third-party services, platforms, websites, content providers, or other sources. Unless expressly stated otherwise, JamBox+ does not claim ownership of third-party copyrighted movies, television programs, videos, music, images, trademarks, or other intellectual property. Where content is provided by a third party, the applicable third party may remain responsible for the content and its availability. JamBox+ may provide links or technical access to third-party resources without necessarily endorsing, sponsoring, or controlling those resources.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">5. Acceptable Use</h3>
          <p className="mb-2">You agree to use JamBox+ responsibly and lawfully. You must not use the Services to:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Violate copyright, trademark, privacy, publicity, or other intellectual-property rights;</li>
            <li>Violate any applicable law or regulation;</li>
            <li>Circumvent technological protection measures;</li>
            <li>Bypass geographic, access, or security restrictions;</li>
            <li>Interfere with the operation of the Services;</li>
            <li>Attempt to gain unauthorized access to our systems or servers;</li>
            <li>Introduce viruses, malware, malicious code, or harmful software;</li>
            <li>Conduct automated scraping or excessive automated requests that interfere with the Services;</li>
            <li>Attack, probe, scan, or test the security of the Services without authorization;</li>
            <li>Reverse engineer, decompile, or disassemble portions of the Services except where expressly permitted by applicable law;</li>
            <li>Reproduce, redistribute, publicly perform, transmit, broadcast, sell, rent, or commercially exploit content without the required authorization;</li>
            <li>Download or capture protected content when such activity is not authorized;</li>
            <li>Use the Services to facilitate infringement or other unlawful activity;</li>
            <li>Impersonate another person or organization;</li>
            <li>Attempt to obtain another user's account or credentials;</li>
            <li>Circumvent account restrictions or suspensions;</li>
            <li>Use the Services to distribute spam or unsolicited communications; or</li>
            <li>Otherwise misuse the Services.</li>
          </ul>
          <p>We reserve the right to investigate suspected violations and take appropriate action.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">6. Copyright and Intellectual Property</h3>
          <p>The Services and their original elements may be protected by copyright, trademark, database, or other intellectual-property laws. All rights not expressly granted under these Terms are reserved. Third-party names, logos, titles, characters, trademarks, movies, television programs, music, and other copyrighted materials remain the property of their respective owners. Nothing in these Terms grants you ownership of any third-party intellectual property. Philippine copyright law, including Republic Act No. 8293 as amended, recognizes and protects copyright interests and provides remedies for infringement.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">7. Copyright Complaints and DMCA-Style Notices</h3>
          <p>JamBox+ respects the intellectual-property rights of copyright owners. If you believe that material accessible through JamBox+ infringes your copyright or other intellectual-property rights, you may contact us at: <strong>Copyright Email:</strong> <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:underline">uj2b6eb4dfna@mail.dpdns.org</a>. Please provide sufficient information for us to evaluate the complaint. Submitting a notice does not guarantee removal. We may review the information provided and take action that we reasonably consider appropriate.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">8. Repeat Infringement</h3>
          <p>Where appropriate and based on the circumstances, JamBox+ may restrict, suspend, or terminate access for users or accounts that repeatedly engage in copyright infringement or other intellectual-property violations.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">9. Third-Party Links and Services</h3>
          <p>JamBox+ may contain links to websites, streaming sources, advertisements, applications, services, or other resources operated by third parties. Third-party services are not controlled by JamBox+. We are not responsible for third-party content, privacy practices, terms, or availability. Your use of third-party services is subject to the applicable third party's terms and policies.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">10. Advertising</h3>
          <p>JamBox+ may display advertisements provided by third-party advertising networks or partners. Advertisements may link to external websites. We do not necessarily endorse products, services, companies, or claims appearing in third-party advertisements.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">11. Availability of the Services</h3>
          <p>We attempt to keep JamBox+ available and functioning properly, but we do not guarantee uninterrupted availability. The Services may occasionally be unavailable due to maintenance, updates, server problems, network failures, or other circumstances beyond our control. We may modify, suspend, or discontinue any portion of the Services at any time.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">12. No Guarantee of Content Availability</h3>
          <p>We do not guarantee that a particular title will remain available, content will be available in every country, a particular stream will always function, content will be available at a particular resolution, or streaming will be uninterrupted. Content availability may change without notice.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">13. Disclaimer of Warranties</h3>
          <p>To the maximum extent permitted by applicable law, JamBox+ and its Services are provided on an <strong>“as is”</strong> and <strong>“as available”</strong> basis. We make no warranties or representations that the Services will always be available, uninterrupted, error-free, completely secure, or provide any particular content. We disclaim warranties to the maximum extent permitted by applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">14. Limitation of Liability</h3>
          <p>To the maximum extent permitted by applicable law, JamBox+ and its operators, affiliates, service providers, and representatives will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or relating to your use of the Services.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">15. Indemnification</h3>
          <p>To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless JamBox+, its operators, affiliates, service providers, and representatives from claims, liabilities, damages, losses, costs, and expenses arising out of your violation of these Terms, unlawful use of the Services, infringement of another person's rights, or misuse of the Services.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">16. Account Suspension and Termination</h3>
          <p>We may suspend or terminate your access to JamBox+ if we reasonably believe that you violated these Terms, violated applicable law, infringed intellectual-property rights, attempted to compromise the Services, engaged in fraud or abuse, or created a security or legal risk.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">17. Effect of Termination</h3>
          <p>After termination or suspension, your right to use the affected Services may immediately end, we may disable associated accounts, and certain provisions of these Terms may continue to apply.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">18. Privacy</h3>
          <p>Your use of JamBox+ is also subject to our Privacy Policy, which explains how we collect, use, disclose, retain, and protect personal information.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">19. Changes to These Terms</h3>
          <p>We may modify these Terms from time to time. The updated Terms will be posted on this page with a new Last Updated date. Your continued use of JamBox+ after the effective date of updated Terms may constitute acceptance of the revised Terms to the extent permitted by applicable law.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">20. Governing Law</h3>
          <p>These Terms shall be governed by and interpreted in accordance with the <strong>laws of the Republic of the Philippines</strong>, without regard to conflict-of-law principles, except where mandatory laws of another jurisdiction apply and cannot legally be excluded.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">21. Dispute Resolution and Jurisdiction</h3>
          <p>Any dispute arising out of or relating to these Terms or your use of JamBox+ shall, where legally permissible, be subject to the jurisdiction of the appropriate courts of the <strong>Republic of the Philippines</strong>. Before commencing formal proceedings, we encourage users to contact us so that we may attempt to resolve the matter informally at <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:underline">uj2b6eb4dfna@mail.dpdns.org</a>.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">22. Severability</h3>
          <p>If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, that provision will be limited or removed to the minimum extent necessary, and the remaining provisions will continue in full force.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">23. No Waiver</h3>
          <p>Our failure to enforce any provision of these Terms does not constitute a waiver of our right to enforce that provision in the future.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">24. Entire Agreement</h3>
          <p>These Terms, together with the Privacy Policy and any additional terms expressly incorporated into the Services, constitute the agreement between you and JamBox+ concerning your use of the Services.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">25. Contact Us</h3>
          <p>For questions regarding these Terms, copyright complaints, legal notices, or other concerns, contact us at: <strong>Email:</strong> <a href="mailto:uj2b6eb4dfna@mail.dpdns.org" className="text-amber-500 hover:underline">uj2b6eb4dfna@mail.dpdns.org</a>.</p>

          <h3 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">26. Acknowledgment</h3>
          <p className="mb-8">By accessing or using JamBox+, you acknowledge that you have read, understood, and agree to these Terms & Conditions / Terms of Service. If you do not agree with these Terms, you must discontinue use of the Services.</p>

          <p className="text-center text-white/50 pb-8">End of Terms & Conditions</p>
        </div>
      </motion.div>
    </div>
  );
}
