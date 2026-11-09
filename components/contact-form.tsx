"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";

export function ContactForm() {
  const [prepared, setPrepared] = useState(false);
  const [emailHref, setEmailHref] = useState(
    "mailto:hello@keeltalentgroup.com",
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Discovery call — ${data.get("firm") || data.get("name")}`;
    const body = `Hello Keel Talent,\n\nI would like to discuss support for my firm.\n\nName: ${data.get("name")}\nFirm: ${data.get("firm") || "Not provided"}\nEmail: ${data.get("email")}\n\n${data.get("message") || "I would like to arrange a 30-minute discovery call."}\n`;
    const href = `mailto:hello@keeltalentgroup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailHref(href);
    setPrepared(true);
    window.location.href = href;
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <h3>Let’s find your right person.</h3>
      <p>Tell us a little about your firm. We’ll take it from there.</p>
      <div className="form-grid">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            placeholder="Alex Morgan"
            maxLength={120}
          />
        </label>
        <label>
          Firm name
          <input
            name="firm"
            autoComplete="organization"
            placeholder="Your firm"
            maxLength={160}
          />
        </label>
        <label className="full-width">
          Work email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="alex@yourfirm.com"
            maxLength={254}
          />
        </label>
        <label className="full-width">
          Where could you use a hand?
          <textarea
            name="message"
            rows={3}
            placeholder="A little about your workload, team, or the support you need…"
            maxLength={3000}
          />
        </label>
      </div>
      <button className="button button-navy" type="submit">
        Start the conversation <Icon name="arrow" size={18} />
      </button>
      <small className="form-note">
        Opens your email app with your enquiry ready to send.
      </small>
      {prepared && (
        <p role="status" className="form-status">
          Your email draft is ready. Send it from your email app to complete
          your enquiry. <a href={emailHref}>Open the draft again</a>, or email{" "}
          <a href="mailto:hello@keeltalentgroup.com">
            hello@keeltalentgroup.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
