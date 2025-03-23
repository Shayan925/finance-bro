import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StockData {
  date: string;
  price: number;
  ma20?: number;
  ma50?: number;
}

interface StockChartProps {
  data: StockData[];
  symbol: string;
  showMA20?: boolean;
  showMA50?: boolean;
}

export function StockChart({ data, symbol, showMA20 = true, showMA50 = true }: StockChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{symbol} Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                name="Price"
              />
              {showMA20 && (
                <Line
                  type="monotone"
                  dataKey="ma20"
                  stroke="#82ca9d"
                  name="20-day MA"
                />
              )}
              {showMA50 && (
                <Line
                  type="monotone"
                  dataKey="ma50"
                  stroke="#ffc658"
                  name="50-day MA"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 