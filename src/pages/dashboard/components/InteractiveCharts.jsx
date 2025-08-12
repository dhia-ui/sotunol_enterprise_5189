import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveCharts = ({ data = {} }) => {
  const [activeTab, setActiveTab] = useState('transactions');

  const chartTabs = [
    { id: 'transactions', label: 'Transaction Volume', icon: 'Activity' },
    { id: 'pos', label: 'POS Performance', icon: 'MapPin' },
    { id: 'documents', label: 'Document Processing', icon: 'FileText' }
  ];

  const pieColors = ['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-synthwave-lg p-3">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value?.toLocaleString()}
              {entry?.name?.includes('Revenue') && ' TND'}
              {entry?.name?.includes('efficiency') && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTransactionChart = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium text-foreground">Transaction Volume Trends</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="TrendingUp" size={16} />
          <span>7-month trend analysis</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.transactionVolume || []}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#8B5CF6" 
              fillOpacity={1} 
              fill="url(#colorVolume)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPOSChart = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium text-foreground">POS Performance Comparison</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span>Top 5 locations</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.posPerformance || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="location" stroke="#94A3B8" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="transactions" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderDocumentChart = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium text-foreground">Document Processing Analytics</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="FileText" size={16} />
          <span>Processing efficiency by type</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.documentProcessing || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="processed"
                label={({ type, processed }) => `${type}: ${processed}`}
              >
                {(data?.documentProcessing || [])?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors?.[index % pieColors?.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency Metrics */}
        <div className="space-y-4 flex flex-col justify-center">
          {(data?.documentProcessing || [])?.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item?.type}</span>
                <span className="text-sm text-muted-foreground">{item?.efficiency}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item?.efficiency}%`,
                    backgroundColor: pieColors?.[index % pieColors?.length]
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processed: {item?.processed?.toLocaleString()}</span>
                <span>Pending: {item?.pending}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-synthwave p-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center space-x-1 mb-6 border-b border-border">
        {chartTabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            iconSize={16}
            className="mb-4"
          >
            {tab?.label}
          </Button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="min-h-[320px]">
        {activeTab === 'transactions' && renderTransactionChart()}
        {activeTab === 'pos' && renderPOSChart()}
        {activeTab === 'documents' && renderDocumentChart()}
      </div>
    </div>
  );
};

export default InteractiveCharts;