const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined'
const isRN = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

export const Platform = {
  isWeb,
  isReactNative: isRN,
  isMobile: isRN || (isWeb && typeof window !== 'undefined' && window.innerWidth < 768),
  isServer: typeof window === 'undefined',
}
