const mockStartups = [
  {
    id: 1,
    name: 'Lumina',
    industry: 'Climate Tech',
    stage: 'Seed',
    raise: '$2M',
    description: 'AI-driven energy grid optimization for commercial real estate.'
  },
  {
    id: 2,
    name: 'VoltX',
    industry: 'Fintech',
    stage: 'Series A',
    raise: '$8M',
    description: 'Cross-border B2B payments infrastructure for emerging markets.'
  },
  {
    id: 3,
    name: 'Aura',
    industry: 'Healthcare AI',
    stage: 'Pre-Seed',
    raise: '$750K',
    description: 'Predictive diagnostics platform for early-stage autoimmune detection.'
  }
];

export default function InvestorDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Curated Dealflow</h1>
          <p className="text-gray-500 text-lg">Exclusive opportunities matching your investment focus.</p>
        </div>
        
        {/* Placeholder Filters */}
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium shadow-sm outline-none focus:border-accent">
            <option>All Sectors</option>
            <option>Fintech</option>
            <option>Climate Tech</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium shadow-sm outline-none focus:border-accent">
            <option>All Stages</option>
            <option>Pre-Seed</option>
            <option>Seed</option>
            <option>Series A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStartups.map(startup => (
          <div key={startup.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-heading font-bold text-xl">
                {startup.name.charAt(0)}
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary text-gray-600 text-xs font-medium rounded-full">
                  {startup.industry}
                </span>
                <span className="px-3 py-1 bg-highlight/10 text-highlight-hover text-xs font-medium rounded-full">
                  {startup.stage}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition">{startup.name}</h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2">
              {startup.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Target Raise</p>
                <p className="font-semibold text-primary">{startup.raise}</p>
              </div>
              <button className="px-4 py-2 bg-primary/5 text-primary text-sm font-medium rounded-lg hover:bg-primary/10 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
