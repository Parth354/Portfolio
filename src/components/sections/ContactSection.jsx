import React from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className="scroll-section contact-section relative flex items-center justify-center min-h-screen text-white px-6"
    >
      {/* Glowing container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-2xl w-full bg-black/50 backdrop-blur-xl border border-cyan-400/40 
        rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(0,200,255,0.5)]"
        role="region"
        aria-label="Contact"
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-wide mb-4 drop-shadow-[0_0_12px_rgba(0,200,255,0.8)]">
          📡 Contact
        </h2>

        {/* Subtext */}
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
          End of the journey — the starship arrives. <br />
          Let’s build something <span className="text-cyan-300 font-semibold">together</span>.
        </p>

        {/* Social media links with logos */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {/* Email */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:parthbajaj05@gmail.com"
            className="text-white hover:text-cyan-400 transition-colors"
            aria-label="Email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href="https://linkedin.com/in/parth3544"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/+919315036427?text=Hi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors"
            aria-label="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </motion.a>

          {/* Instagram */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/parthb3544"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
            </svg>
          </motion.a>

          {/* X (Twitter) */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href="https://x.com/_parthbajaj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition-colors"
            aria-label="X (Twitter)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.261 8.503 11.24H16.12l-5.21-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.714 6.237L18.244 2.25zm-2.99 15.602l-1.558-.876 1.558.876zm-5.694-8.83L12.592 11h2.247L9.58 3.75H6.162l4.94 7.562-4.94 7.561h3.31zm3.877 7.037L12.592 11l-2.247 3.488L18.244 2.25z"/>
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
