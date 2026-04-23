import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OrganicBackground } from "./organic-background";

const FONTS = [
  "Caveat",
  "Cedarville Cursive",
  "Indie Flower",
  "Nothing You Could Do",
  "Oooh Baby",
  "Reenie Beanie",
  "Shadows Into Light",
];

const BLACKLIST: Record<string, string[]> = {
  l: ["Cedarville Cursive", "Oooh Baby", "Nothing You Could Do"],
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function HandwrittenText({ text, seed = 12 }: { text: string; seed?: number }) {
  const lastUsed: Record<string, string> = {};
  let currentSeed = seed;

  const spans = Array.from(text).map((char, i) => {
    const lowerChar = char.toLowerCase();
    let available = FONTS;

    if (BLACKLIST[lowerChar]) {
      available = available.filter((f) => !BLACKLIST[lowerChar].includes(f));
    }
    if (lastUsed[lowerChar]) {
      available = available.filter((f) => f !== lastUsed[lowerChar]);
    }

    const fontIndex = Math.floor(seededRandom(currentSeed) * available.length);
    const font = available[fontIndex] || FONTS[0];
    lastUsed[lowerChar] = font;
    currentSeed++;

    return (
      <span key={i} style={{ fontFamily: `"${font}", cursive` }}>
        {char}
      </span>
    );
  });

  return <>{spans}</>;
}

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const uaData = (navigator as any).userAgentData;
    setIsMac(
      /Mac/i.test(platform) ||
      /Macintosh|Mac OS/i.test(ua) ||
      uaData?.platform === 'macOS'
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleToggleDark = useCallback(() => {
    if (isAnimating.current || !imgRef.current) return;
    isAnimating.current = true;

    const nextDark = !isDark;
    const nextSrc = nextDark ? "/screenshot.png" : "/screenshot-light.png";
    const img = imgRef.current;

    // Preload the next image
    const preload = new Image();
    preload.src = nextSrc;

    // Phase 1: blur up like misty glass
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(img, {
      filter: "blur(20px) saturate(0.6) brightness(0.8)",
      scale: 1.04,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => {
        // Swap everything instantly at peak blur
        setIsDark(nextDark);
        img.src = nextSrc;
      },
    });

    // Phase 2: unblur — the mist clears
    tl.to(img, {
      filter: "blur(0px) saturate(1) brightness(1)",
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [isDark]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleDialogOpenChange(nextOpen: boolean) {
    setIsDialogOpen(nextOpen);
    if (!nextOpen) {
      setHasSubmitted(false);
    }
  }

  async function handleWorkspaceSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      workEmail: String(formData.get("workEmail") ?? ""),
      companyName: String(formData.get("companyName") ?? ""),
      companySize: String(formData.get("companySize") ?? ""),
      role: String(formData.get("role") ?? ""),
      usage: String(formData.get("usage") ?? ""),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxr5zZyNt_TnTIw49pwbQ8bdhhnkz63QhpCTJqj546J9uO_0kEWI11cko2Efk6yINBM/exec";
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        mode: "no-cors",
      });

      setHasSubmitted(true);
    } catch (error) {
      setSubmitError("Something went wrong. Try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-neutral-950 text-neutral-100 selection:bg-white selection:text-neutral-900"
          : "text-neutral-900 selection:bg-neutral-900 selection:text-white"
      }`}
      style={{
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col space-y-32 px-6 py-20">
        <div className="flex flex-col space-y-14">
          <div className="space-y-6">
            <h1 className="text-3xl leading-tight tracking-tight" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 500 }}>Rōmy</h1>
            <p className={isDark ? "text-neutral-400" : "text-neutral-500"}>
              Rōmy helps small nonprofits find new major donors at a fraction of
              the cost of existing solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="gap-1.5"
                onClick={() =>
                  window.open(
                    "https://intel.getromy.app",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-4"
                >
                  <path
                    d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </Button>
              <DialogRoot
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
              >
                <DialogTrigger
                  render={(props) => (
                    <Button size="md" variant="secondary" {...props}>
                      Enterprise Access{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="128"
                        height="128"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-4"
                      >
                        <path
                          d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </Button>
                  )}
                />
                <DialogContent>
                  <DialogTitle>
                    {hasSubmitted ? "We'll be in touch" : "Enterprise Access"}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    {hasSubmitted
                      ? "Thanks. Our team will reach out shortly to get you set up."
                      : "Dedicated onboarding, custom integrations, and priority support for your organization."}
                  </DialogDescription>
                  <DialogClose aria-label="Close">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                    >
                      <path
                        d="M5 5l10 10M15 5L5 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </DialogClose>
                  {hasSubmitted ? (
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" onClick={() => setIsDialogOpen(false)}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <form
                      className="mt-5 grid gap-3"
                      onSubmit={handleWorkspaceSubmit}
                    >
                      <label className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                        Work email
                        <Input
                          placeholder="you@organization.org"
                          type="email"
                          required
                          name="workEmail"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                        Organization
                        <Input placeholder="Organization name" required name="companyName" />
                      </label>
                      <label className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                        Notes
                        <Textarea
                          placeholder="Anything you'd like us to know"
                          name="usage"
                          className="!min-h-[80px]"
                        />
                      </label>
                      {submitError ? (
                        <p className="text-sm text-neutral-500">
                          {submitError}
                        </p>
                      ) : null}
                      <div className="mt-1 flex justify-end">
                        <Button size="sm" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Submitting..." : "Get in touch"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </DialogRoot>
            </div>
          </div>

          <div className="relative">
            {/* Handwritten arrow pointing at the image */}
            <div
              className="pointer-events-none absolute -top-12 right-4 z-20 flex flex-col items-center sm:-top-16 sm:right-12"
              style={{
                fontFamily: '"Gloria Hallelujah", cursive',
                fontSize: "0.875rem",
                color: isDark ? "#ffffff" : "#000000",
              }}
            >
              <span
                className="whitespace-nowrap pl-4 sm:pl-12"
                style={{ rotate: "6deg", opacity: 0.75 }}
              >
                Click Me
              </span>
              <svg
                viewBox="0 0 122 97"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 w-[40px]"
                style={{ rotate: "190deg", opacity: 0.65 }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M116.102 0.0996005C114.952 0.334095 112.7 1.53002 111.433 2.53834C110.869 2.98388 109.368 4.15635 108.077 5.11778C103.455 8.6352 102.61 9.40903 102.187 10.4877C101.39 12.5982 102.798 14.5914 105.097 14.5914C106.13 14.5914 108.241 13.7941 109.696 12.8561C110.424 12.3871 111.01 12.0823 111.01 12.1526C111.01 12.692 107.796 17.8274 106.2 19.8206C102.023 25.0733 95.6642 29.6928 86.2548 34.2889C81.0926 36.8214 77.4555 38.2753 73.9123 39.2367C71.7066 39.823 70.6507 39.9871 67.9053 40.0809C66.0516 40.1513 64.5499 40.1747 64.5499 40.1278C64.5499 40.0809 64.808 38.9788 65.1365 37.6891C65.465 36.3993 65.8404 34.1716 66.0047 32.7647C66.4505 28.3796 65.4884 24.2994 63.4704 22.2359C62.1564 20.8758 60.9363 20.3599 59.0121 20.3599C57.6043 20.3599 57.1115 20.4537 55.7975 21.1103C52.8878 22.5407 50.5648 25.9878 49.5089 30.4197C48.453 34.922 49.2742 38.0877 52.3481 41.1127C53.4744 42.2148 54.46 42.9183 55.9852 43.6921C57.1584 44.2549 58.1439 44.7473 58.1909 44.7708C58.5898 45.0053 54.5304 53.4705 52.0666 57.6211C47.4674 65.3125 39.3486 74.575 30.5728 82.0789C22.2427 89.2309 16.7285 92.4435 9.87677 94.1553C8.28116 94.554 7.13138 94.6478 4.2452 94.6478C1.17131 94.6712 0.608154 94.7181 0.608154 95.023C0.608154 95.234 1.19478 95.5857 2.13337 95.9609C3.54126 96.4768 3.96363 96.5472 7.41296 96.5237C10.5572 96.5237 11.4724 96.4299 13.1149 96.0078C21.7265 93.6863 31.1594 87.1908 42.6102 75.7006C49.2977 69.0175 52.5828 64.9373 56.1494 58.9343C58.0501 55.7217 60.6312 50.6801 61.7575 47.9365L62.5553 45.9902L64.0806 46.1543C71.3547 46.9047 77.7136 45.3101 88.3667 40.034C96.2274 36.1414 101.976 32.3426 106.505 28.0748C108.617 26.0816 111.855 22.2828 112.794 20.7117C113.028 20.313 113.286 19.9847 113.357 19.9847C113.427 19.9847 113.662 20.782 113.873 21.72C114.084 22.6814 114.647 24.276 115.093 25.2609C115.82 26.8085 116.008 27.043 116.454 26.9727C116.876 26.9258 117.228 26.4333 117.956 24.9795C119.317 22.2828 119.833 20.2661 120.772 13.8879C121.757 7.25168 121.781 4.4143 120.889 2.56179C119.95 0.615488 118.12 -0.322489 116.102 0.0996005ZM60.7016 25.7767C61.4525 26.9023 61.8279 29.2942 61.6637 31.9205C61.4759 34.7813 60.5139 38.9788 60.0681 38.9788C59.5284 38.9788 57.1584 37.6422 56.2198 36.8214C54.8354 35.6021 54.3426 34.2889 54.5538 32.2957C54.8589 29.2473 56.1964 26.2223 57.5808 25.3547C58.7306 24.6512 60.0681 24.8388 60.7016 25.7767Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div
              className="relative cursor-pointer rounded-[12px] overflow-hidden"
              onClick={handleToggleDark}
            >
              <OrganicBackground isDark={isDark} />
              <div className="relative z-10 p-5 sm:p-8">
                <img
                  ref={imgRef}
                  alt="Rōmy interface preview"
                  className="block w-full rounded-[6px] select-none will-change-[filter,transform]"
                  src={isDark ? "/screenshot.png" : "/screenshot-light.png"}
                  style={{
                    boxShadow: isDark
                      ? `0px 0px 0px 1px rgba(255,255,255,0.06),
                         0px 8px 24px 0px rgba(0, 0, 0, 0.4),
                         0px 0px 80px 0px rgba(255, 255, 255, 0.03)`
                      : `0px 0px 0px 1px rgba(0,0,0,0.08),
                         0px 8px 12px 0px rgba(0, 0, 0, 0.12),
                         0px 24px 48px 0px rgba(0, 0, 0, 0.16)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Features + Story Section */}
        <div className="relative">
          <div
            className="pointer-events-none absolute -top-16 left-4 z-20 flex flex-col items-center sm:-top-20 sm:left-8"
            style={{
              fontFamily: '"Gloria Hallelujah", cursive',
              fontSize: "0.875rem",
              color: isDark ? "#ffffff" : "#000000",
            }}
          >
            <span
              className="whitespace-nowrap pr-6 sm:pr-10"
              style={{ rotate: "-5deg", opacity: 0.75 }}
            >
              Know More
            </span>
            <svg
              viewBox="0 0 122 97"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 w-[40px]"
              style={{ transform: "rotate(170deg) scaleX(-1)", opacity: 0.65 }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M116.102 0.0996005C114.952 0.334095 112.7 1.53002 111.433 2.53834C110.869 2.98388 109.368 4.15635 108.077 5.11778C103.455 8.6352 102.61 9.40903 102.187 10.4877C101.39 12.5982 102.798 14.5914 105.097 14.5914C106.13 14.5914 108.241 13.7941 109.696 12.8561C110.424 12.3871 111.01 12.0823 111.01 12.1526C111.01 12.692 107.796 17.8274 106.2 19.8206C102.023 25.0733 95.6642 29.6928 86.2548 34.2889C81.0926 36.8214 77.4555 38.2753 73.9123 39.2367C71.7066 39.823 70.6507 39.9871 67.9053 40.0809C66.0516 40.1513 64.5499 40.1747 64.5499 40.1278C64.5499 40.0809 64.808 38.9788 65.1365 37.6891C65.465 36.3993 65.8404 34.1716 66.0047 32.7647C66.4505 28.3796 65.4884 24.2994 63.4704 22.2359C62.1564 20.8758 60.9363 20.3599 59.0121 20.3599C57.6043 20.3599 57.1115 20.4537 55.7975 21.1103C52.8878 22.5407 50.5648 25.9878 49.5089 30.4197C48.453 34.922 49.2742 38.0877 52.3481 41.1127C53.4744 42.2148 54.46 42.9183 55.9852 43.6921C57.1584 44.2549 58.1439 44.7473 58.1909 44.7708C58.5898 45.0053 54.5304 53.4705 52.0666 57.6211C47.4674 65.3125 39.3486 74.575 30.5728 82.0789C22.2427 89.2309 16.7285 92.4435 9.87677 94.1553C8.28116 94.554 7.13138 94.6478 4.2452 94.6478C1.17131 94.6712 0.608154 94.7181 0.608154 95.023C0.608154 95.234 1.19478 95.5857 2.13337 95.9609C3.54126 96.4768 3.96363 96.5472 7.41296 96.5237C10.5572 96.5237 11.4724 96.4299 13.1149 96.0078C21.7265 93.6863 31.1594 87.1908 42.6102 75.7006C49.2977 69.0175 52.5828 64.9373 56.1494 58.9343C58.0501 55.7217 60.6312 50.6801 61.7575 47.9365L62.5553 45.9902L64.0806 46.1543C71.3547 46.9047 77.7136 45.3101 88.3667 40.034C96.2274 36.1414 101.976 32.3426 106.505 28.0748C108.617 26.0816 111.855 22.2828 112.794 20.7117C113.028 20.313 113.286 19.9847 113.357 19.9847C113.427 19.9847 113.662 20.782 113.873 21.72C114.084 22.6814 114.647 24.276 115.093 25.2609C115.82 26.8085 116.008 27.043 116.454 26.9727C116.876 26.9258 117.228 26.4333 117.956 24.9795C119.317 22.2828 119.833 20.2661 120.772 13.8879C121.757 7.25168 121.781 4.4143 120.889 2.56179C119.95 0.615488 118.12 -0.322489 116.102 0.0996005ZM60.7016 25.7767C61.4525 26.9023 61.8279 29.2942 61.6637 31.9205C61.4759 34.7813 60.5139 38.9788 60.0681 38.9788C59.5284 38.9788 57.1584 37.6422 56.2198 36.8214C54.8354 35.6021 54.3426 34.2889 54.5538 32.2957C54.8589 29.2473 56.1964 26.2223 57.5808 25.3547C58.7306 24.6512 60.0681 24.8388 60.7016 25.7767Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className={`overflow-hidden rounded-[12px] shadow-2xs outline-1 ${isDark ? 'outline-neutral-800' : 'outline-neutral-950/10'}`}>
          <div className={`grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x ${isDark ? 'divide-neutral-800' : 'divide-neutral-950/10'}`}>
            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-amber-500">
                  <path d="M17 17L21 21"/>
                  <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"/>
                </svg>
                <h3 className="font-[450]">Donor Discovery</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Surface high-potential donors with AI-powered prospect research. Wealth indicators, giving history, and affinity signals — unified in a single search.
              </p>
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-emerald-500">
                  <path d="M17.9583 8.38889C17.9583 6.24111 15.2907 4.5 12 4.5C8.7093 4.5 6.04167 6.24111 6.04167 8.38889C6.04167 10.5367 7.66667 11.7222 12 11.7222C16.3333 11.7222 18.5 12.8333 18.5 15.6111C18.5 18.3889 15.5899 19.5 12 19.5C8.41015 19.5 5.5 17.7589 5.5 15.6111"/>
                  <path d="M12.5 2.5V4.21M12.5 21.5V19.79"/>
                </svg>
                <h3 className="font-[450]">Fraction of the Cost</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                No enterprise contracts or per-seat licensing. Rōmy delivers the donor intelligence that used to cost tens of thousands — at a price built for small nonprofits.
              </p>
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="size-4 shrink-0 text-violet-500">
                  <path d="M8.62814 12.6736H8.16918C6.68545 12.6736 5.94358 12.6736 5.62736 12.1844C5.31114 11.6953 5.61244 11.0138 6.21504 9.65083L8.02668 5.55323C8.57457 4.314 8.84852 3.69438 9.37997 3.34719C9.91142 3 10.5859 3 11.935 3H14.0244C15.6632 3 16.4826 3 16.7916 3.53535C17.1007 4.0707 16.6942 4.78588 15.8811 6.21623L14.8092 8.10188C14.405 8.81295 14.2029 9.16849 14.2057 9.45952C14.2094 9.83775 14.4105 10.1862 14.7354 10.377C14.9854 10.5239 15.3927 10.5239 16.2074 10.5239C17.2373 10.5239 17.7523 10.5239 18.0205 10.7022C18.3689 10.9338 18.5513 11.3482 18.4874 11.7632C18.4382 12.0826 18.0918 12.4656 17.399 13.2317L11.8639 19.3523C10.7767 20.5545 10.2331 21.1556 9.86807 20.9654C9.50303 20.7751 9.67833 19.9822 10.0289 18.3962L10.7157 15.2896C10.9826 14.082 11.1161 13.4782 10.7951 13.0759C10.4741 12.6736 9.85877 12.6736 8.62814 12.6736Z"/>
                </svg>
                <h3 className="font-[450]">Ready to Act On</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Every prospect comes with context you can use today. Connection points, giving capacity, and outreach angles — not just raw data dumps.
              </p>
            </div>
          </div>

          <div className={`p-5 md:p-8 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-950/10'}`}>
            <div className="max-w-lg space-y-4">
              <h2 className="text-xl font-[450] tracking-tight">Ready to find your next major donor?</h2>
              <p className={`leading-relaxed text-pretty ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Join the nonprofits that have switched to a faster, more affordable way to discover donors. Fundraising intelligence built for small teams.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                {isMac && (
                  <Button
                    className="gap-2"
                    onClick={() =>
                      window.open(
                        "https://github.com/GetRomy-App/web/releases/download/v1.0.0/Romy.dmg",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                      <path d="M12 4v12m0 0l-4-4m4 4l4-4"/>
                    </svg>
                    Download for macOS · v1.0.0
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="gap-1.5"
                  onClick={() =>
                    window.open(
                      "https://intel.getromy.app",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Visit Site
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="size-4">
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>
              {isMac && (
                <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  macOS 12+ required.{' '}
                  <a href="https://github.com/GetRomy-App/web/releases" target="_blank" rel="noopener noreferrer" className={isDark ? 'underline hover:text-neutral-400' : 'underline hover:text-neutral-600'}>
                    Browse all releases on GitHub.
                  </a>
                </p>
              )}
            </div>
          </div>
          </div>
        </div>
      </main>
      <footer
        className={`flex w-full items-center justify-center gap-3 px-4 pt-10 pb-6 text-center text-sm font-medium ${isDark ? "text-neutral-500" : "text-neutral-400"} sm:px-0`}
        style={{ pointerEvents: "auto" }}
      >
        <span>
          <span>©{new Date().getFullYear()}</span>{" "}
          <a
            href="https://getromy.app"
            target="_blank"
            rel="noopener noreferrer"
            className={isDark ? "text-neutral-500 hover:text-neutral-100" : "text-neutral-400 hover:text-neutral-900"}
          >
            GetRomy LLC
          </a>
        </span>
      </footer>
    </div>
  );
}
