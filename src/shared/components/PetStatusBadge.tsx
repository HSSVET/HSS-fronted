import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle as ActiveIcon,
  MedicalServices as FollowUpIcon,
  Block as DeceasedIcon,
  Archive as ArchivedIcon,
} from '@mui/icons-material';

export type AnimalStatus = 'ACTIVE' | 'FOLLOW_UP' | 'DECEASED' | 'ARCHIVED';

interface PetStatusBadgeProps {
  status: AnimalStatus;
  size?: 'small' | 'medium';
}

const PetStatusBadge: React.FC<PetStatusBadgeProps> = ({ status, size = 'small' }) => {
  const getStatusConfig = (status: AnimalStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Aktif',
          color: 'success' as const,
          icon: <ActiveIcon />,
        };
      case 'FOLLOW_UP':
        return {
          label: 'Takipte',
          color: 'warning' as const,
          icon: <FollowUpIcon />,
        };
      case 'DECEASED':
        return {
          label: 'Ex',
          color: 'error' as const,
          icon: <DeceasedIcon />,
        };
      case 'ARCHIVED':
        return {
          label: 'Arşiv',
          color: 'default' as const,
          icon: <ArchivedIcon />,
        };
      default:
        return {
          label: status,
          color: 'default' as const,
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon || undefined}
      sx={{
        fontWeight: 600,
        '& .MuiChip-icon': {
          fontSize: size === 'small' ? '16px' : '20px',
        },
      }}
    />
  );
};

export default PetStatusBadge;
