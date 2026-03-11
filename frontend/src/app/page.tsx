import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-3xl">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-semibold tracking-wide uppercase mb-6 text-primary/70">
          Private Market Dealflow
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary">
          Selective Access to Institutional-Grade Opportunities
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10">
          A private community connecting exceptional founders with aligned investors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/investor" className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition shadow-md">
            Join as Investor
          </Link>
          <Link href="/dashboard/founder" className="px-8 py-3 border border-gray-300 text-primary rounded-lg font-medium hover:border-primary transition bg-white shadow-sm">
            Submit Your Startup
          </Link>
        </div>
      </div>
    </div>
  );
}
