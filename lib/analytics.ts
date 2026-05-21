type AnalyticsEvent =
  | 'login_success'
  | 'login_failed'
  | 'order_submit_success'
  | 'order_submit_failed'
  | 'compliance_block_redirect';

interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, payload ?? {});
  }
  // i18n / third-party analytics hook point
}
