export const featureFlags = {
  // like button feature
  likeFeature: true,
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;
