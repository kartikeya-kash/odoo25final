import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: pwd?.length >= 8,
      lowercase: /[a-z]/?.test(pwd),
      uppercase: /[A-Z]/?.test(pwd),
      numbers: /\d/?.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/?.test(pwd)
    };

    score = Object.values(checks)?.filter(Boolean)?.length;

    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Very Weak', color: 'text-destructive', bgColor: 'bg-destructive' },
      2: { label: 'Weak', color: 'text-warning', bgColor: 'bg-warning' },
      3: { label: 'Fair', color: 'text-warning', bgColor: 'bg-warning' },
      4: { label: 'Good', color: 'text-success', bgColor: 'bg-success' },
      5: { label: 'Strong', color: 'text-success', bgColor: 'bg-success' }
    };

    return { score, ...strengthLevels?.[score], checks };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5]?.map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-200 ${
              level <= strength?.score
                ? strength?.bgColor
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      {/* Strength Label */}
      {strength?.label && (
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${strength?.color}`}>
            {strength?.label}
          </span>
        </div>
      )}
      {/* Requirements Checklist */}
      <div className="space-y-1">
        {[
          { key: 'length', label: 'At least 8 characters' },
          { key: 'lowercase', label: 'One lowercase letter' },
          { key: 'uppercase', label: 'One uppercase letter' },
          { key: 'numbers', label: 'One number' },
          { key: 'symbols', label: 'One special character' }
        ]?.map((requirement) => (
          <div key={requirement?.key} className="flex items-center space-x-2">
            <Icon
              name={strength?.checks?.[requirement?.key] ? "CheckCircle" : "Circle"}
              size={12}
              className={
                strength?.checks?.[requirement?.key]
                  ? 'text-success' :'text-muted-foreground'
              }
            />
            <span
              className={`text-xs ${
                strength?.checks?.[requirement?.key]
                  ? 'text-success' :'text-muted-foreground'
              }`}
            >
              {requirement?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;