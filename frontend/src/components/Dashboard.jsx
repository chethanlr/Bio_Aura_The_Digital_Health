import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ stressData, emotionHistory }) => {
  const getGlowClass = () => {
    if (!stressData) return '';
    if (stressData.state === 'calm') return 'glow-calm';
    if (stressData.state === 'mild') return 'glow-mild';
    return 'glow-high';
  };

  const getStressPercentage = () => {
    return stressData ? (stressData.stress_index * 100).toFixed(1) : 0;
  };

  const chartData = {
    labels: emotionHistory.map((_, idx) => `${idx * 2}s`),
    datasets: [
      {
        label: 'Stress Index',
        data: emotionHistory.map(item => item.stress_index * 100),
        borderColor: stressData?.color || '#3CE38C',
        backgroundColor: `${stressData?.color || '#3CE38C'}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 47, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: stressData?.color || '#3CE38C',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        }
      }
    }
  };

  return (
    <div className="dashboard-container space-y-6">
      <div className={`emotion-display bg-gray-800 p-6 rounded-lg transition-all duration-500 ${getGlowClass()}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Current Status</h2>
          {stressData && (
            <span className="text-4xl pulse-animation">{stressData.emoji}</span>
          )}
        </div>

        {stressData ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-lg">Emotion:</span>
              <span className="text-white text-xl font-semibold capitalize">
                {stressData.face_emotion}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-lg">State:</span>
              <span 
                className="text-xl font-bold capitalize"
                style={{ color: stressData.color }}
              >
                {stressData.state === 'calm' ? 'Calm 😌' : 
                 stressData.state === 'mild' ? 'Mild Stress 😐' : 
                 'High Stress 😫'}
              </span>
            </div>

            <div className="stress-bar-container mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Stress Level</span>
                <span className="font-bold" style={{ color: stressData.color }}>
                  {getStressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${getStressPercentage()}%`,
                    backgroundColor: stressData.color
                  }}
                />
              </div>
            </div>

            <div className="confidence-display mt-4 text-sm text-gray-400">
              <span>Detection Confidence: </span>
              <span className="font-semibold text-white">
                {(stressData.face_confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p className="text-lg">Waiting for analysis...</p>
            <p className="text-sm mt-2">Start the webcam to begin emotion tracking</p>
          </div>
        )}
      </div>

      {emotionHistory.length > 0 && (
        <div className="chart-container bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Stress Timeline</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
