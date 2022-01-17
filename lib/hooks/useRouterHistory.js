import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useRouteUrlHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState([router.asPath]);

  const handleBeforeHistoryChange = (url, opt) => {
    const [nextUrl] = url?.split('?') || [];
    history.push(nextUrl)
    setHistory(history);
  };

  useEffect(() => {
    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
    return () => {
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
    };
  }, []);

  return history;
};

export default useRouteUrlHistory;