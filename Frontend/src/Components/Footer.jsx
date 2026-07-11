const Footer = () => {
  return (
    <footer className="mt-16 border-t border-ink/5 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <span className="font-display text-2xl font-bold text-ink">
              Trigo<span className="text-chili">.</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Fresh food, fast — from the kitchens you trust, straight to your door.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold text-ink">Company</h4>
              <ul className="space-y-1 text-muted">
                <li>About Trigo</li>
                <li>Careers</li>
                <li>Blog</li>
                <li className="pt-1 text-xs text-ink/50">Developed by SASPm</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-ink">For you</h4>
              <ul className="space-y-1 text-muted">
                <li>Help & Support</li>
                <li>Partner with us</li>
                <li>Ride with us</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted">© {new Date().getFullYear()} Trigo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
