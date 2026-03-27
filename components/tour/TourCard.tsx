'use client';

import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import {Box, Card, CardActionArea, CardContent, Chip, CircularProgress, Stack, Typography} from '@mui/material';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {MouseEvent} from 'react';
import {useState} from 'react';
import type {Tour} from '@/types/tour';
import {Link} from '@/i18n/navigation';
import type {AppLocale} from '@/constants/locales';
import {getTourPriceSummary} from '@/utils/tour-pricing';

type Props = {
  tour: Tour;
  locale: AppLocale;
};

export function TourCard({tour, locale}: Props) {
  const tTour = useTranslations('tour');
  const [isNavigating, setIsNavigating] = useState(false);
  const priceSummary = getTourPriceSummary(tour.pricing, tour.campaignPrice);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    setIsNavigating(true);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#FFFFFF',
        transition: 'transform 0.24s ease, box-shadow 0.24s ease',
        boxShadow: '0 10px 24px rgba(5,63,92,0.12)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 36px rgba(5,63,92,0.2)'
        }
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tours/${tour.slug}`}
        locale={locale}
        prefetch
        onClick={handleClick}
        aria-busy={isNavigating}
        sx={{height: '100%', alignItems: 'stretch'}}
      >
        <Stack sx={{height: '100%'}}>
          <Box sx={{position: 'relative', minHeight: 248}}>
            <Image
              src={tour.coverImage}
              alt={tour.title}
              fill
              sizes="(max-width: 900px) 100vw, (max-width: 1536px) 50vw, 33vw"
              style={{objectFit: 'cover'}}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(5,38,58,0.02) 35%, rgba(5,38,58,0.62) 100%)'
              }}
            />
            {typeof tour.campaignPrice === 'number' ? (
              <Chip
                label={`${tour.campaignPrice} ${tour.pricing.currency || 'EUR'}`}
                sx={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  px: 1.1,
                  color: 'common.white',
                  bgcolor: '#FF7A00',
                  fontWeight: 800,
                  boxShadow: '0 10px 24px rgba(255,122,0,0.38)',
                  animation: 'campaign-pulse 1.15s ease-in-out infinite',
                  '@keyframes campaign-pulse': {
                    '0%': {transform: 'scale(1)', boxShadow: '0 10px 24px rgba(255,122,0,0.32)'},
                    '50%': {transform: 'scale(1.06)', boxShadow: '0 14px 30px rgba(255,122,0,0.54)'},
                    '100%': {transform: 'scale(1)', boxShadow: '0 10px 24px rgba(255,122,0,0.32)'}
                  }
                }}
              />
            ) : null}
          </Box>

          <CardContent
            sx={{
              p: 2.35,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-between',
              bgcolor: 'rgba(236,246,251,0.45)'
            }}
          >
            <Stack spacing={1.1} sx={{flex: 1, minHeight: 0}}>
              <Box sx={{minHeight: 112}}>
                <Typography variant="h3" sx={{lineHeight: 1.22, minHeight: 68}}>
                  {tour.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.62, minHeight: 72}}>
                  {tour.shortDescription}
                </Typography>
              </Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" pt={0.8}>
                <Stack direction="row" spacing={2.5} alignItems="stretch">
                  <Stack spacing={0.1}>
                    <Typography variant="caption" color="text.secondary" sx={{fontSize: 12.5}}>
                      {tTour('adultPrice')}
                    </Typography>
                    <Typography variant="h4" sx={{color: 'primary.main'}}>
                      {typeof priceSummary.minAdultPrice === 'number'
                        ? `${priceSummary.minAdultPrice} ${priceSummary.currency}`
                        : tTour('priceOnRequest')}
                    </Typography>
                  </Stack>
                  {typeof priceSummary.minChildPrice === 'number' ? (
                    <Stack spacing={0.1}>
                      <Typography variant="caption" color="text.secondary" sx={{fontSize: 12.5}}>
                        {tTour('childPrice')}
                      </Typography>
                      <Typography variant="h4" sx={{color: 'primary.main'}}>
                        {priceSummary.minChildPrice} {priceSummary.currency}
                      </Typography>
                    </Stack>
                  ) : null}
                </Stack>
                <Stack
                  direction="row"
                  spacing={0.35}
                  alignItems="center"
                  sx={{
                    px: 1.35,
                    minHeight: 40,
                    borderRadius: 999,
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    fontWeight: 700
                  }}
                >
                  <Typography variant="body2" sx={{fontWeight: 700}}>
                    {tTour('publicPage')}
                  </Typography>
                  <ArrowOutwardRoundedIcon sx={{fontSize: 18}} />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Stack>
      </CardActionArea>
      {isNavigating ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(5,38,58,0.26)',
            backdropFilter: 'blur(2px)',
            pointerEvents: 'none'
          }}
        >
          <CircularProgress size={42} thickness={4.5} sx={{color: 'common.white'}} />
        </Box>
      ) : null}
    </Card>
  );
}
