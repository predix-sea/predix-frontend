export default function ComplianceBlockedPage() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="rounded-xl border border-predix-danger/40 bg-predix-danger/10 p-8">
        <h1 className="text-2xl font-bold text-predix-danger">Access Restricted</h1>
        <p className="mt-4 text-predix-muted">
          PrediX is not available in mainland China due to regulatory requirements. All trading
          and account features are disabled from your region.
        </p>
        <p className="mt-4 text-sm text-predix-muted">
          If you believe this is an error, contact support with your trace ID from a previous
          session.
        </p>
      </div>
    </div>
  );
}
