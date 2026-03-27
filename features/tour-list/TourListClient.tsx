'use client';

import {useMemo, useState} from 'react';
import {Box, Button, Paper, Stack, Typography} from '@mui/material';
import {useLocale, useTranslations} from 'next-intl';
import {SearchBar} from '@/components/search/SearchBar';
import {CategoryFilters} from '@/components/search/CategoryFilters';
import {TourGrid} from '@/components/tour/TourGrid';
import {StateCard} from '@/components/common/StateCard';
import {FeedbackSnackbar} from '@/components/common/FeedbackSnackbar';
import {SEARCH_DEBOUNCE_MS, MAX_SUGGESTIONS} from '@/constants/app';
import {filterToursByCategory} from '@/utils/category-filter';
import {scoreTourAgainstSearch} from '@/utils/search-rank';
import {useDebouncedValue} from '@/hooks/useDebouncedValue';
import {useSpeechRecognition} from '@/hooks/useSpeechRecognition';
import type {Tour} from '@/types/tour';
import type {AppLocale} from '@/constants/locales';

type Props = {
  tours: Tour[];
};

export function TourListClient({tours}: Props) {
  const INITIAL_VISIBLE_TOURS = 6;
  const LOAD_MORE_STEP = 6;

  const locale = useLocale() as AppLocale;
  const tHome = useTranslations('home');
  const tSearch = useTranslations('search');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_TOURS);
  const [feedback, setFeedback] = useState<{open: boolean; message: string; type: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    type: 'info'
  });

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const availableCategories = useMemo(
    () => Array.from(new Set(tours.flatMap((tour) => tour.categories))).sort((a, b) => a.localeCompare(b, locale)),
    [locale, tours]
  );

  const speech = useSpeechRecognition({
    lang: locale,
    onResult: (text) => {
      setSearch(text);
      setFeedback({open: true, message: text, type: 'success'});
    },
    onError: (code) => {
      const message =
        code === 'not-allowed'
          ? tSearch('micPermissionDenied')
          : code === 'unsupported'
            ? tSearch('speechUnsupported')
            : tSearch('speechNotDetected');
      setFeedback({open: true, message, type: 'error'});
    }
  });

  const ranked = useMemo(() => {
    const categoryFiltered = filterToursByCategory(tours, activeCategory);

    const scored = categoryFiltered
      .map((tour) => ({tour, result: scoreTourAgainstSearch(tour, debouncedSearch)}))
      .filter((entry): entry is {tour: Tour; result: NonNullable<ReturnType<typeof scoreTourAgainstSearch>>} => Boolean(entry.result))
      .sort((a, b) => b.result.score - a.result.score || a.tour.title.localeCompare(b.tour.title, locale));

    return {
      list: scored.map((entry) => entry.tour),
      suggestions: scored.filter((entry) => entry.result.reason === 'fuzzy').slice(0, MAX_SUGGESTIONS).map((entry) => entry.tour.title)
    };
  }, [activeCategory, debouncedSearch, locale, tours]);

  const showNoResult = tours.length > 0 && ranked.list.length === 0;
  const visibleTours = ranked.list.slice(0, visibleCount);
  const remainingTours = Math.max(ranked.list.length - visibleCount, 0);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(INITIAL_VISIBLE_TOURS);
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE_TOURS);
  };

  return (
    <Stack spacing={{xs: 3, md: 4}}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2.5,
          px: {xs: 2.5, md: 4},
          py: {xs: 2.5, md: 3.5},
          background:
            'linear-gradient(150deg, rgba(5,63,92,0.96) 0%, rgba(66,158,189,0.88) 52%, rgba(159,231,245,0.94) 100%)',
          boxShadow: '0 16px 34px rgba(5,63,92,0.18)',
          color: 'common.white',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 340,
            height: 340,
            right: -96,
            top: -160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247,173,25,0.3) 0%, rgba(247,173,25,0) 72%)'
          }
        }}
      >
        <Stack spacing={1} maxWidth={700} sx={{position: 'relative', zIndex: 1, mx: 'auto', textAlign: 'center', alignItems: 'center'}}>
          <Typography variant="h1" sx={{color: 'inherit'}}>
            {tHome('title')}
          </Typography>
          <Typography sx={{fontSize: {xs: 17, md: 20}, color: 'rgba(255,255,255,0.92)', maxWidth: 580, width: '100%', mx: 'auto', textAlign: 'center'}}>
            {tHome('subtitle')}
          </Typography>
        </Stack>
        
      </Box>

      <Stack spacing={1.6}>
        <Paper
          elevation={0}
          sx={{
            px: {xs: 2.2, md: 3},
            py: {xs: 2, md: 2.3},
            borderRadius: 2.5,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F3FAFD 100%)',
            boxShadow: '0 8px 26px rgba(5,63,92,0.08)'
          }}
        >
          <SearchBar value={search} onChange={handleSearchChange} onVoiceClick={speech.start} />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            px: {xs: 2.2, md: 3},
            py: {xs: 1.7, md: 2},
            borderRadius: 2.5,
            background: 'rgba(255,255,255,0.78)',
            boxShadow: '0 8px 22px rgba(5,63,92,0.06)'
          }}
        >
          <CategoryFilters categories={availableCategories} value={activeCategory} onChange={handleCategoryChange} />
        </Paper>
      </Stack>

      {tours.length === 0 ? <StateCard title={tHome('noActiveTours')} /> : null}

      {showNoResult ? (
        <StateCard
          title={tSearch('noResults', {searchTerm: debouncedSearch})}
          description={
            ranked.suggestions.length
              ? `${tSearch('suggestionsTitle')} ${ranked.suggestions.join(', ')}`
              : undefined
          }
        />
      ) : null}

      {!showNoResult && tours.length > 0 ? <TourGrid tours={visibleTours} locale={locale} /> : null}

      {!showNoResult && remainingTours > 0 ? (
        <Box display="flex" justifyContent="center" pt={0.5}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            sx={{px: 4.5, py: 1.3, borderRadius: 999, minWidth: 210}}
          >
            {tHome('loadMoreTours', {count: Math.min(LOAD_MORE_STEP, remainingTours)})}
          </Button>
        </Box>
      ) : null}

      <FeedbackSnackbar
        open={feedback.open}
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({...prev, open: false}))}
      />
    </Stack>
  );
}
