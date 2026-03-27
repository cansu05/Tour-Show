'use client';

import {MenuItem, Select, Stack, Typography} from '@mui/material';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {LOCALES, LOCALE_LABELS} from '@/constants/locales';

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tCommon = useTranslations('common');

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
      <Typography variant="body2" color="text.secondary" sx={{fontWeight: 600}}>
        {tCommon('language')}
      </Typography>
      <Select
        size="small"
        value={currentLocale}
        onChange={(event) => router.replace(pathname, {locale: event.target.value})}
        aria-label={tCommon('language')}
        sx={{
          minWidth: 88,
          bgcolor: 'background.paper',
          borderRadius: 2,
          '& .MuiSelect-select': {py: 1, fontWeight: 700}
        }}
      >
        {LOCALES.map((locale) => (
          <MenuItem key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
