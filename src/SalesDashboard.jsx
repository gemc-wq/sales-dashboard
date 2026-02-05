import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = { UK: '#dc2626', US: '#2563eb', chart: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'] };

// Fallback data for local development
const fallbackData = {
  summary: { total_units: 15194, uk_units: 5553, us_units: 9641, uk_sales: 112409, us_sales: 212030, unique_skus: 10761, unique_devices: 285, unique_designs: 1337 },
  territory: [
    { country: "UK", currency: "GBP", units: 5553, sales: 112409, unique_skus: 4290 },
    { country: "US", currency: "USD", units: 9641, sales: 212030, unique_skus: 6875 }
  ],
  product_types_comparison: [
    { product_type: "HTPCR", UK: 2050, US: 4372, total: 6422 },
    { product_type: "HLBWH", UK: 1301, US: 1000, total: 2301 },
    { product_type: "HC", UK: 704, US: 1028, total: 1732 },
    { product_type: "H8939", UK: 546, US: 732, total: 1278 },
    { product_type: "HDMWH", UK: 426, US: 796, total: 1222 },
    { product_type: "HB401", UK: 163, US: 494, total: 657 },
    { product_type: "FHTPCR", UK: 20, US: 413, total: 433 },
    { product_type: "HB6CR", UK: 114, US: 259, total: 373 },
    { product_type: "HB7BK", UK: 35, US: 150, total: 185 },
    { product_type: "FHC", UK: 9, US: 107, total: 116 }
  ],
  devices_comparison: [
    { device: "IPH16", UK: 240, US: 416, total: 656 },
    { device: "IPH14", UK: 292, US: 342, total: 634 },
    { device: "IPH15", UK: 238, US: 372, total: 610 },
    { device: "IPH17PMAX", UK: 78, US: 528, total: 606 },
    { device: "IPH13", UK: 265, US: 294, total: 559 },
    { device: "IPH17", UK: 123, US: 381, total: 504 },
    { device: "600X300X3", UK: 138, US: 364, total: 502 },
    { device: "IPH12", UK: 233, US: 221, total: 454 },
    { device: "IPHSE4", UK: 108, US: 304, total: 412 },
    { device: "900X400X4", UK: 73, US: 314, total: 387 },
    { device: "IPH16PMAX", UK: 64, US: 321, total: 385 },
    { device: "IPH11", UK: 202, US: 176, total: 378 },
    { device: "IPH17PRO", UK: 64, US: 305, total: 369 },
    { device: "S938U", UK: 128, US: 219, total: 347 },
    { device: "250X300X3", UK: 215, US: 121, total: 336 }
  ],
  design_parents_comparison: [
    { design_parent: "NARUICO", UK: 17, US: 361, total: 378 },
    { design_parent: "PNUTSNF", UK: 84, US: 258, total: 342 },
    { design_parent: "LFCKIT25", UK: 283, US: 23, total: 306 },
    { design_parent: "PNUTBOA", UK: 39, US: 247, total: 286 },
    { design_parent: "PNUTHAL", UK: 47, US: 233, total: 280 },
    { design_parent: "DRGBSUSC", UK: 23, US: 243, total: 266 },
    { design_parent: "HPOTGRA", UK: 31, US: 228, total: 259 },
    { design_parent: "PNUTCHA", UK: 37, US: 221, total: 258 },
    { design_parent: "HPOTDH37", UK: 76, US: 169, total: 245 },
    { design_parent: "AFCKIT25", UK: 156, US: 63, total: 219 },
    { design_parent: "NARUCHA", UK: 7, US: 196, total: 203 },
    { design_parent: "HATSGRA", UK: 23, US: 170, total: 193 },
    { design_parent: "HPOTPRI2", UK: 36, US: 140, total: 176 },
    { design_parent: "PNUTGRA", UK: 22, US: 140, total: 162 },
    { design_parent: "FCBCKT8", UK: 4, US: 151, total: 155 }
  ],
  design_children_comparison: [
    { design_child: "PNUTBOA-XOX", UK: 19, US: 200, total: 219 },
    { design_child: "NARUICO-AKA", UK: 9, US: 174, total: 183 },
    { design_child: "DRGBSUSC-GOK", UK: 10, US: 157, total: 167 },
    { design_child: "LFCKIT25-HOM", UK: 141, US: 10, total: 151 },
    { design_child: "FCBCKT8-AWY", UK: 3, US: 135, total: 138 },
    { design_child: "HPOTDH37-HOP", UK: 31, US: 103, total: 134 },
    { design_child: "PNUTCHA-SNO", UK: 17, US: 117, total: 134 },
    { design_child: "PNUTSNF-CLA", UK: 30, US: 88, total: 118 },
    { design_child: "NCFCCKT-HOM", UK: 114, US: 1, total: 115 },
    { design_child: "PNUTSNF-FUN", UK: 14, US: 95, total: 109 },
    { design_child: "FCBKIT25-HOM", UK: 13, US: 88, total: 101 },
    { design_child: "GMORGRA-ICO", UK: 15, US: 82, total: 97 },
    { design_child: "LFCKIT25-LHOM", UK: 93, US: 1, total: 94 },
    { design_child: "HPOTGRA-MAR", UK: 9, US: 84, total: 93 },
    { design_child: "AFCKIT25-HOM", UK: 58, US: 34, total: 92 }
  ]
};

const formatNumber = (num) => num?.toLocaleString() || '0';
const formatCurrency = (value, currency) => `${currency === 'GBP' ? '£' : '$'}${value.toLocaleString()}`;

const StatCard = ({ title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
    <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.fill || entry.color }} className="text-sm">
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading dashboard data...</p>
    </div>
  </div>
);

