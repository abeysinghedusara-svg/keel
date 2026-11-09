"use client";

import { Accordion } from "@animate-ui/react/primitives/base-ui/accordion";
import { faqs } from "@/lib/content";

export function Faq() {
  return (
    <Accordion.Root className="faq-list" defaultValue={["faq-0"]}>
      {faqs.map(([question, answer], i) => (
        <Accordion.Item key={question} value={`faq-${i}`} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              <span>{question}</span>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="faq-panel">
            <p>{answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
