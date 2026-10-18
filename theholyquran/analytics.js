(() => {
  const CONSENT_KEY = 'quran-analytics-consent-v1';
  const TIME_INTERVAL = 30000;
  let tracker = null;
  let ready = false;
  let loading = false;
  let currentPage = null;
  let currentSurahs = new Set();
  let currentJuz = null;
  let contextProvider = null;
  let lastContext = null;
  let lastContextKey = '';
  let lastContextAt = 0;
  let timeTimer = null;

  function configured() {
    const c = window.CONFIG || {};
    const securePage = location.protocol === 'https:' || (location.protocol === 'http:' && location.hostname === 'localhost');
    if (!c.UMAMI_WEBSITE_ID || !securePage) return false;
    try {
      return new URL(c.UMAMI_SCRIPT_URL).protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function consent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      return true;
    } catch (e) {
      console.warn('Analytics consent could not be saved.', e);
      setStatus('تعذّر حفظ اختيارك. لم يبدأ جمع التحليلات.');
      return false;
    }
  }

  function setStatus(text) {
    const status = document.querySelector('#analyticsStatus');
    if (status) status.textContent = text;
  }

  function safeData(data) {
    const safe = {};
    Object.entries(data || {}).forEach(([key, value]) => {
      if (typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) safe[key] = value;
      else if (typeof value === 'string') safe[key] = value.slice(0, 80);
    });
    return safe;
  }

  function send(name, data) {
    if (!ready || !window.umami || typeof window.umami.track !== 'function') return;
    try {
      window.umami.track(name, safeData(data));
    } catch (e) {
      console.warn('Analytics event could not be sent.', e);
    }
  }

  function readContext() {
    if (!contextProvider) return {};
    try {
      const raw = contextProvider() || {};
      const context = safeData(raw);
      if (Array.isArray(raw.surahs)) context.surahs = raw.surahs.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 114);
      return context;
    } catch (e) {
      console.warn('Analytics context could not be read.', e);
      return {};
    }
  }

  function contextKey(context) {
    return JSON.stringify(context);
  }

  function sendElapsed(now) {
    if (!lastContextAt || !lastContext) return;
    const seconds = Math.floor((now - lastContextAt) / 1000);
    if (seconds < 1) return;

    if (lastContext.reader_active !== false) {
      const reader = { seconds };
      ['page', 'surah', 'juz', 'mode'].forEach(key => {
        if (lastContext[key] !== undefined) reader[key] = lastContext[key];
      });
      if (Array.isArray(lastContext.surahs)) reader.surahs = lastContext.surahs.join(',');
      send('reader_time', reader);
    }

    if (lastContext.theme !== undefined) send('theme_time', { theme: lastContext.theme, theme_index: lastContext.theme_index, theme_mode: lastContext.theme_mode, seconds });

    if (lastContext.recitation_active && lastContext.reciter) {
      const recitation = { reciter: lastContext.reciter, reciter_name: lastContext.reciter_name, seconds };
      ['recitation_surah', 'recitation_verse', 'recitation_page', 'recitation_juz'].forEach(key => {
        if (lastContext[key] !== undefined) recitation[key.replace('recitation_', '')] = lastContext[key];
      });
      send('recitation_time', recitation);
    }

    if (lastContext.studio_open) {
      const design = { seconds };
      ['design_surah', 'design_background', 'design_pattern', 'design_ratio'].forEach(key => {
        if (lastContext[key] !== undefined) design[key.replace('design_', '')] = lastContext[key];
      });
      send('design_time', design);
    }
  }

  function syncContext(force) {
    if (!ready) return;
    if (document.hidden) {
      sendElapsed(Date.now());
      lastContext = null;
      lastContextKey = '';
      lastContextAt = 0;
      return;
    }

    const now = Date.now();
    const next = readContext();
    const nextKey = contextKey(next);
    if (!lastContextAt) {
      lastContext = next;
      lastContextKey = nextKey;
      lastContextAt = now;
      return;
    }
    if (force || nextKey !== lastContextKey || now - lastContextAt >= TIME_INTERVAL) {
      sendElapsed(now);
      lastContext = next;
      lastContextKey = nextKey;
      lastContextAt = now;
    }
  }

  function startTimeTracking() {
    if (timeTimer) clearInterval(timeTimer);
    lastContext = null;
    lastContextKey = '';
    lastContextAt = 0;
    syncContext(false);
    timeTimer = setInterval(() => syncContext(true), TIME_INTERVAL);
  }

  function stopTimeTracking() {
    if (timeTimer) clearInterval(timeTimer);
    timeTimer = null;
    syncContext(true);
    lastContext = null;
    lastContextKey = '';
    lastContextAt = 0;
  }

  function track(name, data) {
    if (!ready) return;
    syncContext(false);
    send(name, data);
  }

  function page(pageNumber, surahNumbers, juzNumber) {
    if (!ready || !window.umami || typeof window.umami.track !== 'function') return;
    const pageNo = Number(pageNumber);
    const surahs = (Array.isArray(surahNumbers) ? surahNumbers : [surahNumbers])
      .map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 114);
    const juz = Number(juzNumber);
    if (!Number.isInteger(pageNo) || pageNo < 1 || pageNo > 604 || !surahs.length) return;
    if (pageNo === currentPage) return;

    currentPage = pageNo;
    track('quran_page_view', { page: pageNo, surah: surahs[0], juz, surahs: surahs.join(',') });
    try {
      window.umami.track(() => ({ url: '/reader/page/' + pageNo, title: 'Quran page ' + pageNo }));
    } catch (e) {
      console.warn('Quran page view could not be sent.', e);
    }

    const previous = currentSurahs;
    surahs.forEach(surah => {
      if (!previous.has(surah)) track('surah_view', { surah, page: pageNo, juz });
    });
    currentSurahs = new Set(surahs);

    if (Number.isInteger(juz) && juz >= 1 && juz <= 30 && juz !== currentJuz) {
      currentJuz = juz;
      track('juz_view', { juz, page: pageNo, surah: surahs[0] });
    }
  }

  function startSession() {
    ready = true;
    startTimeTracking();
    track('app_session_start');
    const current = contextProvider ? readContext() : {};
    if (current.page && current.surah) page(current.page, current.surahs || [current.surah], current.juz);
    if (current.theme !== undefined) track('theme_view', { theme: current.theme, theme_index: current.theme_index, theme_mode: current.theme_mode });
    if (current.reciter) track('reciter_view', { reciter: current.reciter, reciter_name: current.reciter_name });
    setStatus('مفعّلة بموافقتك — يمكنك تغيير اختيارك هنا.');
  }

  function loadTracker() {
    if (!configured() || consent() !== 'granted' || ready || loading) return;
    if (window.umami && typeof window.umami.track === 'function') {
      startSession();
      return;
    }
    loading = true;
    const script = document.createElement('script');
    tracker = script;
    script.src = window.CONFIG.UMAMI_SCRIPT_URL;
    script.async = true;
    script.dataset.websiteId = window.CONFIG.UMAMI_WEBSITE_ID;
    script.dataset.autoTrack = 'false';
    script.dataset.domains = location.hostname;
    script.onload = () => {
      loading = false;
      if (consent() !== 'granted') {
        script.remove();
        if (tracker === script) tracker = null;
        return;
      }
      if (!window.umami || typeof window.umami.track !== 'function') {
        console.warn('Analytics tracker loaded without its tracking API.');
        setStatus('تعذّر تهيئة التحليلات؛ سيظل التطبيق يعمل دونها.');
        return;
      }
      startSession();
    };
    script.onerror = () => {
      loading = false;
      if (tracker === script) tracker = null;
      console.warn('Analytics tracker could not be loaded.');
      setStatus('تعذّر الاتصال بمنصة التحليلات؛ سيظل التطبيق يعمل دونها.');
    };
    document.head.appendChild(script);
  }

  function closeDialog() {
    const dialog = document.querySelector('#analyticsConsent');
    if (!dialog) return;
    dialog.classList.remove('on');
    dialog.setAttribute('aria-hidden', 'true');
  }

  function openDialog() {
    const dialog = document.querySelector('#analyticsConsent');
    if (!dialog) return;
    if (!configured()) {
      setStatus('التحليلات غير مهيّأة أو أن التطبيق ليس على HTTPS. أضف معرّف Umami إلى config.js.');
      return;
    }
    dialog.classList.add('on');
    dialog.setAttribute('aria-hidden', 'false');
    document.querySelector('#analyticsAccept').focus();
  }

  function choose(value) {
    if (!saveConsent(value)) return;
    if (value === 'granted') {
      loadTracker();
      setStatus('جارٍ تفعيل التحليلات بموافقتك.');
    } else {
      ready = false;
      stopTimeTracking();
      loading = false;
      if (tracker) tracker.remove();
      tracker = null;
      currentPage = null;
      currentSurahs = new Set();
      currentJuz = null;
      setStatus('متوقفة — لم يُحمّل متعقّب التحليلات.');
    }
    closeDialog();
  }

  document.querySelector('#analyticsAccept').addEventListener('click', () => choose('granted'));
  document.querySelector('#analyticsReject').addEventListener('click', () => choose('denied'));
  document.querySelector('#analyticsClose').addEventListener('click', closeDialog);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) syncContext(true);
    else syncContext(false);
  });
  window.addEventListener('pagehide', () => syncContext(true));
  window.addEventListener('error', e => track('app_error', { source: 'runtime', kind: e.error && e.error.name || 'error' }));
  window.addEventListener('unhandledrejection', e => track('app_error', { source: 'promise', kind: e.reason && e.reason.name || 'rejection' }));

  window.QuranAnalytics = {
    init(provider) {
      contextProvider = provider;
      if (!configured()) {
        setStatus('غير مهيّأة. أضف معرّف Umami إلى config.js وانشر التطبيق عبر HTTPS.');
        return;
      }
      if (consent() === 'granted') loadTracker();
      else if (consent() !== 'denied') openDialog();
      else setStatus('متوقفة — لم يُحمّل متعقّب التحليلات.');
    },
    manage: openDialog,
    track,
    page
  };
})();
