import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  initAuth, 
  googleSignIn, 
  getAccessToken, 
  logout, 
  auth 
} from "../lib/auth";
import { User } from "firebase/auth";
import { 
  Mail, 
  Send, 
  Inbox, 
  Plus, 
  Search, 
  Sparkles, 
  RefreshCw, 
  LogOut, 
  ArrowLeft, 
  Trash2, 
  Eye, 
  Check, 
  Loader2, 
  Star, 
  Archive, 
  CornerUpLeft, 
  VolumeX, 
  AlertCircle,
  FileText
} from "lucide-react";
import CustomCursor from "../components/CustomCursor";

interface GmailMessageHeader {
  name: string;
  value: string;
}

interface GmailMessageDetail {
  id: string;
  threadId: string;
  snippet: string;
  internalDate: string;
  headers: GmailMessageHeader[];
  from: string;
  subject: string;
  date: string;
  body: string;
  isUnread: boolean;
}

const TEMPLATES = [
  {
    name: "3xHike Outreach",
    subject: "3xHike Partnership Proposal - Igniting Video Growth",
    body: `Hi there,\n\nI hope you're doing fantastic.\n\nI was browsing through your social channels and noticed some amazing potential for highly conversion-focused, direct-response video ads. \n\nAt 3xHike, we specialize in scaling premium brands by crafting high-impact UGC and motion graphics that are simply impossible to ignore. We've recently driven incredible ROI for partners like Grazia Stone and Cinco Livings.\n\nI'd love to jump on a quick 15-minute strategy call to show you our exact playbook. Would this Wednesday at 3:00 PM work for you?\n\nBest regards,\n[Your Name]\n3xHike. Scaling Impossible to Ignore Brands.`
  },
  {
    name: "Strategy Session Follow-up",
    subject: "Your Strategic Ad Review with 3xHike.",
    body: `Hi [Name],\n\nIt was an absolute pleasure speaking with you today regarding your digital strategy. \n\nTo recap, here are the main direct-response pillars we discussed for scaling your conversions:\n1. Dynamic hook testing within the first 3 seconds.\n2. Iterative visual storyboards for diverse client demographics.\n3. Continuous SQLite tracking and analytics tuning.\n\nI have drafted a basic roadmap for us to look at. Let's finalize our implementation next week. Are you available for a brief catch-up on Monday?\n\nBest,\n[Your Name]\n3xHike Growth Team`
  },
  {
    name: "Creative Ad Concept",
    subject: "Fresh Direct-Response Ad Concept (3xHike Agency)",
    body: `Hey partner,\n\nWe prepared a unique direct-response script blueprint specifically optimized for your brand. It hooks immediate attention with sensory lifestyle triggers followed by premium editorial text overlays.\n\nAttached inside our primary workspace is the story direction. Let us know if you approve this conceptual angle, so we can dispatch our specialists to capture these visual sequences immediately.\n\nBest,\n[Your Name]`
  }
];

