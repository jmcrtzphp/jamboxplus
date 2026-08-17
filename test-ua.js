const uas = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1", // iOS Safari
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148", // iOS WebView / PWA
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15", // macOS Safari
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36" // Android Chrome
];

uas.forEach(ua => {
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
  const isWebKit = /AppleWebKit/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
  console.log({ ua: ua.substring(0,30), isSafari, isWebKit });
});
