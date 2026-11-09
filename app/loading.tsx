export default function Loading() {
  return (
    <div className="route-loading" role="status">
      <span aria-hidden="true">K</span>
      <p>FINDING OUR EVEN KEEL</p>
      <div className="intro-track" aria-hidden="true">
        <i />
      </div>
      <span className="sr-only">Loading Keel Talent…</span>
    </div>
  );
}