export default function GmailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<GmailMessageDetail[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [currentTab, setCurrentTab] = useState<"inbox" | "sent" | "compose">("inbox");
  const [errorText, setErrorText] = useState("");

  // Composer state
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // AI assistant state
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantResult, setAssistantResult] = useState("");
  const [replyTone, setReplyTone] = useState("polite and bold");

  // Init auth
  useEffect(() => {
    const unsubscribe = initAuth(
      async (firebaseUser, cachedToken) => {
        setUser(firebaseUser);
        setToken(cachedToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch messages when token is available or dynamic trigger
  useEffect(() => {
    if (token && currentTab !== "compose") {
      fetchGmailMessages();
    }
  }, [token, currentTab]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorText("");
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorText("Google Sign-in failed. Please verify popup permissions and account permissions.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMessages([]);
      setSelectedMessage(null);
      setNeedsAuth(true);
      setToken(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Helper: Decode Gmail base64 url-safe body
  function decodeGmailBody(data: string) {
    if (!data) return "";
    try {
      const decodedB64 = data.replace(/-/g, "+").replace(/_/g, "/");
      return decodeURIComponent(
        atob(decodedB64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (err) {
      try {
        return atob(data.replace(/-/g, "+").replace(/_/g, "/"));
      } catch {
        return "Unable to decode message text.";
      }
    }
  }

  // Find recursive parts inside body payload
  function parseGmailBody(payload: any): string {
    if (!payload) return "";
    if (payload.body && payload.body.data) {
      return decodeGmailBody(payload.body.data);
    }
    if (payload.parts) {
      const htmlPart = findPart(payload.parts, "text/html");
      if (htmlPart && htmlPart.body && htmlPart.body.data) {
        return decodeGmailBody(htmlPart.body.data);
      }
      const textPart = findPart(payload.parts, "text/plain");
      if (textPart && textPart.body && textPart.body.data) {
        return decodeGmailBody(textPart.body.data);
      }
    }
    return "";
  }

  function findPart(parts: any[], mimeType: string): any {
    for (const part of parts) {
      if (part.mimeType === mimeType) {
        return part;
      }
      if (part.parts) {
        const found = findPart(part.parts, mimeType);
        if (found) return found;
      }
    }
    return null;
  }

  const fetchGmailMessages = async () => {
    if (!token) return;
    setLoadingList(true);
    setErrorText("");
    try {
      // Determine query parameter based on Search and Tab
      let q = "";
      if (currentTab === "sent") {
        q = "from:me ";
      }
      if (searchQuery) {
        q += searchQuery;
      }

      const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10${q ? `&q=${encodeURIComponent(q)}` : ""}`;
      
      const res = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Access token expired, prompt sign-in again
          setNeedsAuth(true);
          return;
        }
        throw new Error(`Gmail API list returned status ${res.status}`);
      }

      const listData = await res.json();
      
      if (!listData.messages || listData.messages.length === 0) {
        setMessages([]);
        setLoadingList(false);
        return;
      }

      // Fetch precise details for each listed message in parallel
      const detailedMessages: GmailMessageDetail[] = await Promise.all(
        listData.messages.map(async (msg: any) => {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!detailRes.ok) throw new Error("Failed to fetch mail details");
          const detail = await detailRes.json();
          
          const headers: GmailMessageHeader[] = detail.payload?.headers || [];
          const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
          const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
          const date = headers.find((h) => h.name.toLowerCase() === "date")?.value || "";
          const body = parseGmailBody(detail.payload);
          const isUnread = detail.labelIds?.includes("UNREAD") || false;

          return {
            id: detail.id,
            threadId: detail.threadId,
            snippet: detail.snippet || "",
            internalDate: detail.internalDate || "",
            headers,
            from,
            subject,
            date,
            body: body || detail.snippet || "",
            isUnread,
          };
        })
      );

      // Sort by domestic internalDate descending (most recent first)
      detailedMessages.sort((a, b) => Number(b.internalDate) - Number(a.internalDate));
      setMessages(detailedMessages);
    } catch (err: any) {
      console.error("Error loading Gmail messages:", err);
      setErrorText("Could not fetch messages. Verify your Google permissions or try logging out and logging back in.");
    } finally {
      setLoadingList(false);
    }
  };

  // Compose MIME raw string
  function makeRawEmail(to: string, subject: string, bodyText: string) {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    // Format simple rich visual body replacing newlines with html breaks
    const htmlFormattedBody = bodyText.replace(/\n/g, "<br />");
    const emailLines = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      "",
      `<div style="font-family: sans-serif; line-height: 1.6; color: #111;">${htmlFormattedBody}</div>`
    ];
    const emailStr = emailLines.join("\r\n");
    return btoa(unescape(encodeURIComponent(emailStr)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSending(true);
    setSendSuccess(false);
    setErrorText("");

    try {
      const rawMime = makeRawEmail(composeTo, composeSubject, composeBody);
      const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: rawMime }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gmail API send returned status ${res.status}`);
      }

      setSendSuccess(true);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      
      // Auto return to inbox after small delay
      setTimeout(() => {
        setSendSuccess(false);
        setCurrentTab("inbox");
      }, 2000);

    } catch (err: any) {
      console.error("Send failed:", err);
      setErrorText("Failed to send email. Clarify details and try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Gemini AI Draft Composer Assistance
  const handleAICompose = async () => {
    setAssistantLoading(true);
    setAssistantResult("");
    try {
      const response = await fetch("/api/gmail-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "compose_new",
          description: assistantPrompt
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");

      setComposeBody(data.text);
      setAssistantPrompt("");
    } catch (e: any) {
      console.error("AI composition error:", e);
      setErrorText(`AI Co-Writer: ${e.message || "Failed to draft concept email."}`);
    } finally {
      setAssistantLoading(false);
    }
  };

  // Gemini AI Smart Reply Assistance for open thread
  const handleAISmartReply = async (action: "summarize" | "draft_reply") => {
    if (!selectedMessage) return;
    setAssistantLoading(true);
    setAssistantResult("");
    try {
      const response = await fetch("/api/gmail-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          emailBody: selectedMessage.body,
          sender: selectedMessage.from,
          subject: selectedMessage.subject,
          replyTone
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to run assistant");

      setAssistantResult(data.text);
    } catch (e: any) {
      console.error("AI assistant helper error:", e);
      setErrorText(`AI Assistant: ${e.message || "Could not complete operation."}`);
    } finally {
      setAssistantLoading(false);
    }
  };

  const applyTemplate = (tpl: { subject: string, body: string }) => {
    setComposeSubject(tpl.subject);
    setComposeBody(tpl.body);
  };

  const loadReplyDraft = () => {
    if (!selectedMessage || !assistantResult) return;
    // Switch to compose tab and fill details
    setComposeTo(extractEmailAddress(selectedMessage.from));
    setComposeSubject(`Re: ${selectedMessage.subject}`);
    setComposeBody(assistantResult);
    setAssistantResult("");
    setCurrentTab("compose");
  };

  function extractEmailAddress(fromHeader: string) {
    const match = fromHeader.match(/<([^>]+)>/);
    return match ? match[1] : fromHeader;
  }

  function getSenderInitials(from: string) {
    const scrubbed = from.replace(/"/g, "");
    const parts = scrubbed.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return scrubbed.slice(0, 2).toUpperCase();
  }

  // Get responsive background initials color
  function getInitialsColor(name: string) {
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colors = [
      "bg-emerald-600",
      "bg-orange-600",
      "bg-blue-600",
      "bg-rose-600",
      "bg-cyan-600",
      "bg-indigo-600",
      "bg-purple-600"
    ];
    return colors[charCodeSum % colors.length];
  }

  return (
    <main className="relative bg-black min-h-screen text-white font-sans overflow-x-hidden">
      <CustomCursor />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white text-2xl font-black tracking-tighter hover:scale-105 transition-transform duration-200">
            3xHike.
          </Link>
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] font-mono tracking-wider uppercase text-[#F4CE14]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Gmail Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black lowercase text-[#F4CE14]">{user.displayName || "Client User"}</p>
                <p className="text-[10px] font-mono text-white/50">{user.email}</p>
              </div>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs">
                  U
                </div>
              )}
            </div>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Disconnect</span>
            </button>
          ) : (
            <Link to="/" className="text-white text-sm font-bold uppercase tracking-wider hover:underline">
              Exit
            </Link>
          )}
        </div>
      </nav>

      {/* Main Body Grid */}
      <div className="container mx-auto px-4 md:px-10 pt-28 pb-20 relative z-10">
        
        {needsAuth ? (
          /* Locked State Sign-In interface */
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-xl mx-auto p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl mt-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#F4CE14]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black lowercase tracking-tighter mb-4">
              Connect Gmail Inbox.
            </h1>
            <p className="text-white/60 text-sm md:text-base mb-8 leading-relaxed">
              Unlock a lightning-fast, high-converting agency workflow. Read communications directly, respond utilizing AI recommendations, and generate instant direct-response concept emails on behalf of 3xHike.
            </p>

            {errorText && (
              <div className="w-full mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorText}</span>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gsi-material-button w-full sm:w-auto relative cursor-pointer"
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-bold text-sm tracking-tight text-black">
                  {isLoggingIn ? "Authorizing Gmail..." : "Sign in with Google"}
                </span>
              </div>
            </button>
            
            <p className="mt-6 text-[10px] text-white/40 font-mono">
              Secure OAuth authorization. Token cached strictly in-memory.
            </p>
          </div>
        ) : (
          /* Active Client Interface */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-4">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <button
                onClick={() => {
                  setCurrentTab("compose");
                  setSelectedMessage(null);
                }}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg cursor-pointer ${
                  currentTab === "compose" ? "bg-[#FF4500] text-white" : "bg-[#F4CE14] text-black"
                }`}
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Compose Pitch</span>
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl p-3 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setCurrentTab("inbox");
                    setSelectedMessage(null);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 text-xs uppercase tracking-wide font-black transition-colors ${
                    currentTab === "inbox" && !selectedMessage ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Inbox className="w-4 h-4 text-[#F4CE14]" />
                  <div className="flex-1 flex justify-between items-center">
                    <span>Inbox</span>
                    {messages.filter(m => m.isUnread).length > 0 && (
                      <span className="bg-[#FF4500] text-white font-mono text-[9px] px-2 py-0.5 rounded-full">
                        {messages.filter(m => m.isUnread).length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab("sent");
                    setSelectedMessage(null);
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 text-xs uppercase tracking-wide font-black transition-colors ${
                    currentTab === "sent" ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Send className="w-4 h-4 text-[#F4CE14]" />
                  <span>Sent Outbox</span>
                </button>
              </div>

              {/* Status & SQLite integration insight card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">Workspace Status</span>
                </div>
                <h4 className="text-sm font-black lowercase tracking-tight text-white mb-2">Sync Engine Online</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Emails are compiled securely. SQLite records lead strategy logs internally for our scaling specialists.
                </p>
              </div>
            </div>

            {/* Email Workspace / Interactive Dashboard */}
            <div className="lg:col-span-3">

              {errorText && (
                <div className="mb-4 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Conditionally Render Panel Views */}
              {selectedMessage ? (
                /* Thread view */
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                  {/* Message Detail Toolbar */}
                  <div className="flex flex-wrap justify-between items-center pb-6 border-b border-white/10 gap-4 mb-6">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAISmartReply("summarize")}
                        disabled={assistantLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4CE14]/10 hover:bg-[#F4CE14]/20 text-[#F4CE14] border border-[#F4CE14]/20 text-xs font-bold"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Summarize</span>
                      </button>
                      <button 
                        onClick={() => handleAISmartReply("draft_reply")}
                        disabled={assistantLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF4500]/10 hover:bg-[#FF4500]/20 text-[#FF4500] border border-[#FF4500]/20 text-xs font-bold"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                        <span>AI Smart Reply</span>
                      </button>
                    </div>
                  </div>

                  {/* Header metadata */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-black lowercase tracking-tight mb-4 text-[#F4CE14]">
                      {selectedMessage.subject}
                    </h2>

                    <div className="flex items-start gap-4 mb-8">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white ${getInitialsColor(selectedMessage.from)}`}>
                        {getSenderInitials(selectedMessage.from)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{selectedMessage.from}</p>
                        <p className="text-xs text-white/50">{selectedMessage.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Split Screen detailed workspace: text box & Assistant drawer */}
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                    
                    {/* Content text */}
                    <div className="xl:col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 text-white/90 text-sm leading-relaxed overflow-y-auto max-h-[500px]">
                      {selectedMessage.body ? (
                        <div 
                          className="email-render-body whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.body.includes("<br />") || selectedMessage.body.includes("</div>") ? selectedMessage.body : selectedMessage.body }}
                        />
                      ) : (
                        <p className="italic text-white/45">This email has no dynamic content preview.</p>
                      )}
                    </div>

                    {/* AI Smart Assistant Side-drawer */}
                    <div className="xl:col-span-2 bg-white/5 border border-stone-800 rounded-2xl p-5 shadow-inner">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                        <Sparkles className="w-4 h-4 text-[#F4CE14] animate-pulse" />
                        <h4 className="text-xs uppercase tracking-widest font-black text-[#F4CE14]">Gemini smart helper</h4>
                      </div>

                      <div className="mb-4">
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">Reply Tone Mode</label>
                        <select 
                          value={replyTone} 
                          onChange={(e) => setReplyTone(e.target.value)}
                          className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#F4CE14]/50"
                        >
                          <option value="polite and bold" className="bg-black">polite and bold (Direct Response)</option>
                          <option value="warm partnership" className="bg-black">warm partnership (Pitching Ad Brands)</option>
                          <option value="brief confirmation" className="bg-black">brief confirmation (Short & crisp)</option>
                          <option value="consultative agency" className="bg-black">consultative agency (Strategic audit)</option>
                        </select>
                      </div>

                      {assistantLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-white/60">
                          <Loader2 className="w-6 h-6 text-[#F4CE14] animate-spin" />
                          <span className="text-xs font-mono">Consulting Gemini models...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {assistantResult ? (
                            <div className="flex flex-col gap-3">
                              <div className="text-xs font-black text-white/80 lowercase tracking-tight">helper recommendation:</div>
                              <div className="bg-black/50 border border-white/5 rounded-xl p-3 text-xs text-white/80 whitespace-pre-line max-h-56 overflow-y-auto font-sans leading-relaxed">
                                {assistantResult}
                              </div>
                              <button
                                onClick={loadReplyDraft}
                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF4500] to-[#F4CE14] text-white text-xs uppercase font-black tracking-wider transition-transform hover:scale-[1.02]"
                              >
                                Draft reply with this script
                              </button>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-[11px] text-white/40 mb-4">Select an AI action above to summarize this email or compose an automated direct response ad-reply script in your selected tone.</p>
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleAISmartReply("summarize")}
                                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                                >
                                  Generate bullet summary
                                </button>
                                <button
                                  onClick={() => handleAISmartReply("draft_reply")}
                                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F4CE14] transition-colors"
                                >
                                  Generate draft reply script
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              ) : currentTab === "compose" ? (
                /* Compose Pitch form */
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                    <h2 className="text-xl font-black lowercase tracking-tighter text-[#F4CE14]">
                      Compose digital partnership
                    </h2>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">Pitch templates</span>
                      <select 
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            applyTemplate(TEMPLATES[Number(val)]);
                          }
                        }}
                        defaultValue=""
                        className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-black text-white focus:outline-none"
                      >
                        <option value="" className="bg-black">-- Empty Canvas --</option>
                        {TEMPLATES.map((tpl, idx) => (
                          <option key={idx} value={idx} className="bg-black">{tpl.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {sendSuccess && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 animate-bounce" />
                      <span>Email sent out successfully! Appending workflow details.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    
                    {/* Active Form */}
                    <form onSubmit={handleSendEmail} className="xl:col-span-2 flex flex-col gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-mono text-white/50 mb-1.5">Recipient address (To)</label>
                        <input
                          type="email"
                          required
                          value={composeTo}
                          onChange={(e) => setComposeTo(e.target.value)}
                          placeholder="client@brandname.com"
                          className="w-full bg-white/5 border border-white/15 focus:border-[#F4CE14] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-mono text-white/50 mb-1.5">Email Subject line</label>
                        <input
                          type="text"
                          required
                          value={composeSubject}
                          onChange={(e) => setComposeSubject(e.target.value)}
                          placeholder="Subject line of outreach"
                          className="w-full bg-white/5 border border-white/15 focus:border-[#F4CE14] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-mono text-white/50 mb-1.5">Body copy</label>
                        <textarea
                          required
                          rows={12}
                          value={composeBody}
                          onChange={(e) => setComposeBody(e.target.value)}
                          placeholder="Write your beautiful proposal script here..."
                          className="w-full bg-white/5 border border-white/15 focus:border-[#F4CE14] rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-sans leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSending}
                        className="w-full py-4 px-6 rounded-xl bg-[#F4CE14] text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform duration-200 cursor-pointer disabled:opacity-50"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Mailing raw server payload...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 ml-1 flex-shrink-0" />
                            <span>Send Email via Gmail</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* AI Co-Writer side helper */}
                    <div className="bg-white/5 border border-stone-800 rounded-3xl p-5 shadow-inner">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                        <Sparkles className="w-4 h-4 text-[#F4CE14] animate-pulse" />
                        <h4 className="text-xs uppercase tracking-widest font-black text-[#F4CE14]">AI Co-writer companion</h4>
                      </div>

                      <p className="text-[11px] text-white/55 leading-relaxed mb-4">
                        Need an eye-catching outreach? Describe what you want help writing (e.g., "Draft a follow up concept pitch for grazing stones about custom layout ads").
                      </p>

                      <div className="flex flex-col gap-3">
                        <textarea
                          rows={4}
                          value={assistantPrompt}
                          onChange={(e) => setAssistantPrompt(e.target.value)}
                          placeholder="What would you like 3xHike AI to generate?"
                          className="w-full bg-black/60 border border-white/10 focus:border-[#F4CE14]/55 rounded-xl p-3 text-xs text-white focus:outline-none font-sans"
                        />

                        <button
                          type="button"
                          onClick={handleAICompose}
                          disabled={assistantLoading || !assistantPrompt.trim()}
                          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-black text-white hover:text-[#F4CE14] transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                        >
                          {assistantLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F4CE14]" />
                              <span>Drafting blueprint...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#F4CE14]" />
                              <span>Generate email draft</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-6 pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-mono tracking-wider">Quick guidelines</span>
                        </div>
                        <ul className="text-[10px] text-white/50 space-y-1.5 list-disc pl-3.5">
                          <li>Specify target budgets or goals early</li>
                          <li>Reference active agency visual samples and ads</li>
                          <li>Draft call-to-actions (strategy call links)</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                /* Email Inbox/Sent list panel */
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Filter / Search header and Refresh */}
                  <div className="p-4 md:p-6 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between bg-black/40">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-4 h-4 text-white/40" />
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchGmailMessages()}
                        placeholder={`Search in ${currentTab}...`}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#F4CE14] rounded-xl text-xs text-white focus:outline-none focus:ring-0 placeholder-white/30"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={fetchGmailMessages}
                        disabled={loadingList}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                        title="Reload Inbox list"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingList ? "animate-spin text-[#F4CE14]" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* List Container */}
                  <div className="divide-y divide-white/5 max-h-[640px] overflow-y-auto">
                    {loadingList ? (
                      <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/55">
                        <Loader2 className="w-8 h-8 text-[#F4CE14] animate-spin" />
                        <span className="text-xs font-mono">Synchronizing client emails...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <Mail className="w-10 h-10 text-white/20 mb-3" />
                        <p className="text-sm font-black text-white/50 uppercase tracking-widest">No emails found</p>
                        <p className="text-xs text-white/30 mt-1">Try relaxing active search query criteria.</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`flex items-start gap-4 p-4 md:p-5 cursor-pointer border-l-4 transition-all duration-150 hover:bg-white/[0.03] ${
                            msg.isUnread ? "border-l-[#F4CE14] bg-white/[0.01]" : "border-l-transparent"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full sm:flex items-center justify-center font-black text-xs text-white flex-shrink-0 hidden ${getInitialsColor(msg.from)}`}>
                            {getSenderInitials(msg.from)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline gap-2 mb-1">
                              <span className={`text-xs truncate ${msg.isUnread ? "font-black text-white" : "font-medium text-white/70"}`}>
                                {msg.from}
                              </span>
                              <span className="text-[10px] text-white/30 whitespace-nowrap font-mono">
                                {msg.date.split(",").slice(0, 2).join(",") || msg.date}
                              </span>
                            </div>

                            <p className={`text-xs truncate mb-1 ${msg.isUnread ? "font-black text-white" : "font-normal text-white/80"}`}>
                              {msg.subject}
                            </p>

                            <p className="text-[11px] text-white/45 truncate leading-normal">
                              {msg.snippet}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
