'use client';

import * as React from 'react';

export function useProductStageData() {
  const sentinelRef = React.useRef(null);
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!shouldLoad || data) return undefined;

    const controller = new AbortController();
    fetch('/api/product-stage-mix', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json();
      })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      });
    return () => controller.abort();
  }, [shouldLoad, data]);

  const retry = React.useCallback(() => {
    setError('');
    setData(null);
    setShouldLoad(false);
    requestAnimationFrame(() => setShouldLoad(true));
  }, []);

  return { sentinelRef, data, error, retry };
}
