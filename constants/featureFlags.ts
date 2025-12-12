export const featureFlags = {
  // like button feature
  likeFeature: false,
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;
