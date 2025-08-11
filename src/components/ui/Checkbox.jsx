import React from "react";

import { cn } from "../../utils/cn";

export const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  error, 
  required = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className={`mt-0.5 h-4 w-4 text-primary focus:ring-primary border-border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-destructive' : ''
          } ${className}`}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label className="text-sm text-foreground cursor-pointer">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive ml-7">{error}</p>
      )}
    </div>
  );
};

// Checkbox Group component
const CheckboxGroup = React.forwardRef(({
    className,
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    ...props
}, ref) => {
    return (
        <fieldset
            ref={ref}
            disabled={disabled}
            className={cn("space-y-3", className)}
            {...props}
        >
            {label && (
                <legend className={cn(
                    "text-sm font-medium",
                    error ? "text-destructive" : "text-foreground"
                )}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </legend>
            )}

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            <div className="space-y-2">
                {children}
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </fieldset>
    );
});

CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };