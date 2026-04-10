"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Lang, setLang as setGlobalLang, loadLang } from "./i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadLang() ?? "en");

  const setLang = useCallback((newLang: Lang) => {
    setGlobalLang(newLang);
    setLangState(newLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
