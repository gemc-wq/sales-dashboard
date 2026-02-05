import { useState, useEffect } from 'react'
import SalesDashboard from './SalesDashboard'
import PhoneCaseDashboard from './PhoneCaseDashboard'
import DataUpload from './DataUpload'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('main')
  const [showUpload, setShowUpload] = useState(false)
  const [customData, setCustomData] = useState(null)
  const [dateRange, setDateRange] = useState('January 2026')

  useEffect(() => {
    // Load stored data from localStorage on mount
    const stored = localStorage.getItem('dashboardData')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCustomData(parsed)
        setDateRange(parsed.dateRange || 'Custom Period')
      } catch (e) {
        console.error('Error loading stored data:', e)
      }
    }
  }, [])

  const handleDataLoaded = (data) => {
    if (data) {
      setCustomData(data)
      setDateRange(data.dateRange || 'Custom Period')
    } else {
      setCustomData(null)
      setDateRange('January 2026')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-800">📊 Sales Analytics</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{dateRange}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('main')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentView === 'main'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              🌍 All Products
            </button>
            <button
              onClick={() => setCurrentView('phoneCases')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${currentView === 'phoneCases'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              📱 Phone Cases
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 rounded-lg font-medium text-sm bg-green-100 text-green-700 hover:bg-green-200 transition-all"
            >
              📤 Upload Data
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content with top padding for fixed nav */}
      <div className="pt-16">
        {currentView === 'main' && <SalesDashboard customData={customData} dateRange={dateRange} />}
        {currentView === 'phoneCases' && <PhoneCaseDashboard customData={customData} dateRange={dateRange} />}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <DataUpload
          onDataLoaded={handleDataLoaded}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}

export default App
