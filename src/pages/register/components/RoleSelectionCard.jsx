import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ role, onClick }) => {
  if (!role) return null;

  return (
    <div
      onClick={() => onClick?.(role?.id)}
      className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md border-border bg-card`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-muted text-muted-foreground">
        <Icon name={role?.icon} size={24} />
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{role?.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{role?.description}</p>
      
      {/* Features */}
      {role?.features && (
        <ul className="space-y-2">
          {role?.features?.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm">
              <Icon name="Check" size={14} className="text-success flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Restricted Badge */}
      {role?.restricted && (
        <div className="absolute top-4 right-4">
          <div className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
            Restricted
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionCard;