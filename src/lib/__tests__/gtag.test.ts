import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  GOOGLE_TAG_ID,
  safeGtag,
  pageview,
  event,
  trackConversion,
  trackPurchase,
  trackBeginCheckout,
  trackLead,
  trackWhatsAppClick,
} from '../gtag';

describe('Google Tag (gtag.js) Utility Suite', () => {
  const originalWindow = (globalThis as any).window;
  const originalDocument = (globalThis as any).document;

  beforeEach(() => {
    const mockWindow: any = {
      dataLayer: [],
      gtag: vi.fn(),
    };
    const mockDocument: any = {
      title: 'Safari Bookings | Yala Diary',
    };

    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).window = originalWindow;
    (globalThis as any).document = originalDocument;
  });

  it('has the correct Google Tag account ID', () => {
    expect(GOOGLE_TAG_ID).toBe('AW-18528445589');
  });

  it('safeGtag calls window.gtag if present', () => {
    safeGtag('config', 'AW-18528445589', { page_path: '/test' });
    expect(window.gtag).toHaveBeenCalledWith('config', 'AW-18528445589', { page_path: '/test' });
  });

  it('safeGtag pushes arguments to dataLayer if window.gtag is not yet initialized', () => {
    delete (window as any).gtag;
    safeGtag('event', 'lead_form');
    expect(window.dataLayer?.length).toBe(1);
    expect(window.dataLayer?.[0]).toEqual(['event', 'lead_form']);
  });

  it('safeGtag does not throw if window is undefined (SSR environment)', () => {
    delete (globalThis as any).window;
    expect(() => safeGtag('event', 'test_ssr')).not.toThrow();
  });

  it('pageview sends config command with correct url and page title', () => {
    window.document = { title: 'Safari Bookings | Yala Diary' } as any;
    pageview('/book');
    expect(window.gtag).toHaveBeenCalledWith('config', 'AW-18528445589', {
      page_path: '/book',
      page_title: 'Safari Bookings | Yala Diary',
    });
  });

  it('event dispatches custom actions correctly', () => {
    event('select_package', { package_id: 'pkg-1', price: 120 });
    expect(window.gtag).toHaveBeenCalledWith('event', 'select_package', {
      package_id: 'pkg-1',
      price: 120,
    });
  });

  it('trackConversion dispatches Google Ads conversion with account ID fallback', () => {
    trackConversion(undefined, { value: 250, currency: 'USD', transaction_id: 'tx_999' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-18528445589',
      value: 250,
      currency: 'USD',
      transaction_id: 'tx_999',
    });
  });

  it('trackConversion supports custom conversion labels', () => {
    trackConversion('AW-18528445589/PurchaseLabel', { value: 300 });
    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-18528445589/PurchaseLabel',
      value: 300,
    });
  });

  it('trackPurchase triggers both GA purchase and Google Ads conversion events', () => {
    trackPurchase({
      transactionId: 'sess_12345',
      value: 450,
      currency: 'USD',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'purchase', {
      transaction_id: 'sess_12345',
      value: 450,
      currency: 'USD',
      items: undefined,
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-18528445589',
      transaction_id: 'sess_12345',
      value: 450,
      currency: 'USD',
    });
  });

  it('trackBeginCheckout dispatches begin_checkout with payload', () => {
    trackBeginCheckout({
      value: 180,
      currency: 'USD',
      packageName: 'Full Day Leopard Safari',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'begin_checkout', {
      value: 180,
      currency: 'USD',
      package_name: 'Full Day Leopard Safari',
      items: [{ item_name: 'Full Day Leopard Safari', price: 180 }],
    });
  });

  it('trackLead dispatches generate_lead and conversion', () => {
    trackLead({
      method: 'whatsapp',
      label: 'WhatsApp chat clicked',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      method: 'whatsapp',
      value: undefined,
      currency: 'USD',
      event_label: 'WhatsApp chat clicked',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-18528445589',
      event_category: 'Lead',
      event_label: 'whatsapp:WhatsApp chat clicked',
    });
  });

  it('trackWhatsAppClick sends lead conversion event for WhatsApp', () => {
    trackWhatsAppClick('floating_widget');
    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      method: 'whatsapp',
      value: undefined,
      currency: 'USD',
      event_label: 'WhatsApp Chat from floating_widget',
    });
  });
});
