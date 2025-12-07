
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { subject: '1', A: 120, B: 110, fullMark: 150 },
  { subject: '2', A: 98, B: 130, fullMark: 150 },
  { subject: '3', A: 86, B: 130, fullMark: 150 },
  { subject: '4', A: 99, B: 100, fullMark: 150 },
  { subject: '5', A: 85, B: 90, fullMark: 150 },
  { subject: '6', A: 65, B: 85, fullMark: 150 },
  { subject: '7', A: 85, B: 90, fullMark: 150 },
  { subject: '8', A: 90, B: 95, fullMark: 150 },
  { subject: '9', A: 100, B: 110, fullMark: 150 },
  { subject: '10', A: 110, B: 120, fullMark: 150 },
  { subject: '11', A: 100, B: 100, fullMark: 150 },
];

const CompetencyRadar: React.FC = () => {
  return (
    <div className="w-full h-[300px] bg-slate-900 rounded-xl relative overflow-hidden">
      {/* Background gradient simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
      
      <div className="relative z-10 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            
            {/* Target Competency */}
            <Radar
              name="Target"
              dataKey="B"
              stroke="#60A5FA"
              strokeWidth={2}
              fill="#60A5FA"
              fillOpacity={0.1}
            />
             {/* Current Competency */}
            <Radar
              name="Current"
              dataKey="A"
              stroke="#F87171"
              strokeWidth={2}
              fill="#F87171"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompetencyRadar;
