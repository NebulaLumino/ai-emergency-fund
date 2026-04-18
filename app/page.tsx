'use client'

import React, { useState } from 'react';

export default function HomePage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accentColor = "hsl(45, 80%, 50%)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result || data.output || JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const textColor = 'rgba(255,255,255,0.85)';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'}}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>AI Emergency Fund Planner</h1>
          <p className="text-sm" style={{ color: textColor }}>
            Fill in the fields below and click Generate to get your personalized output.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div>
            <label htmlFor="monthly_expenses" className="block text-sm font-medium mb-1" style={{color: textColor}}>Monthly expenses ($)</label>
            <input
              id="monthly_expenses"
              name="monthly_expenses"
              type="text"
              value={form["monthly_expenses"] || ""}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2.5 text-sm bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-offset-1"
              placeholder="Enter monthly expenses ($)"
            />
          </div>
          <div>
            <label htmlFor="income_stability" className="block text-sm font-medium mb-1" style={{color: textColor}}>Job income stability</label>
            <input
              id="income_stability"
              name="income_stability"
              type="text"
              value={form["income_stability"] || ""}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2.5 text-sm bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-offset-1"
              placeholder="Enter job income stability"
            />
          </div>
          <div>
            <label htmlFor="dependents" className="block text-sm font-medium mb-1" style={{color: textColor}}>Number of dependents</label>
            <input
              id="dependents"
              name="dependents"
              type="text"
              value={form["dependents"] || ""}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2.5 text-sm bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-offset-1"
              placeholder="Enter number of dependents"
            />
          </div>
          <div>
            <label htmlFor="health_factors" className="block text-sm font-medium mb-1" style={{color: textColor}}>Health/risk factors</label>
            <input
              id="health_factors"
              name="health_factors"
              type="text"
              value={form["health_factors"] || ""}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2.5 text-sm bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-offset-1"
              placeholder="Enter health/risk factors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-xl py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: accentColor }}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm text-red-300 bg-red-900/30 border border-red-500/30">
              {error}
            </div>
          )}
        </form>

        {result && (
          <div className="mt-6 rounded-2xl p-6 border border-white/10 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: accentColor }}>Generated Output</h3>
            <div className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: textColor }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
