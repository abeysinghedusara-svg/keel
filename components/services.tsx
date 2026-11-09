"use client";

import { Tabs } from "@animate-ui/react/primitives/base-ui/tabs";
import { services } from "@/lib/content";
import { Icon } from "@/components/icons";

export function Services() {
  return (
    <Tabs.Root defaultValue="legal" className="service-tabs">
      <Tabs.List className="service-tab-list" aria-label="Areas of support">
        {services.map((service) => (
          <Tabs.Tab className="service-tab" key={service.id} value={service.id}>
            {service.label}
            <Icon name="arrow" size={18} />
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {services.map((service) => (
        <Tabs.Panel
          key={service.id}
          value={service.id}
          className="service-panel"
        >
          <div className="service-intro">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <a href="#contact" className="text-link">
              Find your right support <Icon name="arrow" size={17} />
            </a>
          </div>
          <ul className="service-list">
            {service.items.map((item, index) => (
              <li key={item}>
                <span className="list-number">0{index + 1}</span>
                <span>{item}</span>
                <Icon name="check" size={16} />
              </li>
            ))}
          </ul>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
