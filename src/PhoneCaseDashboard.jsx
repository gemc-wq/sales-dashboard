import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = { UK: '#06b6d4', US: '#2563eb', chart: ['#3b82f6', '#06b6d4', '#f59e0b', '#f97316', '#8b5cf6', '#ec4899', '#0ea5e9', '#a855f7'] };

const PHONE_CASE_TYPES = ['HC', 'HTPCR', 'HB401', 'HLBWH', 'HB6CR', 'HB7BK', 'HHYBK', 'FHTPCR', 'FHC'];

// Fallback data for local development
const fallbackData = {
    summary: {
        total_units: 12217,
        uk_units: 4823,
        us_units: 7394,
        uk_sales: 92560,
        us_sales: 160890,
        unique_skus: 8450
    },
    territory: [
        { country: "UK", currency: "GBP", units: 4823, sales: 92560, unique_skus: 3520 },
        { country: "US", currency: "USD", units: 7394, sales: 160890, unique_skus: 5680 }
    ],
    product_types_comparison: [
        { product_type: "HTPCR", UK: 2050, US: 4372, total: 6422, description: "Tough Phone Case Regular" },
        { product_type: "HLBWH", UK: 1301, US: 1000, total: 2301, description: "Leather Book Wallet" },
        { product_type: "HC", UK: 704, US: 1028, total: 1732, description: "Hard Case" },
        { product_type: "HB401", UK: 163, US: 494, total: 657, description: "Hybrid Bumper 401" },
        { product_type: "FHTPCR", UK: 20, US: 413, total: 433, description: "Folio Tough Case" },
        { product_type: "HB6CR", UK: 114, US: 259, total: 373, description: "Hybrid Bumper 6 Clear" },
        { product_type: "HB7BK", UK: 35, US: 150, total: 185, description: "Hybrid Bumper 7 Black" },
        { product_type: "FHC", UK: 9, US: 107, total: 116, description: "Folio Hard Case" },
        { product_type: "HHYBK", UK: 12, US: 45, total: 57, description: "Hybrid Black" }
    ],
    devices_comparison: [
        { device: "IPH16", UK: 240, US: 416, total: 656 },
        { device: "IPH14", UK: 292, US: 342, total: 634 },
        { device: "IPH15", UK: 238, US: 372, total: 610 },
        { device: "IPH17PMAX", UK: 78, US: 528, total: 606 },
        { device: "IPH13", UK: 265, US: 294, total: 559 },
        { device: "IPH17", UK: 123, US: 381, total: 504 },
        { device: "IPH12", UK: 233, US: 221, total: 454 },
        { device: "IPHSE4", UK: 108, US: 304, total: 412 },
        { device: "IPH16PMAX", UK: 64, US: 321, total: 385 },
        { device: "IPH11", UK: 202, US: 176, total: 378 },
        { device: "IPH17PRO", UK: 64, US: 305, total: 369 },
        { device: "S938U", UK: 128, US: 219, total: 347 },
        { device: "S24U", UK: 95, US: 198, total: 293 },
        { device: "S23U", UK: 88, US: 187, total: 275 },
        { device: "PIX9", UK: 45, US: 165, total: 210 }
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
        { design_parent: "AFCKIT25", UK: 156, US: 63, total: 219 }
    ],
    top_skus: [
        { sku: "HTPCR-IPH16-NARUICO-AKA", UK: 45, US: 189, total: 234 },
        { sku: "HTPCR-IPH17PMAX-PNUTSNF", UK: 32, US: 156, total: 188 },
        { sku: "HTPCR-IPH15-DRGBSUSC-GOK", UK: 28, US: 145, total: 173 },
        { sku: "HC-IPH14-LFCKIT25-HOM", UK: 141, US: 10, total: 151 },
        { sku: "HLBWH-IPH16-HPOTDH37", UK: 67, US: 78, total: 145 },
        { sku: "HTPCR-IPH17-PNUTBOA-XOX", UK: 19, US: 118, total: 137 },
        { sku: "HB401-IPH16PMAX-GMORGRA", UK: 22, US: 98, total: 120 },
        { sku: "HTPCR-S938U-NARUCHA", UK: 15, US: 95, total: 110 }
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-indigo-50">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading phone case data...</p>
        </div>
    </div>
);

export default function PhoneCaseDashboard({ customData, dateRange = 'January 2026' }) {
    const [data, setData] = useState(customData || fallbackData);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Use customData if provided, otherwise use fallback
        setData(customData || fallbackData);
    }, [customData]);

    if (!data) return null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'products', label: 'Case Types' },
        { id: 'devices', label: 'Devices' },
        { id: 'designs', label: 'Designs' },
        { id: 'skus', label: 'Top SKUs' }
    ];

    const pieData = [
        { name: 'UK', value: data.summary.uk_units, color: COLORS.UK },
        { name: 'US', value: data.summary.us_units, color: COLORS.US }
    ];

    const productPieData = data.product_types_comparison.slice(0, 6).map((item, idx) => ({
        name: item.product_type,
        value: item.total,
        color: COLORS.chart[idx]
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">📱</span>
                            <h1 className="text-3xl font-bold text-gray-900">Phone Case Dashboard</h1>
                        </div>
                        <p className="text-gray-500">UK & US Performance • {dateRange}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Product Types: {PHONE_CASE_TYPES.join(', ')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span> UK
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> US
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard title="Total Units" value={formatNumber(data.summary.total_units)} subtitle="Phone Cases" color="#1f2937" />
                    <StatCard title="UK Units" value={formatNumber(data.summary.uk_units)} subtitle={formatCurrency(data.summary.uk_sales, 'GBP')} color="#7c3aed" />
                    <StatCard title="US Units" value={formatNumber(data.summary.us_units)} subtitle={formatCurrency(data.summary.us_sales, 'USD')} color="#2563eb" />
                    <StatCard title="UK Share" value={`${((data.summary.uk_units / data.summary.total_units) * 100).toFixed(1)}%`} subtitle="of total units" color="#7c3aed" />
                    <StatCard title="US Share" value={`${((data.summary.us_units / data.summary.total_units) * 100).toFixed(1)}%`} subtitle="of total units" color="#2563eb" />
                    <StatCard title="Case Types" value="9" subtitle="Product types" color="#7c3aed" />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
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

                        {/* Product Type Distribution */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Type Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={productPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {productPieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatNumber(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Territory Cards */}
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
                                            <p className="text-sm text-gray-400">{t.currency} • Phone Cases</p>
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
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Types: UK vs US Units Sold</h3>
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart data={data.product_types_comparison} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" tickFormatter={formatNumber} />
                                    <YAxis dataKey="product_type" type="category" width={80} tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Product Type Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.product_types_comparison.slice(0, 6).map((item, idx) => (
                                <div key={item.product_type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.chart[idx] }}></div>
                                        <h4 className="font-bold text-gray-800">{item.product_type}</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                        <div className="bg-gray-50 rounded p-2">
                                            <p className="font-bold text-gray-800">{formatNumber(item.total)}</p>
                                            <p className="text-xs text-gray-400">Total</p>
                                        </div>
                                        <div className="bg-cyan-50 rounded p-2">
                                            <p className="font-bold text-cyan-600">{formatNumber(item.UK)}</p>
                                            <p className="text-xs text-gray-400">UK</p>
                                        </div>
                                        <div className="bg-blue-50 rounded p-2">
                                            <p className="font-bold text-blue-600">{formatNumber(item.US)}</p>
                                            <p className="text-xs text-gray-400">US</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Devices Tab */}
                {activeTab === 'devices' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 15 Devices for Phone Cases</h3>
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
                            <div className="bg-cyan-50 rounded-lg p-3">
                                <p className="font-semibold text-cyan-800">🇬🇧 UK Top: IPH14 (292), IPH13 (265), IPH16 (240)</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="font-semibold text-blue-800">🇺🇸 US Top: IPH17PMAX (528), IPH16 (416), IPH17 (381)</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Designs Tab */}
                {activeTab === 'designs' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Designs for Phone Cases</h3>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart data={data.design_parents_comparison} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" tickFormatter={formatNumber} />
                                <YAxis dataKey="design_parent" type="category" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="UK" fill={COLORS.UK} radius={[0, 4, 4, 0]} />
                                <Bar dataKey="US" fill={COLORS.US} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-cyan-50 rounded-lg p-4">
                                <h4 className="font-semibold text-cyan-800 mb-2">🇬🇧 UK Bestsellers</h4>
                                <ul className="text-sm text-cyan-700 space-y-1">
                                    <li>• LFCKIT25 (283) - Liverpool FC Kit</li>
                                    <li>• AFCKIT25 (156) - Arsenal FC Kit</li>
                                    <li>• PNUTSNF (84) - Peanuts Snoopy</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">🇺🇸 US Bestsellers</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• NARUICO (361) - Naruto Icons</li>
                                    <li>• PNUTSNF (258) - Peanuts Snoopy</li>
                                    <li>• PNUTBOA (247) - Peanuts Boardwalk</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* SKUs Tab */}
                {activeTab === 'skus' && data.top_skus && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Phone Case SKUs</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Rank</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-600">SKU</th>
                                        <th className="text-right py-3 px-4 font-semibold text-cyan-600">UK</th>
                                        <th className="text-right py-3 px-4 font-semibold text-blue-600">US</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-800">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.top_skus.map((sku, idx) => (
                                        <tr key={sku.sku} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-xs">{sku.sku}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-cyan-600">{formatNumber(sku.UK)}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-blue-600">{formatNumber(sku.US)}</td>
                                            <td className="py-3 px-4 text-right font-bold text-gray-800">{formatNumber(sku.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    Phone Case Product Group • Data Source: Amazon Business Reports • January 2026
                </div>
            </div>
        </div>
    );
}
