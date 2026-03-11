import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function FounderPortal() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Founder Dashboard</h1>
        <p className="text-gray-500 text-lg">Manage your application and track investor interest.</p>
      </div>

      {/* Application Status */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Application Status</h2>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Under Review
          </span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-accent w-1/2 h-full rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-500">Step 2 of 4</span>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Our team is currently reviewing your pitch deck. We will reach out if we need more information.
        </p>
      </div>

      {/* Document Uploads */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Required Materials</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-accent transition cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-semibold text-primary">Pitch Deck</p>
                <p className="text-xs text-gray-500">PDF, max 20MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-highlight text-sm font-medium">
              <CheckCircle size={16} /> Uploaded
            </div>
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between hover:border-accent transition cursor-pointer bg-gray-50 hover:bg-white group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition">
                <Upload size={20} />
              </div>
              <div>
                <p className="font-semibold text-primary">Financial Model</p>
                <p className="text-xs text-gray-500">XLSX or PDF, max 10MB</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition">
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
