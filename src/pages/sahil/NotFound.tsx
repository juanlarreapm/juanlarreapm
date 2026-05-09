import { SahilLayout } from "@/components/sahil/SahilLayout";
import { Link } from "react-router-dom";

const SahilNotFound = () => (
  <SahilLayout>
    <p className="sh-section-label">404</p>
    <h1 className="sh-title mb-6">This page wandered off.</h1>
    <p className="sh-hero">
      Try the <Link to="/" className="sh-link">homepage</Link>, or{" "}
      <a href="mailto:juanlarreapm@gmail.com" className="sh-link">tell me what you were looking for</a>.
    </p>
  </SahilLayout>
);

export default SahilNotFound;
