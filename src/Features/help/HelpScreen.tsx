import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Users,
  CalendarDays,
  ScanLine,
  Settings,
} from "lucide-react";

interface HelpScreenProps {
  onBack?: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "How do I create a new event?",
    answer:
      "Go to the Events dashboard and click the Create New Event button. Enter your event details, such as the event name, date, location, and description, then submit the form.",
  },
  {
    question: "How do I manage attendees?",
    answer:
      "Open the Attendees section from the sidebar. From there, you can search for attendees, view their registration details, and manage their check-in status.",
  },
  {
    question: "How does the check-in system work?",
    answer:
      "The Check-in screen generates a QR code for your event. Display this QR code at the venue so attendees can scan it externally. Their check-in information can then be viewed in the Check-in Log.",
  },
  {
    question: "Who can view the check-in log?",
    answer:
      "The Check-in Log is intended for administrators. It allows admins to see who checked in, where they checked in, and the date and time of each check-in.",
  },
  {
    question: "How do I add rooms or booths?",
    answer:
      "Use the Rooms or Teams / Booths section from the sidebar. You can add event spaces, manage their information, and assign teams or booths as needed.",
  },
  {
    question: "How do I change between light and dark mode?",
    answer:
      "Go to Settings and select Appearance. From there, choose Light Mode or Dark Mode. Your selected theme will be applied throughout the application.",
  },
];

const QUICK_HELP = [
  {
    title: "Getting Started",
    description: "Learn the basics of setting up and managing your events.",
    icon: BookOpen,
  },
  {
    title: "Managing Attendees",
    description: "Learn how to manage registrations and attendee check-ins.",
    icon: Users,
  },
  {
    title: "Events",
    description: "Create, edit, and manage your event information.",
    icon: CalendarDays,
  },
  {
    title: "Check-In",
    description: "Learn how the QR check-in system works.",
    icon: ScanLine,
  },
  {
    title: "Settings",
    description: "Manage your account and application preferences.",
    icon: Settings,
  },
];

export const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)]">
      <main className="max-w-5xl mx-auto px-6 py-8 sm:px-10">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="
              flex items-center gap-2
              text-sm
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              transition
              cursor-pointer
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">

            <div
              className="
                w-11 h-11
                rounded-xl
                bg-emerald-500/10
                border border-emerald-500/20
                flex items-center justify-center
              "
            >
              <HelpCircle className="w-5 h-5 text-emerald-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Help & Support
              </h1>

              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Find answers and learn how to use the Event Management System.
              </p>
            </div>

          </div>
        </div>

        {/* SEARCH */}
        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-xl
            p-5
            mb-6
          "
        >
          <div className="relative">

            <Search
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-[var(--text-muted)]
              "
            />

            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                pl-10
                pr-4
                py-3
                bg-[var(--bg-input)]
                border border-[var(--border-default)]
                rounded-lg
                text-sm
                text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)]
                focus:outline-none
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-500/10
                transition-all
              "
            />

          </div>
        </div>

        {/* QUICK HELP */}
        {!searchTerm && (
          <section className="mb-8">

            <div className="mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Quick Help
              </h2>

              <p className="text-xs text-[var(--text-muted)] mt-1">
                Browse common topics to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {QUICK_HELP.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    className="
                      text-left
                      bg-[var(--bg-surface)]
                      border border-[var(--border-subtle)]
                      rounded-xl
                      p-5
                      hover:border-emerald-500/30
                      hover:bg-emerald-500/5
                      transition-all
                      cursor-pointer
                    "
                  >
                    <div
                      className="
                        w-10 h-10
                        rounded-lg
                        bg-emerald-500/10
                        border border-emerald-500/20
                        flex items-center justify-center
                        mb-4
                      "
                    >
                      <Icon className="w-5 h-5 text-emerald-500" />
                    </div>

                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}

            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-xl
            overflow-hidden
          "
        >
          <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Frequently Asked Questions
            </h2>

            <p className="text-xs text-[var(--text-muted)] mt-1">
              Find answers to common questions about the system.
            </p>
          </div>

          <div>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openFAQ === index;

                return (
                  <div
                    key={faq.question}
                    className="
                      border-b
                      border-[var(--border-subtle)]
                      last:border-b-0
                    "
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-4
                        px-6
                        py-4
                        text-left
                        hover:bg-emerald-500/5
                        transition-colors
                        cursor-pointer
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-medium
                          text-[var(--text-primary)]
                        "
                      >
                        {faq.question}
                      </span>

                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-14 text-center">

                <Search className="w-7 h-7 text-[var(--text-muted)] mx-auto mb-3" />

                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  No results found
                </h3>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Try searching for something else.
                </p>

              </div>
            )}
          </div>
        </section>

        {/* CONTACT SUPPORT */}
        <section
          className="
            mt-6
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-xl
            p-6
          "
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            <div className="flex items-start gap-4">

              <div
                className="
                  w-10 h-10
                  rounded-lg
                  bg-emerald-500/10
                  border border-emerald-500/20
                  flex items-center justify-center
                  shrink-0
                "
              >
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Still need help?
                </h2>

                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Contact our support team if you can't find what you're
                  looking for.
                </p>
              </div>

            </div>

            <button
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-lg
                bg-emerald-600
                hover:bg-emerald-500
                text-emerald-950
                text-sm
                font-semibold
                transition-colors
                cursor-pointer
                shrink-0
              "
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </button>

          </div>
        </section>

        <div className="h-10" />
      </main>
    </div>
  );
};

export default HelpScreen;