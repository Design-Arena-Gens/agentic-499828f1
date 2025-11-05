'use client';

import { useState } from 'react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState({
    niche: 'motivational quotes',
    uploadsPerDay: 3,
  });

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleManualRun = async () => {
    setIsProcessing(true);
    setLogs([]);
    addLog('Starting manual design generation and upload...');

    try {
      const response = await fetch('/api/generate-and-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: config.niche }),
      });

      const data = await response.json();

      if (data.success) {
        addLog(`✓ Design created: ${data.title}`);
        addLog(`✓ Image generated successfully`);
        addLog(`✓ SEO optimization complete`);
        addLog(`✓ Upload to Redbubble complete`);
      } else {
        addLog(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      addLog(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setIsProcessing(false);
  };

  const handleScheduleAutomation = async () => {
    addLog('Setting up daily automation...');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: config.niche,
          uploadsPerDay: config.uploadsPerDay
        }),
      });

      const data = await response.json();

      if (data.success) {
        addLog(`✓ Automation scheduled: ${config.uploadsPerDay} uploads per day`);
      } else {
        addLog(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      addLog(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-5xl font-bold text-white mb-2">
            🤖 Redbubble Automation Agent
          </h1>
          <p className="text-gray-300 mb-8">
            AI-powered design generation and automated upload system
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">⚙️ Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Design Niche</label>
                  <input
                    type="text"
                    value={config.niche}
                    onChange={(e) => setConfig({ ...config, niche: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., motivational quotes, gaming, cats"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Uploads Per Day</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.uploadsPerDay}
                    onChange={(e) => setConfig({ ...config, uploadsPerDay: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleManualRun}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isProcessing ? '⏳ Processing...' : '🚀 Run Manual Upload'}
                </button>

                <button
                  onClick={handleScheduleAutomation}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                >
                  ⏰ Schedule Daily Automation
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">📊 Features</h2>

              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>AI-powered niche research using Redbubble & Google Trends</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>DALL-E 3 image generation with custom prompts</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>SEO-optimized titles with clickbait strategies</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Keyword-rich descriptions for better ranking</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>13-15 high-ranking tags per design</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Automated Redbubble upload with product selection</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Daily scheduled automation (3-4 uploads/day)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">📝 Activity Log</h2>

            <div className="bg-black/40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-400">No activity yet. Run a manual upload to get started.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-gray-300 mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong>⚠️ Setup Required:</strong> Add your API keys to the environment variables:
              OPENAI_API_KEY, REDBUBBLE_EMAIL, REDBUBBLE_PASSWORD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
