"use client";

import { useMemo, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { Chip, Grid2, Paper, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { TourGallery } from "@/components/tour/TourGallery";
import { FeedbackSnackbar } from "@/components/common/FeedbackSnackbar";
import { ShareActions } from "@/features/sharing/SharePanel";
import { Link } from "@/i18n/navigation";
import type { Tour } from "@/types/tour";
import type { AppLocale } from "@/constants/locales";
import {
  formatCategoryLabel,
  formatDayLabel,
  formatRegionLabel,
} from "@/utils/tour-labels";

type Props = {
  tour: Tour;
};

export function PublicTourDetail({ tour }: Props) {
  const locale = useLocale() as AppLocale;
  const tTour = useTranslations("tour");
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const imageSet = useMemo(() => {
    const merged = [tour.coverImage, ...tour.gallery].filter(Boolean);
    return Array.from(new Set(merged));
  }, [tour.coverImage, tour.gallery]);

  const pricingRows = Object.entries(tour.pricing.byRegion || {});
  const hasFreeChildRule =
    typeof tour.participantRules?.freeChildMinAge === "number" &&
    typeof tour.participantRules?.freeChildMaxAge === "number";
  const hasChildRule =
    typeof tour.participantRules?.childMinAge === "number" &&
    typeof tour.participantRules?.childMaxAge === "number";

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Stack
        component={Link}
        href="/"
        prefetch={false}
        direction="row"
        spacing={0.6}
        alignItems="center"
        sx={{
          width: "fit-content",
          color: "text.secondary",
          fontWeight: 700,
          px: 0.2,
        }}
      >
        <ArrowBackRoundedIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {tTour("backToTours")}
        </Typography>
      </Stack>

      <Grid2 container spacing={{ xs: 2, md: 2.5 }}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <TourGallery images={imageSet} alt={tour.title} videoUrl={tour.videoUrl} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack
            spacing={2.25}
            sx={{ position: { md: "sticky" }, top: { md: 20 } }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, md: 2.8 },
                borderRadius: 3,
                bgcolor: "#FFFFFF",
                color: "text.primary",
                boxShadow: "0 14px 30px rgba(5,63,92,0.1)",
                border: "1px solid rgba(5,63,92,0.08)",
              }}
            >
              <Stack spacing={1.15}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 1.1,
                    fontWeight: 800,
                    color: "text.secondary",
                  }}
                >
                  {tTour("campaignPrice")}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1.2}
                >
                  <Stack direction="row" alignItems="baseline" spacing={0.9}>
                    <Typography
                      sx={{
                        color: "primary.main",
                        fontSize: { xs: 24, md: 28 },
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: -1,
                      }}
                    >
                      {tour.priceText || tTour("priceOnRequest")}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {tTour("startingFrom")}
                    </Typography>
                  </Stack>
                </Stack>
                <Grid2 container spacing={1.1}>
                  <Grid2 size={{ xs: 6 }}>
                    <Stack
                      spacing={0.55}
                      sx={{
                        minHeight: 84,
                        p: 1.4,
                        borderRadius: 2,
                        bgcolor: "rgba(236,246,251,0.85)",
                        border: "1px solid rgba(5,63,92,0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <DirectionsBusRoundedIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 700,
                        }}
                      >
                        {tTour("transfer")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          fontSize: 18,
                          color: "text.primary",
                        }}
                      >
                        {tour.hasTransfer
                          ? tTour("included")
                          : tTour("notIncluded")}
                      </Typography>
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Stack
                      spacing={0.55}
                      sx={{
                        minHeight: 84,
                        p: 1.4,
                        borderRadius: 2,
                        bgcolor: "rgba(236,246,251,0.85)",
                        border: "1px solid rgba(5,63,92,0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <RestaurantRoundedIcon
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 700,
                        }}
                      >
                        {tTour("meal")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 800,
                          fontSize: 18,
                          color: "text.primary",
                        }}
                      >
                        {tour.hasMeal
                          ? tTour("included")
                          : tTour("notIncluded")}
                      </Typography>
                    </Stack>
                  </Grid2>
                </Grid2>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.4, md: 2.8 },
                borderRadius: 2.25,
                bgcolor: "background.paper",
                boxShadow: "0 10px 24px rgba(5,63,92,0.08)",
              }}
            >
              <Stack spacing={1.4}>
                <Typography variant="h3">{tTour("share")}</Typography>
                <ShareActions
                  slug={tour.slug}
                  title={tour.title}
                  locale={locale}
                  onFeedback={(message, type) =>
                    setFeedback({ open: true, message, type })
                  }
                />
              </Stack>
            </Paper>

          </Stack>
        </Grid2>
      </Grid2>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.3, md: 2.9 },
          borderRadius: 2.25,
          background: "#FFFFFF",
          boxShadow: "0 12px 24px rgba(5,63,92,0.1)",
        }}
      >
        <Stack spacing={1.6}>
          <Typography variant="h2">{tour.title}</Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: 16, md: 17 }, lineHeight: 1.72 }}
          >
            {tour.shortDescription}
          </Typography>
          {tour.description ? (
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {tour.description}
            </Typography>
          ) : null}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tour.categories.map((category) => (
                <Chip
                  key={category}
                  variant="filled"
                  label={formatCategoryLabel(category, locale)}
                  sx={{
                    bgcolor: "rgba(5,63,92,0.12)",
                    color: "text.primary",
                  fontWeight: 700,
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Grid2 container spacing={{ xs: 2, md: 2.5 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.3, md: 2.9 },
              height: "100%",
              borderRadius: 2.25,
              bgcolor: "#FFFFFF",
              boxShadow: "0 10px 22px rgba(5,63,92,0.1)",
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="h3">{tTour("thingsToBring")}</Typography>
              <Stack component="ul" spacing={0.85} sx={{ pl: 2.4, m: 0 }}>
                {tour.thingsToBring.map((item) => (
                  <Typography
                    component="li"
                    key={item}
                    color="text.secondary"
                    sx={{ lineHeight: 1.62 }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.3, md: 2.9 },
              height: "100%",
              borderRadius: 2.25,
              bgcolor: "#FFFFFF",
              boxShadow: "0 10px 22px rgba(5,63,92,0.1)",
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="h3">{tTour("importantNotes")}</Typography>
              <Stack component="ul" spacing={0.85} sx={{ pl: 2.4, m: 0 }}>
                {tour.importantNotes.map((item) => (
                  <Typography
                    component="li"
                    key={item}
                    color="text.secondary"
                    sx={{ lineHeight: 1.62 }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={{ xs: 2, md: 2.5 }}>
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.3, md: 2.9 },
              borderRadius: 2.25,
              bgcolor: "#FFFFFF",
              boxShadow: "0 10px 22px rgba(5,63,92,0.1)",
            }}
          >
            <Stack spacing={1.3}>
              <Typography variant="h3">{tTour("pricingByRegion")}</Typography>
              {pricingRows.map(([region, pricing]) => (
                <Stack
                  key={region}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "rgba(236,246,251,0.7)",
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h4">
                      {formatRegionLabel(region, locale)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {(pricing.availableDays || []).map((day) => (
                        <Chip
                          key={day}
                          size="small"
                          icon={<EventAvailableRoundedIcon />}
                          label={formatDayLabel(day, locale)}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Stack spacing={0.35}>
                    <Typography color="text.secondary">
                      {tTour("adultPrice")}:{" "}
                      {typeof pricing.adultPrice === "number"
                        ? `${pricing.adultPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
                    </Typography>
                    <Typography color="text.secondary">
                      {tTour("childPrice")}:{" "}
                      {typeof pricing.childPrice === "number"
                        ? `${pricing.childPrice} ${tour.pricing.currency}`
                        : tTour("priceOnRequest")}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.3, md: 2.9 },
              borderRadius: 2.25,
              bgcolor: "#FFFFFF",
              boxShadow: "0 10px 22px rgba(5,63,92,0.1)",
            }}
          >
            <Stack spacing={1.2}>
              <Typography variant="h3">{tTour("participantRules")}</Typography>
              {hasFreeChildRule ? (
                <Chip
                  icon={<LocalOfferRoundedIcon />}
                  label={`${tTour("freeChildAge")}: ${tour.participantRules?.freeChildMinAge}-${tour.participantRules?.freeChildMaxAge}`}
                  sx={{ alignSelf: "flex-start" }}
                />
              ) : null}
              {hasChildRule ? (
                <Chip
                  icon={<LocalOfferRoundedIcon />}
                  label={`${tTour("childAge")}: ${tour.participantRules?.childMinAge}-${tour.participantRules?.childMaxAge}`}
                  sx={{ alignSelf: "flex-start" }}
                />
              ) : null}
              {!hasFreeChildRule && !hasChildRule ? (
                <Typography color="text.secondary">
                  {tTour("participantRulesNotSpecified")}
                </Typography>
              ) : null}
            </Stack>
          </Paper>
        </Grid2>
      </Grid2>

      <FeedbackSnackbar
        open={feedback.open}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
}
