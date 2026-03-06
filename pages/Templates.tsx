import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { BookOpen, Headphones, Printer, Apple } from 'lucide-react';

export const Templates: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Šablony IT návodů</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Rychlé kostry pro tvoje návody – Daktela, tiskárny, začátečníci na macOS a univerzální šablona pro cokoliv dalšího.
          Text si prostě zkopíruj, vlož kam potřebuješ a doplň konkrétní detaily.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Obecná šablona */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Obecná šablona návodu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Univerzální struktura pro jakýkoliv interní návod – technický i netechnický.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Název návodu</strong> – stručný, aby uživatel hned věděl, co z toho bude.
              </li>
              <li>
                <strong>Cíl a přínos</strong> – co se uživatel naučí, kdy návod použít, jaký je výsledek.
              </li>
              <li>
                <strong>Předpoklady</strong> – přístupy, oprávnění, HW/SW, co má mít uživatel připravené.
              </li>
              <li>
                <strong>Rychlý přehled kroků</strong> – 3–7 bodů, co se bude dít (tl;dr verze návodu).
              </li>
              <li>
                <strong>Postup krok za krokem</strong> – rozdělený do podsekcí (4.1, 4.2…) s kontrolou výsledku.
              </li>
              <li>
                <strong>Nejčastější problémy a řešení</strong> – typické chyby, příčina a konkrétní postup, jak je opravit.
              </li>
              <li>
                <strong>Tipy a dobré praxe</strong> – zrychlení práce, triky, na co si dát bacha.
              </li>
              <li>
                <strong>Kontakty / eskalace</strong> – kam to poslat dál, kde jsou další materiály.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Daktela */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Šablona návodu – Daktela (operátor)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Pro návody typu „Základy práce v Daktela“, „Jak přijmout hovor“, „Jak zpracovat ticket“.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Cíl</strong> – např. „Uživatel zvládne přijmout hovor, nastavit dispozici a pracovat s ticketem“.
              </li>
              <li>
                <strong>Předpoklady</strong> – účet v Daktela, URL, přístup k internetu, sluchátka.
              </li>
              <li>
                <strong>Přihlášení do Daktely</strong> – kroky přihlášení + typické chyby (špatné heslo, Caps Lock…).
              </li>
              <li>
                <strong>Orientace v rozhraní</strong> – horní lišta, levé menu, hlavní panel, kde co hledat.
              </li>
              <li>
                <strong>Práce s hovory</strong> – status (dostupný/pauza), přijetí hovoru, poznámky, přepojení, dispozice.
              </li>
              <li>
                <strong>Práce s tickety / e‑maily</strong> – filtrování, odpověď, změna stavu, předání jinému týmu.
              </li>
              <li>
                <strong>Nejčastější problémy</strong> – nezvoní hovory, nejde se přihlásit do fronty, ticket nejde uložit.
              </li>
              <li>
                <strong>Kontakty</strong> – supervizor, Daktela admin, odkaz na interní wiki.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Tiskárny */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              Šablona návodu – Tiskárny
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Pro návody k instalaci, nastavení a řešení problémů: konkrétní modely tiskáren, kanceláře, OS.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Cíl</strong> – uživatel zvládne tiskárnu připojit, nainstalovat a udělat testovací tisk.
              </li>
              <li>
                <strong>Předpoklady</strong> – typ připojení (USB / síť / Wi‑Fi), admin práva, odkaz na ovladače.
              </li>
              <li>
                <strong>Fyzické zapojení</strong> – rozbalení, odstranění pojistek, napájení, připojení kabelu / Wi‑Fi.
              </li>
              <li>
                <strong>Instalace ovladačů</strong> – zvlášť pro Windows a macOS (kde kliknout, co stáhnout).
              </li>
              <li>
                <strong>Testovací tisk</strong> – výběr tiskárny, počet kopií, jednostranný/oboustranný tisk, kontrola výstupu.
              </li>
              <li>
                <strong>Nejčastější problémy</strong> – netiskne, špatná kvalita, zaseknutý papír, tiskárna offline.
              </li>
              <li>
                <strong>Kdy předat IT/servisu</strong> – opakované chyby, chybové kódy, podezření na HW závadu.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* macOS */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-primary" />
              Šablona návodu – Začínáme s macOS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Pro úplné začátečníky nebo lidi, co přechází z Windows na Mac ve firmě.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Cíl</strong> – základní orientace v systému, práce se soubory, instalace aplikací, zálohování.
              </li>
              <li>
                <strong>První spuštění a Apple ID</strong> – jazyk, Wi‑Fi, vytvoření/přihlášení Apple ID, iCloud.
              </li>
              <li>
                <strong>Prostředí macOS</strong> – plocha, Dock, horní lišta, Finder, práce se složkami/soubory.
              </li>
              <li>
                <strong>Instalace a odinstalace aplikací</strong> – App Store vs. .dmg/.pkg, kam se aplikace instalují.
              </li>
              <li>
                <strong>Základní nastavení</strong> – klávesnice, touchpad, displej, uživatelské účty, Touch ID.
              </li>
              <li>
                <strong>Zabezpečení a zálohování</strong> – zámek obrazovky, aktualizace, Time Machine a externí disk.
              </li>
              <li>
                <strong>Tipy pro efektivní práci</strong> – Cmd+C/V, Cmd+Space (Spotlight), gesta na trackpadu.
              </li>
              <li>
                <strong>Další zdroje</strong> – oficiální příručky Apple, interní návody, kontakt na IT.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

