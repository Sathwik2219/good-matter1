export default function AdminDashboard() {
  const pendingStartups = [
    {
      id: 4,
      name: 'NeuroLink',
      industry: 'MedTech',
      founder: 'Sarah Jenkins',
      submitted: 'Oct 24, 2024'
    },
    {
      id: 5,
      name: 'EcoBuild',
      industry: 'PropTech',
      founder: 'David Chen',
      submitted: 'Oct 23, 2024'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Platform Moderation</h1>
        <p className="text-gray-500 text-lg">Review pending startup applications and manage dealflow.</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Investors</p>
          <p className="text-3xl font-bold text-primary">142</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-yellow-400">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Pending Startups</p>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-highlight">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Active Deals</p>
          <p className="text-3xl font-bold text-primary">28</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Intros Requested</p>
          <p className="text-3xl font-bold text-primary">315</p>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-lg text-primary">Pending Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-medium">Startup</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium">Founder</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingStartups.map(startup => (
                <tr key={startup.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">{startup.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary text-gray-600 text-xs font-medium rounded-full">
                      {startup.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{startup.founder}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{startup.submitted}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition">
                      Reject
                    </button>
                    <button className="px-3 py-1.5 bg-highlight/10 text-highlight-hover hover:bg-highlight/20 rounded-md text-sm font-medium transition">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-primary rounded-md text-sm font-medium transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
