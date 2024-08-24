// src/Components/PriceChart.js
import React, { useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { createChart, LineSeries } from 'lightweight-charts';

const PriceChart = ({ data }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const lineSeries = chart.addLineSeries({
      color: 'rgb(0, 204, 255)',
    });

    lineSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: 'relative', height: '300px', width: '100%' }}
    />
  );
};

export default PriceChart;
