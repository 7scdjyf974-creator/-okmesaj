import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  MessageSquare,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { getAudioContext } from '../utils/soundEngine';

interface AuthOnboardingScreenProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onVerified: (formattedPhone: string) => void;
}

const COUNTRY_CODES = [
  { code: '+90', label: 'Türkiye (+90)' },
  { code: '+49', label: 'Almanya (+49)' },
  { code: '+44', label: 'Birleşik Krallık (+44)' },
  { code: '+1', label: 'ABD / Kanada (+1)' },
  { code: '+31', label: 'Hollanda (+31)' },
];

function formatTurkishPhone(rawDigits: string): string {
  const d = rawDigits.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AuthOnboardingScreen: React.FC<AuthOnboardingScreenProps> = ({
  isDark,
  onToggleTheme,
  onVerified,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+90');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [generatedCode, setGeneratedCode] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSec, setResendSec] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 'otp' || resendSec <= 0) return;
    const t = window.setInterval(() => {
      setResendSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [step, resendSec]);

  const rawDigits = phoneInput.replace(/\D/g, '');
  const fullFormattedPhone = `${countryCode} ${formatTurkishPhone(rawDigits)}`;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getAudioContext();
    if (rawDigits.length < 10) {
      setPhoneError('Lütfen başında 0 olmadan 10 haneli telefon numaranızı girin.');
      return;
    }
    setPhoneError(null);
    const code = generateOtpCode();
    setGeneratedCode(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendSec(45);
    setStep('otp');
    window.setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 80);
  };

  const verifyOtp = (codeAttempt: string) => {
    getAudioContext();
    if (codeAttempt.length < 6) {
      setOtpError('Lütfen 6 haneli doğrulama kodunu eksiksiz girin.');
      return;
    }
    if (codeAttempt !== generatedCode) {
      setOtpError('Doğrulama kodu eşleşmedi. Lütfen kodu kontrol edin.');
      return;
    }
    setOtpError(null);
    setIsVerifying(true);
    window.setTimeout(() => {
      setIsVerifying(false);
      onVerified(fullFormattedPhone);
    }, 500);
  };

  const handleOtpChange = (idx: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...otpDigits];
      next[idx] = '';
      setOtpDigits(next);
      setOtpError(null);
      return;
    }

    // Handle pasting full 6-digit code
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      chars.forEach((c, i) => {
        next[i] = c;
      });
      setOtpDigits(next);
      setOtpError(null);
      const focusIdx = Math.min(5, chars.length);
      otpRefs.current[focusIdx]?.focus();
      if (chars.length === 6) {
        verifyOtp(next.join(''));
      }
      return;
    }

    const next = [...otpDigits];
    next[idx] = clean;
    setOtpDigits(next);
    setOtpError(null);

    if (idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    } else {
      const joined = next.join('');
      if (joined.length === 6) {
        verifyOtp(joined);
      }
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (resendSec > 0) return;
    const code = generateOtpCode();
    setGeneratedCode(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setResendSec(45);
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-[#f4faff] dark:bg-[#0B141A] text-[#0e1d25] dark:text-[#E9EDEF] overflow-y-auto">
      {/* Top Emerald Brand Header */}
      <header className="bg-[#008069] dark:bg-[#1F2C34] text-white h-16 px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:border-b dark:border-[rgba(134,150,160,0.15)] shrink-0">
        <div className="flex items-center gap-3">
          {step === 'otp' && (
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtpError(null);
              }}
              aria-label="Telefon numarası adımına dön"
              className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-[20px] font-semibold tracking-tight whitespace-nowrap">
            İleti
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Açık temaya geç' : 'Karanlık temaya geç'}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Centered Onboarding Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Simulated Incoming SMS Notification Banner on Step 2 */}
        {step === 'otp' && generatedCode && (
          <div className="w-full max-w-md mb-4 p-3.5 rounded-2xl bg-[#D9FDD3] dark:bg-[#005C4B] text-[#0e1d25] dark:text-[#E9EDEF] shadow-sm flex items-center justify-between gap-3 border border-[#008069]/20">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[#006552] dark:text-[#92f5d9]">
                SMS Bildirimi · İleti Doğrulama
              </p>
              <p className="text-[14px] mt-0.5">
                Doğrulama kodunuz:{' '}
                <strong className="font-bold tracking-widest tabular-nums">
                  {generatedCode}
                </strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const chars = generatedCode.split('');
                setOtpDigits(chars);
                setOtpError(null);
                verifyOtp(generatedCode);
              }}
              className="px-3 py-1.5 rounded-full bg-[#008069] dark:bg-[#25D366] text-white text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer hover:opacity-95"
            >
              Kodu Gir
            </button>
          </div>
        )}

        <div className="w-full max-w-md bg-white dark:bg-[#121B22] rounded-2xl shadow-[0_4px_20px_rgba(11,20,26,0.08)] dark:border dark:border-white/10 p-6 sm:p-8">
          {/* Step Progress Indicator */}
          <div className="flex items-center gap-2 mb-6 text-[12px] font-medium text-[#8696A0]">
            <span className="text-[#008069] dark:text-[#25D366] font-semibold">
              {step === 'phone' ? 'Adım 1 / 2' : 'Adım 2 / 2'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{step === 'phone' ? 'Telefon Numarası' : 'SMS Doğrulama'}</span>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <h1 className="text-[22px] font-semibold text-[#111B21] dark:text-[#E9EDEF] leading-7">
                  Telefon numaranızı girin
                </h1>
                <p className="text-[14px] text-[#667781] dark:text-[#8696A0] mt-2 leading-relaxed">
                  İleti hesabınızı doğrulamak için size 6 haneli tek kullanımlık bir SMS kodu göndereceğiz.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="country-select"
                    className="block text-[12px] font-medium text-[#667781] dark:text-[#8696A0] mb-1.5"
                  >
                    Ülke / Bölge
                  </label>
                  <select
                    id="country-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] text-[15px] font-medium text-[#111B21] dark:text-[#E9EDEF] border border-transparent focus:border-[#008069] dark:focus:border-[#25D366] focus:outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="phone-input"
                    className="block text-[12px] font-medium text-[#667781] dark:text-[#8696A0] mb-1.5"
                  >
                    Telefon Numarası
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-3 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] text-[15px] font-semibold text-[#54656F] dark:text-[#aebac1] tabular-nums shrink-0">
                      {countryCode}
                    </span>
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      value={formatTurkishPhone(rawDigits)}
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        setPhoneError(null);
                      }}
                      placeholder="532 123 45 67"
                      className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] text-[16px] font-medium text-[#111B21] dark:text-[#E9EDEF] placeholder:text-[#8696A0] tabular-nums border border-transparent focus:border-[#008069] dark:focus:border-[#25D366] focus:outline-none"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[12.5px] text-[#ba1a1a] dark:text-[#f87171] mt-2">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-[15px] font-semibold shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
              >
                İleri
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#8696A0] pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Mesajlarınız uçtan uca şifrelenir</span>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp(otpDigits.join(''));
              }}
              className="space-y-5"
            >
              <div>
                <h1 className="text-[22px] font-semibold text-[#111B21] dark:text-[#E9EDEF] leading-7">
                  Numaranızı doğrulayın
                </h1>
                <p className="text-[14px] text-[#667781] dark:text-[#8696A0] mt-2 leading-relaxed">
                  <span className="font-semibold text-[#111B21] dark:text-[#E9EDEF] tabular-nums">
                    {fullFormattedPhone}
                  </span>{' '}
                  numarasına gönderilen 6 haneli kodu girin.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtpError(null);
                    }}
                    className="text-[#008069] dark:text-[#25D366] font-medium hover:underline cursor-pointer"
                  >
                    Yanlış numara mı?
                  </button>
                </p>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div>
                <div className="grid grid-cols-6 gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      aria-label={`Doğrulama kodu ${idx + 1}. hane`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`h-13 rounded-xl text-center text-[20px] font-bold tabular-nums bg-[#f0f2f5] dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] border-2 transition-colors focus:outline-none ${
                        otpError
                          ? 'border-[#ba1a1a]'
                          : digit
                          ? 'border-[#008069] dark:border-[#25D366]'
                          : 'border-transparent focus:border-[#008069] dark:focus:border-[#25D366]'
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[12.5px] text-[#ba1a1a] dark:text-[#f87171] mt-2.5">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  disabled={resendSec > 0}
                  onClick={handleResendCode}
                  className={`flex items-center gap-1.5 font-medium ${
                    resendSec > 0
                      ? 'text-[#8696A0] cursor-not-allowed'
                      : 'text-[#008069] dark:text-[#25D366] hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {resendSec > 0
                      ? `Tekrar kod gönder (0:${resendSec.toString().padStart(2, '0')})`
                      : 'Kodu tekrar gönder'}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full h-12 rounded-full bg-[#008069] dark:bg-[#25D366] hover:opacity-95 disabled:opacity-60 text-white text-[15px] font-semibold shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 animate-pulse" />
                    <span>Doğrulanıyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Doğrula ve Başla</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
