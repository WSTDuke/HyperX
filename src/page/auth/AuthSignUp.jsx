import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import LazyLoading from "../enhancements/LazyLoading";
import { useSignUp } from "../../hooks/useAuth";
import { supabase } from "../../routes/supabaseClient";

const AuthSignUp = () => {
  const { state, actions } = useSignUp();
  const { step, formData, loading, checkingEmail, message } = state;
  const { handleChange, handleNextStep, handlePrevStep, handleSignUp } = actions;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {},
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white font-sans selection:bg-cyan-500/30">
      {loading && <LazyLoading status={"Initiating Sequence..."} />}

      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:w-2/5 lg:px-12 xl:px-16 z-20 bg-[#09090b] relative border-r border-white/5 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[-20%] w-[20rem] h-[20rem] bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto w-full max-w-sm relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Get started now.
            </h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-400 font-light tracking-wide uppercase">
                {step === 1 ? "Personal Details" : "Security Setup"}
              </p>
              <div className="flex space-x-1">
                <div
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "bg-gray-700"}`}
                ></div>
                <div
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "bg-gray-700"}`}
                ></div>
              </div>
            </div>
          </div>

          <form className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-300 fade-in">
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="peer block w-full border-b border-gray-600 bg-transparent py-2.5 px-0 text-white placeholder-transparent focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                    placeholder="Full Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text"
                  >
                    Full Name
                  </label>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 peer-focus:w-full"></div>
                </div>

                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="peer block w-full border-b border-gray-600 bg-transparent py-2.5 px-0 text-white placeholder-transparent focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text"
                  >
                    Email Address
                  </label>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 peer-focus:w-full"></div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleNextStep}
                    disabled={checkingEmail}
                    className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold text-black bg-white transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-wait overflow-hidden"
                  >
                    <span className="relative z-10 uppercase tracking-widest flex items-center gap-2">
                      {checkingEmail ? "Checking..." : "Continue"}{" "}
                      <span className="text-lg">→</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in">
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="peer block w-full border-b border-gray-600 bg-transparent py-2.5 px-0 text-white placeholder-transparent focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text"
                  >
                    Create Password
                  </label>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 peer-focus:w-full"></div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Password must have:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { label: "Ít nhất 8 ký tự", test: (pw) => pw.length >= 8 },
                      { label: "Ít nhất 1 chữ hoa", test: (pw) => /[A-Z]/.test(pw) },
                      { label: "Ít nhất 1 chữ thường", test: (pw) => /[a-z]/.test(pw) },
                      { label: "Ít nhất 1 chữ số", test: (pw) => /[0-9]/.test(pw) },
                      { label: "Ít nhất 1 ký tự đặc biệt (!@#$%^&*)", test: (pw) => /[!@#$%^&*]/.test(pw) },
                    ].map((rule, idx) => {
                      const isMet = rule.test(formData.password);
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className={`h-1 w-1 rounded-full ${isMet ? "bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "bg-gray-700"}`}
                          ></div>
                          <span
                            className={`text-[11px] leading-none transition-colors ${isMet ? "text-cyan-400" : "text-gray-500"}`}
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="peer block w-full border-b border-gray-600 bg-transparent py-2.5 px-0 text-white placeholder-transparent focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                    placeholder="Confirm Password"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-0 -top-3.5 text-xs text-gray-400 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text"
                  >
                    Confirm Password
                  </label>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-500 peer-focus:w-full"></div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/3 flex justify-center py-3.5 px-4 text-sm font-bold text-gray-400 border border-gray-700 hover:border-white hover:text-white transition-all uppercase tracking-widest"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSignUp}
                    disabled={
                      loading ||
                      ![
                        (pw) => pw.length >= 8,
                        (pw) => /[A-Z]/.test(pw),
                        (pw) => /[a-z]/.test(pw),
                        (pw) => /[0-9]/.test(pw),
                        (pw) => /[!@#$%^&*]/.test(pw),
                      ].every((test) => test(formData.password))
                    }
                    className="flex-1 group relative flex justify-center py-3.5 px-4 text-sm font-bold text-black bg-white transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 uppercase tracking-widest">
                      {loading ? "Processing..." : "Complete"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`text-sm py-2 px-3 border-l-2 ${message.type === "error" ? "border-red-500 text-red-400 bg-red-500/5" : "border-green-500 text-green-400 bg-green-500/5"} animate-pulse`}
              >
                {message.text}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center text-xs text-gray-500 font-medium">
              <Link
                to="/signin"
                className="hover:text-cyan-400 transition-colors uppercase"
              >
                Already a member?
              </Link>
              <Link
                to="/"
                className="hover:text-cyan-400 transition-colors uppercase"
              >
                Back Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 w-full h-full bg-[#050505]">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-20 z-10">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_12s_linear_infinite]"></div>
            <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_18s_linear_infinite_reverse]"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
              <h2 className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter drop-shadow-2xl text-center leading-tight">
                JOIN THE
                <br />
                NETWORK
              </h2>
              <div className="mt-6 flex items-center space-x-3">
                <span
                  className={`text-sm font-bold ${step === 1 ? "text-cyan-400" : "text-gray-600"}`}
                >
                  01
                </span>
                <div className="h-[1px] w-12 bg-gray-700">
                  <div
                    className={`h-full bg-cyan-400 transition-all duration-500 ${step === 2 ? "w-full" : "w-0"}`}
                  ></div>
                </div>
                <span
                  className={`text-sm font-bold ${step === 2 ? "text-cyan-400" : "text-gray-600"}`}
                >
                  02
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignUp;
