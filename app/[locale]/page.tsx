import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/constants/locales';
import {getCachedActiveTours} from '@/services/tour.server';
import {TourListClient} from '@/features/tour-list/TourListClient';
import {StateCard} from '@/components/common/StateCard';
import {localizeTours} from '@/utils/localize-tour';
import {sortToursAlphabetical} from '@/utils/search-rank';
import {TourDataAccessError} from '@/services/firebase/tour.errors';

type Props = {
  params: Promise<{locale: AppLocale}>;
};

export default async function LocaleHomePage({params}: Props) {
  const {locale} = await params;
  const tCommon = await getTranslations('common');

  try {
    const tours = await getCachedActiveTours();
    const localizedTours = localizeTours(tours, locale);
    return <TourListClient tours={sortToursAlphabetical(localizedTours, locale)} />;
  } catch (error) {
    if (!(error instanceof TourDataAccessError)) {
      throw error;
    }

    return <StateCard title={tCommon('tourLoadError')} />;
  }
}
