"use client";

import { LanguageProvider } from "./i18n/language-context";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps): React.JSX.Element {
  return <LanguageProvider>{children}</LanguageProvider>;
}
