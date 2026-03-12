'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {Button, Dialog, DialogContent, DialogTitle, Paper, Stack, Typography} from '@mui/material';
import {QRCodeSVG} from 'qrcode.react';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import type {AppLocale} from '@/constants/locales';
import {buildTourShareUrl, buildWhatsAppShareUrl} from '@/utils/share-url';

type Props = {
  slug: string;
  title: string;
  locale: AppLocale;
  onFeedback: (msg: string, type: 'success' | 'error') => void;
};

export function ShareActions({slug, title, locale, onFeedback}: Props) {
  const tTour = useTranslations('tour');
  const tShare = useTranslations('share');
  const [openQR, setOpenQR] = useState(false);
  const [runtimeOrigin, setRuntimeOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRuntimeOrigin(window.location.origin);
    }
  }, []);

  const envBaseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').trim();
  const baseUrl = envBaseUrl || runtimeOrigin;
  const shareUrl = baseUrl ? buildTourShareUrl(baseUrl, locale, slug) : `/${locale}/tours/${slug}`;

  const onCopy = async () => {
    if (!navigator.clipboard) {
      onFeedback(tShare('copyFailed'), 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      onFeedback(tShare('copySuccess'), 'success');
    } catch {
      onFeedback(tShare('copyFailed'), 'error');
    }
  };

  const whatsappUrl = buildWhatsAppShareUrl(`${title} - ${tTour('publicPage')}`, shareUrl);

  return (
    <>
      <Stack spacing={1.2}>
        <Button
          startIcon={<ContentCopyIcon />}
          variant="contained"
          onClick={onCopy}
          aria-label={tTour('copyLink')}
          fullWidth
          sx={{minHeight: 52, justifyContent: 'flex-start', px: 2.1, borderRadius: 1.25}}
        >
          {tTour('copyLink')}
        </Button>
        <Stack direction={{xs: 'column', sm: 'row', md: 'column'}} spacing={1.1}>
          <Button
            startIcon={<WhatsAppIcon />}
            variant="contained"
            component="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tTour('whatsApp')}
            fullWidth
            sx={{
              minHeight: 48,
              justifyContent: 'flex-start',
              px: 2.1,
              borderRadius: 1.25,
              bgcolor: 'rgba(5,63,92,0.1)',
              color: 'primary.main',
              '&:hover': {bgcolor: 'rgba(5,63,92,0.16)'}
            }}
          >
            {tTour('whatsApp')}
          </Button>
          <Button
            startIcon={<QrCode2Icon />}
            variant="contained"
            onClick={() => setOpenQR(true)}
            aria-label={tTour('qr')}
            fullWidth
            sx={{
              minHeight: 48,
              justifyContent: 'flex-start',
              px: 2.1,
              borderRadius: 1.25,
              bgcolor: 'rgba(5,63,92,0.1)',
              color: 'primary.main',
              '&:hover': {bgcolor: 'rgba(5,63,92,0.16)'}
            }}
          >
            {tTour('qr')}
          </Button>
        </Stack>

      </Stack>

      <Dialog open={openQR} onClose={() => setOpenQR(false)}>
        <DialogTitle>{tTour('qr')}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} alignItems="center" sx={{pt: 0.5}}>
            <Paper elevation={0} sx={{p: 1.5, borderRadius: 1.75, boxShadow: '0 8px 20px rgba(5,63,92,0.12)'}}>
              <QRCodeSVG value={shareUrl} size={220} includeMargin />
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{wordBreak: 'break-all', textAlign: 'center'}}>
              {shareUrl}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
