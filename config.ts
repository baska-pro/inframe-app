const env = import.meta.env;

const asBoolean = (value: string | undefined, fallback: boolean) => {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const asNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeHost = (value: string) => value.trim().toLowerCase().replace(/^\./, '');

const configuredTargetUrl = (env.VITE_TARGET_URL ?? '').trim();
const allowedHosts = (env.VITE_ALLOWED_HOSTS ?? '')
  .split(',')
  .map(normalizeHost)
  .filter(Boolean);

export const wrapperConfig = {
  appTitle: (env.VITE_APP_TITLE ?? 'InFrame App').trim() || 'InFrame App',
  targetUrl: configuredTargetUrl,
  allowUrlOverride: asBoolean(env.VITE_ALLOW_URL_OVERRIDE, false),
  forwardQueryParams: asBoolean(env.VITE_FORWARD_QUERY_PARAMS, true),
  autoCropGasBanner: asBoolean(env.VITE_AUTO_CROP_GAS_BANNER, true),
  configuredFrameOffsetTop: env.VITE_FRAME_OFFSET_TOP,
  gasDefaultOffsetTop: Math.max(0, Math.min(160, asNumber(env.VITE_GAS_BANNER_HEIGHT, 40))),
  loadingHelpAfterSeconds: Math.max(3, Math.min(60, asNumber(env.VITE_LOADING_HELP_AFTER, 7))),
  showControls: asBoolean(env.VITE_SHOW_CONTROLS, false),
  disableSandbox: asBoolean(env.VITE_DISABLE_SANDBOX, false),
  allowedHosts,
  sandbox:
    'allow-scripts allow-same-origin allow-forms allow-popups allow-modals ' +
    'allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation ' +
    'allow-downloads allow-storage-access-by-user-activation allow-presentation ' +
    'allow-orientation-lock',
  permissionsPolicy:
    'accelerometer; autoplay; camera; clipboard-read; clipboard-write; ' +
    'display-capture; encrypted-media; fullscreen; geolocation; gyroscope; ' +
    'microphone; midi; payment; picture-in-picture; screen-wake-lock; usb; web-share',
};

const RESERVED_PARAMS = new Set(['url', 'frameOffset', 'title']);

const isValidWebUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const hostIsAllowed = (hostname: string) => {
  if (!wrapperConfig.allowedHosts.length) return false;
  const host = hostname.toLowerCase();
  return wrapperConfig.allowedHosts.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`),
  );
};

export const isGoogleAppsScriptUrl = (value: string) => {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === 'script.google.com' ||
      hostname.endsWith('.script.google.com') ||
      hostname === 'script.googleusercontent.com' ||
      hostname.endsWith('.script.googleusercontent.com')
    );
  } catch {
    return false;
  }
};

export const resolveTargetUrl = (): string | null => {
  const sourceParams = new URLSearchParams(window.location.search);
  let target = wrapperConfig.targetUrl;

  const requestedOverride = sourceParams.get('url')?.trim();
  if (requestedOverride && wrapperConfig.allowUrlOverride && isValidWebUrl(requestedOverride)) {
    const requestedHost = new URL(requestedOverride).hostname;
    if (hostIsAllowed(requestedHost)) target = requestedOverride;
  }

  if (!target || !isValidWebUrl(target)) return null;

  const parsedTarget = new URL(target);
  if (wrapperConfig.forwardQueryParams) {
    const valuesByKey = new Map<string, string[]>();
    sourceParams.forEach((value, key) => {
      if (RESERVED_PARAMS.has(key)) return;
      valuesByKey.set(key, [...(valuesByKey.get(key) ?? []), value]);
    });

    valuesByKey.forEach((values, key) => {
      parsedTarget.searchParams.delete(key);
      values.forEach((value) => parsedTarget.searchParams.append(key, value));
    });
  }

  return parsedTarget.toString();
};

export const getFrameOffsetTop = (targetUrl: string) => {
  const queryOffset = new URLSearchParams(window.location.search).get('frameOffset');
  const rawOffset = queryOffset ?? wrapperConfig.configuredFrameOffsetTop;

  if (rawOffset != null && rawOffset !== '') {
    return Math.max(0, Math.min(160, asNumber(rawOffset, 0)));
  }

  if (wrapperConfig.autoCropGasBanner && isGoogleAppsScriptUrl(targetUrl)) {
    return wrapperConfig.gasDefaultOffsetTop;
  }

  return 0;
};
