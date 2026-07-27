"use client";

import Link from "next/link";

export default function HeroLanding() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black text-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="/hero-video.mp4"
      />

      {/* Dark Overlay */}
      <div className="hero-video-overlay absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex flex-row justify-between items-center px-8 py-6 max-w-6xl mx-auto w-full">
        <Link
          href="/"
          className="font-display italic text-2xl tracking-tight text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shortlister
        </Link>
        {/* RECONNECT_ABOUT_START */}
        <span className="text-sm text-white/30 cursor-not-allowed select-none">
          About
        </span>
        {/* RECONNECT_ABOUT_END */}
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 max-w-5xl mx-auto w-full">
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight text-white font-normal italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Every candidate reviewed, <em className="not-italic text-white/60">every decision explained.</em>
        </h1>

        <p className="animate-fade-rise-delay text-white/70 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed mx-auto">
          A staged AI pipeline that narrows thousands of candidates into a ranked shortlist — cheaply, explainably, and with a human always able to step in.
        </p>

        <div className="animate-fade-rise-delay-2 flex flex-wrap items-center justify-center gap-4 mt-12">
          <Link
            href="/apply"
            className="liquid-glass rounded-full px-8 py-4 text-base text-white font-medium hover:scale-[1.03] transition-transform cursor-pointer"
          >
            I&apos;m applying
          </Link>
          <Link
            href="/admin/login"
            className="liquid-glass rounded-full px-8 py-4 text-base text-white font-medium hover:scale-[1.03] transition-transform cursor-pointer"
          >
            I&apos;m reviewing
          </Link>
        </div>
      </div>

      {/* Empty footer space or self-balanced centering wrapper */}
      <div className="relative z-10 w-full h-16 pointer-events-none" />
    </section>
  );
}