export default function SalesDashboard({ customData, dateRange = 'January 2026' }) {
  const [data, setData] = useState(customData || fallbackData);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Use customData if provided, otherwise use fallback
    setData(customData || fallbackData);
  }, [customData]);

  if (!data) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Product Types' },
    { id: 'devices', label: 'Devices' },
    { id: 'designs', label: 'Designs' }
  ];

  const pieData = [
    { name: 'UK', value: data.summary.uk_units, color: COLORS.UK },
    { name: 'US', value: data.summary.us_units, color: COLORS.US }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">UK & US Sales Dashboard</h1>
            <p className="text-gray-500 mt-1">{dateRange} Performance Comparison</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> UK
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> US
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total Units" value={formatNumber(data.summary.total_units)} subtitle="Combined" color="#1f2937" />
          <StatCard title="UK Units" value={formatNumber(data.summary.uk_units)} subtitle="£112,409 sales" color="#dc2626" />
          <StatCard title="US Units" value={formatNumber(data.summary.us_units)} subtitle="$212,030 sales" color="#2563eb" />
          <StatCard title="Active SKUs" value={formatNumber(data.summary.unique_skus)} subtitle="Products" color="#9333ea" />
          <StatCard title="Devices" value={formatNumber(data.summary.unique_devices)} subtitle="Supported" color="#ea580c" />
          <StatCard title="Designs" value={formatNumber(data.summary.unique_designs)} subtitle="Unique" color="#db2777" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Territory Pie */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Units by Territory</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Territory Cards */}
            <div className="space-y-4">
              {data.territory.map(t => (
                <div key={t.country} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: COLORS[t.country] }}>
                        {t.country}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{t.country === 'UK' ? 'United Kingdom' : 'United States'}</p>
                        <p className="text-sm text-gray-400">{t.currency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold" style={{ color: COLORS[t.country] }}>{formatNumber(t.units)}</p>
                      <p className="text-xs text-gray-500">Units Sold</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold" style={{ color: COLORS[t.country] }}>{formatCurrency(t.sales, t.currency)}</p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold" style={{ color: COLORS[t.country] }}>{formatNumber(t.unique_skus)}</p>
                      <p className="text-xs text-gray-500">Active SKUs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Product Types Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Types: UK vs US Comparison</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.product_types_comparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="product_type" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="UK" fill={COLORS.UK} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="US" fill={COLORS.US} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Types: UK vs US Units Sold</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data.product_types_comparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="product_type" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="font-semibold text-red-800">UK Top: HTPCR (2,050), HLBWH (1,301), HC (704)</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-800">US Top: HTPCR (4,372), HC (1,028), HLBWH (1,000)</p>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 15 Devices: UK vs US Units Sold</h3>
            <ResponsiveContainer width="100%" height={550}>
              <BarChart data={data.devices_comparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="device" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="font-semibold text-red-800">UK Strongest: IPH14 (292), IPH13 (265), IPH16 (240), IPH15 (238)</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-semibold text-blue-800">US Strongest: IPH17PMAX (528), IPH16 (416), IPH17 (381), IPH15 (372)</p>
              </div>
            </div>
          </div>
        )}

        {/* Designs Tab */}
        {activeTab === 'designs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Design Parents: UK vs US</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data.design_parents_comparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={formatNumber} />
                  <YAxis dataKey="design_parent" type="category" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} stackId="a" />
                  <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Design Children: UK vs US</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data.design_children_comparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={formatNumber} />
                  <YAxis dataKey="design_child" type="category" width={110} tick={{ fontSize: 9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} stackId="a" />
                  <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">🇬🇧 UK Top Designs</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• LFCKIT25 (283) - Liverpool FC Kit</li>
                  <li>• AFCKIT25 (156) - Arsenal FC Kit</li>
                  <li>• NCFCCKT-HOM (114) - Newcastle FC</li>
                  <li>• LFCKIT25-LHOM (93) - Liverpool Leather</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🇺🇸 US Top Designs</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• NARUICO (361) - Naruto Icons</li>
                  <li>• PNUTSNF (258) - Peanuts Snoopy</li>
                  <li>• PNUTBOA (247) - Peanuts Boardwalk</li>
                  <li>• DRGBSUSC (243) - Dragon Ball</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          Data Source: Amazon Business Reports • January 2026 • {formatNumber(data.summary.total_units)} total units across UK & US
        </div>
      </div>
    </div>
  );
}
