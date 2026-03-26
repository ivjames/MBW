import { createElement } from '../primitives/element.js';

export function ContactForm() {
  const form = createElement('form', {
    className: 'contact-form card reveal',
    attrs: {
      id: 'contactForm',
      method: 'post',
      action: '/api/contact',
      novalidate: 'novalidate'
    }
  });

  form.innerHTML = `
    <div class="form-intro">
      <div class="eyebrow">Project inquiry</div>
      <h3 class="card-title">Tell us what you need.</h3>
      <p class="card-copy">This demo submits JSON to a small Node backend and logs the payload to the server console.</p>
    </div>

    <div class="form-grid">
      <label class="form-field">
        <span class="form-label">Name</span>
        <input class="form-input" type="text" name="name" autocomplete="name" required />
      </label>

      <label class="form-field">
        <span class="form-label">Email</span>
        <input class="form-input" type="email" name="email" autocomplete="email" required />
      </label>

      <label class="form-field">
        <span class="form-label">Company</span>
        <input class="form-input" type="text" name="company" autocomplete="organization" />
      </label>

      <label class="form-field">
        <span class="form-label">Phone</span>
        <input class="form-input" type="tel" name="phone" autocomplete="tel" />
      </label>

      <label class="form-field">
        <span class="form-label">Service</span>
        <select class="form-input" name="service">
          <option value="">Select a service</option>
          <option>Marketing</option>
          <option>Development</option>
          <option>Web Design</option>
          <option>SEO Optimisation</option>
          <option>Ecommerce</option>
          <option>Branding</option>
        </select>
      </label>

      <label class="form-field">
        <span class="form-label">Budget</span>
        <select class="form-input" name="budget">
          <option value="">Select a budget</option>
          <option>$2k–$5k</option>
          <option>$5k–$10k</option>
          <option>$10k–$25k</option>
          <option>$25k+</option>
        </select>
      </label>

      <label class="form-field form-field-hidden" aria-hidden="true">
        <span class="form-label">Website</span>
        <input class="form-input" type="text" name="website" tabindex="-1" autocomplete="off" />
      </label>

      <label class="form-field form-field-full">
        <span class="form-label">Message</span>
        <textarea class="form-input form-textarea" name="message" rows="6" required></textarea>
      </label>
    </div>

    <div class="form-actions">
      <button class="button button-primary" type="submit">Send message</button>
      <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
    </div>
  `;

  return form;
}
