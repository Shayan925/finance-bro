import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DollarSign, TrendingUp, Shield, Target } from 'lucide-react';

interface InvestmentProfile {
  age: number;
  riskTolerance: number; // 1-10
  investmentGoal: string;
  timeHorizon: string;
  initialInvestment: number;
  monthlyContribution: number;
  preferredAssetTypes: string[];
}

interface InvestmentPanelProps {
  onSubmit: (profile: InvestmentProfile) => void;
  isLoading?: boolean;
}

const INVESTMENT_GOALS = [
  'Retirement Planning',
  'Wealth Growth',
  'Income Generation',
  'Capital Preservation',
  'Tax Efficiency'
];

const TIME_HORIZONS = [
  'Short-term (1-3 years)',
  'Medium-term (3-7 years)',
  'Long-term (7+ years)'
];

const ASSET_TYPES = [
  'Stocks',
  'Bonds',
  'Real Estate',
  'Cryptocurrency',
  'Commodities',
  'Cash'
];

export function InvestmentPanel({ onSubmit, isLoading = false }: InvestmentPanelProps) {
  const [profile, setProfile] = useState<Partial<InvestmentProfile>>({
    riskTolerance: 5,
    preferredAssetTypes: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidProfile(profile)) {
      onSubmit(profile as InvestmentProfile);
    }
  };

  const isValidProfile = (profile: Partial<InvestmentProfile>): profile is InvestmentProfile => {
    return !!(
      profile.age &&
      profile.riskTolerance &&
      profile.investmentGoal &&
      profile.timeHorizon &&
      profile.initialInvestment &&
      profile.monthlyContribution &&
      profile.preferredAssetTypes?.length
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Investment Profile
          <Target className="w-5 h-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Age Input */}
          <div className="space-y-1">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
              required
              className="h-8"
            />
          </div>

          {/* Risk Tolerance Slider */}
          <div className="space-y-1">
            <Label>Risk Tolerance</Label>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <Slider
                value={[profile.riskTolerance || 5]}
                onValueChange={([value]) => setProfile({ ...profile, riskTolerance: value })}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="w-8 text-center">{profile.riskTolerance}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Investment Goal Select */}
          <div className="space-y-1">
            <Label>Investment Goal</Label>
            <Select
              value={profile.investmentGoal}
              onValueChange={(value) => setProfile({ ...profile, investmentGoal: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select your investment goal" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_GOALS.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Horizon Select */}
          <div className="space-y-1">
            <Label>Time Horizon</Label>
            <Select
              value={profile.timeHorizon}
              onValueChange={(value) => setProfile({ ...profile, timeHorizon: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select your time horizon" />
              </SelectTrigger>
              <SelectContent>
                {TIME_HORIZONS.map((horizon) => (
                  <SelectItem key={horizon} value={horizon}>
                    {horizon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Investment Input */}
          <div className="space-y-1">
            <Label htmlFor="initialInvestment">Initial Investment</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="initialInvestment"
                type="number"
                min="0"
                step="1000"
                value={profile.initialInvestment || ''}
                onChange={(e) => setProfile({ ...profile, initialInvestment: parseFloat(e.target.value) })}
                className="pl-8 h-8"
                required
              />
            </div>
          </div>

          {/* Monthly Contribution Input */}
          <div className="space-y-1">
            <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="monthlyContribution"
                type="number"
                min="0"
                step="100"
                value={profile.monthlyContribution || ''}
                onChange={(e) => setProfile({ ...profile, monthlyContribution: parseFloat(e.target.value) })}
                className="pl-8 h-8"
                required
              />
            </div>
          </div>

          {/* Preferred Asset Types */}
          <div className="space-y-1">
            <Label>Preferred Asset Types</Label>
            <div className="grid grid-cols-2 gap-1">
              {ASSET_TYPES.map((asset) => (
                <Button
                  key={asset}
                  type="button"
                  variant={profile.preferredAssetTypes?.includes(asset) ? "default" : "outline"}
                  onClick={() => {
                    const current = profile.preferredAssetTypes || [];
                    const updated = current.includes(asset)
                      ? current.filter((a) => a !== asset)
                      : [...current, asset];
                    setProfile({ ...profile, preferredAssetTypes: updated });
                  }}
                  className="h-7 text-xs"
                >
                  {asset}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-7 text-xs" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Recommendations...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                <span>Generate Recommendations</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 