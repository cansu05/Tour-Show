'use client';

import {Box, Chip, Stack, Typography} from '@mui/material';
import {useLocale, useTranslations} from 'next-intl';
import type {AppLocale} from '@/constants/locales';
import {formatCategoryLabel} from '@/utils/tour-labels';

type Props = {
  categories: string[];
  value: string | null;
  onChange: (category: string | null) => void;
};

export function CategoryFilters({categories, value, onChange}: Props) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations('home');

  return (
    <Stack spacing={1.15}>
      <Typography variant="h4" sx={{color: 'text.secondary'}}>
        {t('categories')}
      </Typography>
      <Box
        sx={{
          p: 0.6,
          borderRadius: 3,
          bgcolor: 'rgba(236,246,251,0.92)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {display: 'none'}
        }}
      >
        <Stack direction="row" gap={1} sx={{width: 'max-content', minWidth: '100%'}}>
          <Chip
            label={t('allCategories')}
            clickable
            color={value === null ? 'primary' : 'default'}
            variant="filled"
            sx={{
              px: 1.2,
              bgcolor: value === null ? 'primary.main' : 'rgba(255,255,255,0.9)'
            }}
            onClick={() => onChange(null)}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={formatCategoryLabel(category, locale)}
              clickable
              color={value === category ? 'primary' : 'default'}
              variant="filled"
              sx={{
                px: 1.2,
                bgcolor: value === category ? 'primary.main' : 'rgba(255,255,255,0.9)'
              }}
              onClick={() => onChange(category)}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
