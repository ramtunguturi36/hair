import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaChartLine, FaUpload } from 'react-icons/fa';
import { api } from '../utils/api';

interface TrendItem {
  name: string;
  count: number;
}

interface BeforeAfterItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  notes: string;
  date: string;
}

interface ProgressResponse {
  trends: TrendItem[];
  timeline: { date: string; result: string }[];
  beforeAfter: BeforeAfterItem[];
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProgressPage: React.FC = () => {
  const { user } = useUser();
  const [data, setData] = useState<ProgressResponse>({ trends: [], timeline: [], beforeAfter: [] });
  const [loading, setLoading] = useState(true);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const maxTrend = useMemo(() => Math.max(1, ...data.trends.map(t => t.count)), [data.trends]);

  const loadData = async () => {
    if (!user) return;
    try {
      const response = await api.get<ProgressResponse>(`/api/progress/${user.id}`);
      setData(response);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const submitBeforeAfter = async () => {
    if (!user || !beforeFile || !afterFile) return;
    try {
      const beforeImage = await fileToDataUrl(beforeFile);
      const afterImage = await fileToDataUrl(afterFile);
      await api.post('/api/progress/before-after', {
        userId: user.id,
        beforeImage,
        afterImage,
        notes,
      });
      setBeforeFile(null);
      setAfterFile(null);
      setNotes('');
      await loadData();
    } catch (error) {
      console.error('Failed to save before/after:', error);
    }
  };

  return (
    <div className="dash-page">
      <h2 className="dash-title dash-section-gap flex items-center gap-3">
        <FaChartLine className="text-indigo-600" /> Progress Tracker
      </h2>

      <div className="grid lg:grid-cols-2 gap-8 dash-section-gap">
        <div className="dash-card-strong">
          <h3 className="dash-card-title mb-4">Trend by Hair Type</h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : data.trends.length === 0 ? (
            <p className="text-gray-500">No trend data yet. Complete a few analyses first.</p>
          ) : (
            <div className="space-y-3">
              {data.trends.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${(item.count / maxTrend) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-card-strong">
          <h3 className="dash-card-title mb-4">Upload Before / After</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Before photo</label>
              <input type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files?.[0] || null)} className="block w-full mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">After photo</label>
              <input type="file" accept="image/*" onChange={e => setAfterFile(e.target.files?.[0] || null)} className="block w-full mt-1" />
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes: shedding reduced, scalp calmer, etc."
              className="w-full border border-gray-200 rounded-lg p-3 min-h-[90px]"
            />
            <button
              onClick={submitBeforeAfter}
              disabled={!beforeFile || !afterFile}
              className="dash-btn-primary disabled:opacity-50"
            >
              <FaUpload /> Save Snapshot
            </button>
          </div>
        </div>
      </div>

      <div className="dash-card-strong">
        <h3 className="dash-card-title mb-4">Before / After Gallery</h3>
        {data.beforeAfter.length === 0 ? (
          <p className="text-gray-500">No before/after entries yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {data.beforeAfter.map(entry => (
              <div key={entry.id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-3">{new Date(entry.date).toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-3">
                  <img src={entry.beforeImage} alt="Before" className="w-full h-40 object-cover rounded-lg" />
                  <img src={entry.afterImage} alt="After" className="w-full h-40 object-cover rounded-lg" />
                </div>
                {entry.notes && <p className="text-sm text-gray-700 mt-3">{entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
