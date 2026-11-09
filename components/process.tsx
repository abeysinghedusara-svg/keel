"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { steps } from "@/lib/content";
import { Icon } from "@/components/icons";

const ease = [0.22, 1, 0.36, 1] as const;
function ProcessIllustration({
  kind,
}: {
  kind: (typeof steps)[number]["kind"];
}) {
  const reduced = useReducedMotion();
  const appear = (delay: number) => ({
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: {
      delay: reduced ? 0 : delay,
      duration: reduced ? 0 : 0.6,
      ease,
    },
  });
  if (kind === "discovery")
    return (
      <div className="process-art discovery-art" aria-hidden="true">
        <motion.div className="chat-bubble chat-one" {...appear(0.1)}>
          <span className="avatar-mini">YOU</span>
          <span>Here’s where we need help.</span>
        </motion.div>
        <motion.div className="chat-bubble chat-two" {...appear(0.6)}>
          <span className="avatar-mini keel-mini">K</span>
          <span>Let’s find your right person.</span>
        </motion.div>
        <div className="brief-tags">
          {["Workload", "Tools", "Hours"].map((text, i) => (
            <motion.span key={text} {...appear(1 + i * 0.22)}>
              <Icon name="check" size={11} />
              {text}
            </motion.span>
          ))}
        </div>
      </div>
    );
  if (kind === "shortlist")
    return (
      <div className="process-art shortlist-art" aria-hidden="true">
        <div className="candidate-stack">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`candidate candidate-${i}`}
              initial={{ opacity: reduced ? 1 : 0, x: 0, rotate: 0 }}
              whileInView={{
                opacity: 1,
                x: (i - 1) * 62,
                rotate: (i - 1) * 10,
              }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                delay: reduced ? 0 : 0.25 + i * 0.15,
                duration: reduced ? 0 : 0.8,
                ease,
              }}
            >
              <span className="candidate-avatar">
                <Icon name="person" size={25} />
              </span>
              <strong>Candidate 0{i + 1}</strong>
              <div className="profile-rule" />
              <div className="profile-rule short" />
              {i === 1 && (
                <motion.span className="selected-seal" {...appear(1.1)}>
                  <Icon name="check" size={13} />
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
        <motion.span className="art-footnote" {...appear(1.2)}>
          A shortlist. Your choice.
        </motion.span>
      </div>
    );
  if (kind === "onboarding")
    return (
      <div className="process-art onboarding-art" aria-hidden="true">
        <svg
          className="connection-lines"
          viewBox="0 0 300 160"
          preserveAspectRatio="none"
        >
          {["M55 45L150 80", "M245 45L150 80", "M150 135L150 80"].map(
            (d, i) => (
              <motion.path
                key={d}
                d={d}
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: reduced ? 0 : 0.45 + i * 0.3,
                  duration: reduced ? 0 : 0.6,
                }}
              />
            ),
          )}
        </svg>
        <motion.div className="tool-node tool-document" {...appear(0.1)}>
          <Icon name="document" />
          <span>Documents</span>
        </motion.div>
        <motion.div className="tool-node tool-calendar" {...appear(0.4)}>
          <Icon name="calendar" />
          <span>Calendar</span>
        </motion.div>
        <motion.div className="tool-node tool-mail" {...appear(0.7)}>
          <Icon name="mail" />
          <span>Your tools</span>
        </motion.div>
        <motion.div className="tool-center" {...appear(0.1)}>
          <Icon name="person" size={25} />
          <span className="connected-check">
            <Icon name="check" size={10} />
          </span>
        </motion.div>
      </div>
    );
  return (
    <div className="process-art support-art" aria-hidden="true">
      <div className="daily-note">
        <div className="daily-note-top">
          <span>YOUR DAILY UPDATE</span>
          <motion.span className="sent-label" {...appear(1.5)}>
            Sent <Icon name="check" size={10} />
          </motion.span>
        </div>
        {[
          "Drafts ready for review",
          "Case files updated",
          "Tomorrow, planned",
        ].map((text, i) => (
          <motion.div
            key={text}
            className="daily-task"
            {...appear(0.2 + i * 0.38)}
          >
            <motion.span
              className="daily-check"
              initial={{ scale: reduced ? 1 : 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduced ? 0 : 0.45 + i * 0.38 }}
            >
              <Icon name="check" size={11} />
            </motion.span>
            {text}
          </motion.div>
        ))}
        <div className="daily-progress">
          <motion.i
            initial={{ scaleX: reduced ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduced ? 0 : 1.5,
              delay: reduced ? 0 : 0.3,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const [replay, setReplay] = useState(0);
  return (
    <article className="process-card">
      <div className="process-card-top">
        <span className="step-number">0{index + 1}</span>
        <span className="step-time">{step.time}</span>
      </div>
      <div className="art-container">
        <ProcessIllustration key={replay} kind={step.kind} />
        <button
          type="button"
          className="replay-button"
          onClick={() => setReplay((n) => n + 1)}
          aria-label={`Replay ${step.title} animation`}
        >
          <Icon name="replay" size={13} />
        </button>
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <div className="process-note">
        <span />
        {step.note}
      </div>
    </article>
  );
}

export function Process() {
  return (
    <div className="process-grid">
      {steps.map((step, index) => (
        <ProcessCard key={step.kind} step={step} index={index} />
      ))}
    </div>
  );
}
