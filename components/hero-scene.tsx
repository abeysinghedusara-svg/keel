"use client";

import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icons";

export function HeroScene() {
  const reduced = useReducedMotion();
  return (
    <div
      className="hero-scene"
      aria-label="Illustration of a calm, organised working day"
    >
      <div className="scene-grid" />
      <div className="scene-orbit orbit-one" />
      <div className="scene-orbit orbit-two" />
      <div className="scene-caption">
        <span className="tiny-dot" /> THE SHAPE OF A CALMER DAY
      </div>
      <motion.div
        className="workspace"
        initial={false}
        animate={reduced ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: 0, ease: "easeInOut" }}
      >
        <div className="workspace-top">
          <span className="workspace-monogram">K</span>
          <span>YOUR WORKDAY, IN ORDER</span>
          <span className="window-dots">•••</span>
        </div>
        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <span className="small-label">A LITTLE MORE CLARITY</span>
              <h3>Good morning.</h3>
            </div>
            <div className="calendar-date">
              <small>TODAY</small>
              <Icon name="calendar" size={24} />
            </div>
          </div>
          <div className="workspace-divider" />
          {[
            ["Inbox organised", "Urgent items flagged", "mail"],
            ["Drafts prepared", "Ready for your review", "document"],
            ["Deadlines tracked", "Everything in its place", "calendar"],
          ].map(([title, text, icon], i) => (
            <motion.div
              key={title}
              className="workspace-task"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.18 + 0.8 }}
            >
              <span className="task-icon">
                <Icon
                  name={icon as "mail" | "document" | "calendar"}
                  size={19}
                />
              </span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
              <span className="task-check">
                <Icon name="check" size={13} />
              </span>
            </motion.div>
          ))}
          <div className="workspace-foot">
            <span className="tiny-dot" /> A dedicated person. A clear head.
          </div>
        </div>
      </motion.div>
      <motion.div
        className="scene-note"
        initial={false}
        animate={reduced ? {} : { y: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: 0, ease: "easeInOut" }}
      >
        <span className="note-check">
          <Icon name="check" size={17} />
        </span>
        <div>
          <strong>Handled, with care.</strong>
          <small>You focus on what’s next.</small>
        </div>
      </motion.div>
      <div className="scene-bottom">
        <span>YOUR PEOPLE. OUR SUPPORT.</span>
        <svg viewBox="0 0 115 22" aria-hidden="true">
          <path d="M1 11C25-9 39 31 58 11S92-9 114 11" />
        </svg>
      </div>
    </div>
  );
}
