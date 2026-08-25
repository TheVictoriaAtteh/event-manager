import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
  onSendResetLink?: (email: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigateToLogin,
  onSendResetLink,
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      if (onSendResetLink) {
        onSendResetLink(email);
      }
    }, 1000);
  };

  return (
    <div
      className="
        bg-dot-grid
        min-h-screen
        text-[var(--text-primary)]
        flex
        items-center
        justify-center
        p-6
        font-sans
      "
    >
      <div className="w-full max-w-sm">

        {/* BRAND */}
        <div className="text-center mb-8">

          <div className="flex justify-center items-center gap-3 mb-4">

            <div
              className="
                h-10 w-10
                rounded-xl
                bg-emerald-600
                flex items-center justify-center
                text-white
                font-extrabold
                text-lg
                shadow-lg
                shadow-emerald-900/10
              "
            >
              G
            </div>

            <span
              className="
                text-2xl
                font-bold
                text-[var(--text-heading)]
                tracking-tight
              "
            >
              Gatepass
            </span>

          </div>

        </div>

        {/* CARD */}
        <div
          className="
            bg-[var(--bg-surface)]
            border border-[var(--border-subtle)]
            rounded-2xl
            p-6 sm:p-8
            shadow-xl
          "
        >

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-7">

            <div
              className="
                w-11 h-11
                rounded-xl
                bg-emerald-500/10
                border border-emerald-500/20
                flex items-center justify-center
                mb-4
                text-[var(--text-accent)]
              "
            >
              <Mail className="w-5 h-5" />
            </div>

            <h1
              className="
                text-xl
                font-bold
                tracking-tight
                text-[var(--text-heading)]
              "
            >
              Forgot Password
            </h1>

            <p
              className="
                text-xs
                text-[var(--text-secondary)]
                mt-2
                max-w-[270px]
                leading-relaxed
              "
            >
              Enter your email address and we'll send you a password reset
              link.
            </p>

          </div>

          {submitted ? (

            /* SUCCESS STATE */
            <div className="space-y-4">

              <div
                className="
                  p-4
                  bg-emerald-500/10
                  border border-emerald-500/20
                  rounded-xl
                  text-xs
                  text-[var(--text-secondary)]
                  leading-relaxed
                "
              >
                <div className="flex items-start gap-3">

                  <CheckCircle2
                    className="
                      w-4 h-4
                      text-[var(--text-accent)]
                      shrink-0
                      mt-0.5
                    "
                  />

                  <p>
                    Reset link sent! Please check your inbox at{" "}
                    <span className="font-semibold text-[var(--text-heading)]">
                      {email}
                    </span>
                    .
                  </p>

                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToLogin}
                className="
                  w-full
                  py-3
                  bg-emerald-600
                  hover:bg-emerald-500
                  text-white
                  font-semibold
                  rounded-lg
                  text-sm
                  transition-colors
                  cursor-pointer
                "
              >
                Return to Login
              </button>

            </div>

          ) : (

            /* FORM */
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-semibold
                    text-[var(--text-secondary)]
                    uppercase
                    tracking-wider
                    mb-2
                  "
                >
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    w-full
                    px-4 py-3
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

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-3
                  bg-emerald-600
                  hover:bg-emerald-500
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  rounded-lg
                  text-sm
                  transition-colors
                  cursor-pointer
                "
              >
                {loading ? "Sending Link..." : "Send Reset Link"}
              </button>

            </form>
          )}

          {/* BACK TO LOGIN */}
          <div
            className="
              mt-7
              pt-6
              border-t border-[var(--border-subtle)]
              flex
              items-center
              justify-center
            "
          >

            <button
              onClick={onNavigateToLogin}
              type="button"
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-[var(--text-secondary)]
                hover:text-[var(--text-accent)]
                font-medium
                transition-colors
                cursor-pointer
              "
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};