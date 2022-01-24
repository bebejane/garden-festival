import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useRouteUrlHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState([router.asPath]);

  const handlePopState = (url, as, opt) => {
    console.log('pop', url, as, opt)
    history.pop()
    setHistory(history);
    console.table(history)
    return true
  }
  const handleHistoryChange = (url, opt) => {
    const [nextUrl] = url?.split('?') || [];
    if(history[history.length-1] === nextUrl) 
      return
    history.push(nextUrl)
    setHistory(history);
    console.table(history)
  };
  
  useEffect(() => {
    router.beforePopState(handlePopState);
    router.events.on('routeChangeComplete', handleHistoryChange);
    return () => {
      router.events.off('routeChangeComplete', handleHistoryChange);
      //router.events.off('beforePopState', handlePopState);
    };
  }, []);
  return history;
};

export default useRouteUrlHistory;