"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  ChevronLeft, 
  ChevronRight, 
  MousePointer2, 
  Settings, 
  FileText, 
  ClipboardPaste, 
  Save,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Mail,
  Monitor,
  Apple,
  Globe
} from "lucide-react"

type EmailClient = "gmail" | "outlook-web" | "outlook-windows" | "apple-mail" | "thunderbird"

interface GuideStep {
  title: string
  description: string
  icon: React.ReactNode
  mockup: React.ReactNode
  tip?: string
  warning?: string
}

// Gmail mockup components
function GmailSettingsIcon() {
  return (
    <div className="relative">
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
      <Settings className="h-6 w-6" />
    </div>
  )
}

function GmailMockup1() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <div className="text-red-500 font-bold text-lg">Gmail</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative cursor-pointer group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse" />
            <Settings className="h-5 w-5 text-gray-600 relative z-10" />
            <MousePointer2 className="absolute -bottom-2 -right-2 h-4 w-4 text-primary animate-bounce" />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="absolute right-12 top-16 bg-white shadow-xl rounded-lg border p-2 text-xs">
        <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Rychlá nastavení
        </div>
        <div className="px-3 py-2 bg-primary/10 rounded cursor-pointer flex items-center gap-2 text-primary font-medium border-l-2 border-primary">
          <Settings className="h-4 w-4" />
          Zobrazit všechna nastavení
        </div>
      </div>
    </div>
  )
}

function GmailMockup2() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-4 text-sm">
        <span className="text-gray-600">Obecné</span>
        <span className="text-gray-600">Štítky</span>
        <span className="text-gray-600">Doručená pošta</span>
        <span className="text-gray-600">Účty</span>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="relative border-2 border-primary rounded-lg p-3 bg-primary/5">
            <div className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-primary">Podpis:</div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-200 rounded" />
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <MousePointer2 className="absolute -bottom-1 right-4 h-5 w-5 text-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

function GmailMockup3() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium">Podpis</div>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-32 space-y-2">
            <div className="p-2 bg-primary/10 rounded text-xs font-medium border-l-2 border-primary">Můj podpis</div>
            <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
              <Plus className="h-3 w-3 mr-1" /> Nový
            </Button>
          </div>
          <div className="flex-1 relative">
            <div className="border-2 border-dashed border-primary rounded-lg p-3 min-h-[100px] bg-primary/5">
              <div className="text-xs text-muted-foreground mb-2">Editor podpisu:</div>
              <div className="flex items-center gap-2 text-xs text-primary">
                <ClipboardPaste className="h-4 w-4" />
                Sem vložte podpis (Ctrl+V)
              </div>
              <MousePointer2 className="absolute bottom-2 right-2 h-5 w-5 text-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GmailMockup4() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="p-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
      <div className="border-t px-4 py-3 flex justify-end">
        <div className="relative">
          <Button className="bg-primary">
            <Save className="h-4 w-4 mr-2" />
            Uložit změny
          </Button>
          <MousePointer2 className="absolute -bottom-1 -right-1 h-5 w-5 text-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}

// Outlook Web mockups
function OutlookWebMockup1() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="text-white font-bold">Outlook</div>
        <div className="relative">
          <div className="absolute -inset-2 bg-white/30 rounded-full animate-pulse" />
          <Settings className="h-5 w-5 text-white relative z-10" />
          <MousePointer2 className="absolute -bottom-2 -right-2 h-4 w-4 text-yellow-300 animate-bounce" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

function OutlookWebMockup2() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-primary font-medium">Podpis e-mailu</span>
          <MousePointer2 className="h-4 w-4 text-primary animate-bounce ml-auto" />
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div className="p-3 bg-primary/10 rounded-lg border-l-2 border-primary">
            <div className="text-sm font-medium">E-mailový podpis</div>
            <div className="text-xs text-muted-foreground">Nastavení podpisu pro e-maily</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OutlookWebMockup3() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b text-sm font-medium">E-mailový podpis</div>
      <div className="p-4">
        <div className="border-2 border-dashed border-primary rounded-lg p-4 bg-primary/5 relative">
          <div className="text-xs text-muted-foreground mb-2">Editor podpisu:</div>
          <div className="flex items-center gap-2 text-xs text-primary">
            <ClipboardPaste className="h-4 w-4" />
            Vložte podpis (Ctrl+V)
          </div>
          <MousePointer2 className="absolute bottom-2 right-2 h-5 w-5 text-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}

// Outlook Windows mockups
function OutlookWindowsMockup1() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-blue-700 px-4 py-2 text-white text-sm">
        <span className="font-bold">Soubor</span>
        <span className="ml-4 opacity-70">Domů</span>
        <span className="ml-4 opacity-70">Odeslat</span>
      </div>
      <div className="flex">
        <div className="w-48 bg-blue-600 text-white p-4 space-y-3">
          <div className="p-2 bg-white/10 rounded">Info</div>
          <div className="p-2 bg-white/10 rounded">Nový</div>
          <div className="p-2 bg-white/20 rounded border-l-2 border-white flex items-center gap-2">
            <Settings className="h-4 w-4" /> Možnosti
            <MousePointer2 className="h-4 w-4 animate-bounce ml-auto" />
          </div>
        </div>
        <div className="flex-1 p-4 bg-gray-50">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

function OutlookWindowsMockup2() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium">Možnosti aplikace Outlook</div>
      <div className="flex">
        <div className="w-40 bg-gray-50 p-2 space-y-1 border-r text-sm">
          <div className="p-2 rounded">Obecné</div>
          <div className="p-2 bg-primary/10 rounded font-medium text-primary border-l-2 border-primary">Pošta</div>
          <div className="p-2 rounded">Kalendář</div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="relative inline-block">
              <Button variant="outline" size="sm">
                Podpisy...
              </Button>
              <MousePointer2 className="absolute -bottom-1 -right-1 h-5 w-5 text-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OutlookWindowsMockup3() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium">Podpisy a šablony</div>
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-32 space-y-2">
            <div className="text-xs font-medium mb-1">Vybrat podpis:</div>
            <div className="border rounded p-2 text-xs bg-primary/10 border-primary">Nový podpis</div>
            <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
              <Plus className="h-3 w-3 mr-1" /> Nový
            </Button>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium mb-1">Upravit podpis:</div>
            <div className="border-2 border-dashed border-primary rounded p-3 min-h-[80px] bg-primary/5 relative">
              <div className="text-xs text-primary flex items-center gap-1">
                <ClipboardPaste className="h-4 w-4" />
                Ctrl+V
              </div>
              <MousePointer2 className="absolute bottom-1 right-1 h-5 w-5 text-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Apple Mail mockups
function AppleMailMockup1() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center text-sm font-medium">Mail</div>
      </div>
      <div className="bg-gray-800 text-white text-xs px-4 py-1 flex gap-4">
        <span className="font-bold">Mail</span>
        <span>Soubor</span>
        <span>Úpravy</span>
        <span className="relative">
          <span className="bg-blue-500 px-2 rounded">Nastavení</span>
          <MousePointer2 className="absolute -bottom-3 left-1/2 h-4 w-4 text-yellow-300 animate-bounce" />
        </span>
      </div>
      <div className="p-4 bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

function AppleMailMockup2() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center text-sm font-medium">Nastavení</div>
      </div>
      <div className="flex text-xs border-b bg-gray-50">
        <div className="px-3 py-2">Obecné</div>
        <div className="px-3 py-2">Účty</div>
        <div className="px-3 py-2 bg-white border-b-2 border-primary font-medium text-primary">Podpisy</div>
        <div className="px-3 py-2">Pravidla</div>
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-24 border rounded p-2 space-y-1">
            <div className="text-xs bg-primary/10 rounded p-1">Můj účet</div>
          </div>
          <div className="flex-1 relative">
            <Button size="sm" variant="outline" className="mb-2 bg-transparent">
              <Plus className="h-3 w-3 mr-1" /> Přidat podpis
            </Button>
            <MousePointer2 className="absolute top-0 left-28 h-5 w-5 text-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AppleMailMockup3() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 border-b text-sm font-medium text-center">Nastavení podpisu</div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0" />
          <div>
            <span className="font-medium">Odškrtněte:</span> "Vždy používat výchozí písmo zprávy"
          </div>
        </div>
        <div className="border-2 border-dashed border-primary rounded p-3 bg-primary/5 relative">
          <div className="text-xs text-primary flex items-center gap-1">
            <ClipboardPaste className="h-4 w-4" />
            Vložte podpis (Cmd+V)
          </div>
          <MousePointer2 className="absolute bottom-1 right-1 h-5 w-5 text-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}

// Thunderbird mockups
function ThunderbirdMockup1() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-blue-800 px-4 py-2 text-white text-sm font-bold">Thunderbird</div>
      <div className="flex">
        <div className="w-48 bg-gray-100 p-2 border-r">
          <div className="text-xs font-medium mb-2">Účty</div>
          <div className="relative p-2 bg-white rounded border text-xs">
            <Mail className="h-4 w-4 inline mr-1" />
            vas@email.cz
            <div className="absolute -right-1 -bottom-1 text-[10px] bg-primary text-white px-1 rounded">
              Pravý klik
            </div>
            <MousePointer2 className="absolute -bottom-3 right-4 h-5 w-5 text-primary animate-bounce" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="absolute right-16 top-20 bg-white shadow-xl rounded border text-xs">
        <div className="px-3 py-2 hover:bg-gray-100">Nová zpráva</div>
        <div className="px-3 py-2 bg-primary/10 text-primary font-medium">Nastavení</div>
      </div>
    </div>
  )
}

function ThunderbirdMockup2() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium">Nastavení účtu</div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked readOnly className="accent-primary" />
          <span className="text-sm font-medium">Použít HTML</span>
          <MousePointer2 className="h-4 w-4 text-primary animate-bounce" />
        </div>
        <div className="text-xs text-muted-foreground">Text podpisu:</div>
        <div className="border-2 border-dashed border-primary rounded p-3 bg-primary/5 relative min-h-[60px]">
          <div className="text-xs text-primary flex items-center gap-1">
            <ClipboardPaste className="h-4 w-4" />
            Vložte HTML kód podpisu
          </div>
          <MousePointer2 className="absolute bottom-1 right-1 h-5 w-5 text-primary animate-bounce" />
        </div>
        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
          <span>Použijte tlačítko <strong>"Kopírovat HTML kód"</strong>, ne vizuální náhled!</span>
        </div>
      </div>
    </div>
  )
}

function ThunderbirdMockup3() {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b text-sm font-medium">Nastavení účtu - Import ze souboru</div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <input type="radio" checked readOnly className="accent-primary" />
          <span className="text-sm font-medium text-primary">Připojit podpis ze souboru</span>
          <MousePointer2 className="h-4 w-4 text-primary animate-bounce" />
        </div>
        <div className="flex items-center gap-2 ml-5">
          <input type="radio" readOnly className="accent-gray-400" />
          <span className="text-sm text-muted-foreground">Použít HTML text</span>
        </div>
        <div className="mt-3 border-2 border-dashed border-primary rounded p-3 bg-primary/5 relative">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-xs font-medium">podpis-jan-novak.html</div>
              <div className="text-[10px] text-muted-foreground">/Users/jmeno/Downloads/</div>
            </div>
            <button className="text-xs bg-gray-200 px-2 py-1 rounded">Procházet...</button>
          </div>
          <MousePointer2 className="absolute -bottom-2 right-8 h-5 w-5 text-primary animate-bounce" />
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span>Tato varianta je jednodušší - podpis se načte automaticky.</span>
        </div>
      </div>
    </div>
  )
}

// Guide data
const guideData: Record<EmailClient, GuideStep[]> = {
  gmail: [
    {
      title: "Otevřete nastavení",
      description: "Klikněte na ikonu ozubeného kolečka v pravém horním rohu a vyberte \"Zobrazit všechna nastavení\".",
      icon: <GmailSettingsIcon />,
      mockup: <GmailMockup1 />,
      tip: "Nastavení najdete i přes menu na mobilním zařízení."
    },
    {
      title: "Najděte sekci Podpis",
      description: "V nastavení sjeďte dolů na stránce. Sekce \"Podpis\" je přibližně uprostřed stránky.",
      icon: <FileText className="h-6 w-6" />,
      mockup: <GmailMockup2 />
    },
    {
      title: "Vložte podpis",
      description: "Vytvořte nový podpis nebo upravte existující. Klikněte do editoru a vložte zkopírovaný podpis pomocí Ctrl+V (nebo Cmd+V na Macu).",
      icon: <ClipboardPaste className="h-6 w-6" />,
      mockup: <GmailMockup3 />,
      tip: "Můžete mít více podpisů pro různé účely."
    },
    {
      title: "Uložte změny",
      description: "Nezapomeňte sjet úplně dolů a kliknout na tlačítko \"Uložit změny\". Bez tohoto kroku se podpis neuloží!",
      icon: <Save className="h-6 w-6" />,
      mockup: <GmailMockup4 />,
      warning: "Pokud neuložíte, změny se ztratí!"
    }
  ],
  "outlook-web": [
    {
      title: "Otevřete nastavení",
      description: "Klikněte na ikonu ozubeného kolečka v pravém horním rohu obrazovky.",
      icon: <Settings className="h-6 w-6" />,
      mockup: <OutlookWebMockup1 />
    },
    {
      title: "Vyhledejte podpis",
      description: "Do vyhledávacího pole napište \"Podpis e-mailu\" a vyberte odpovídající výsledek.",
      icon: <Search className="h-6 w-6" />,
      mockup: <OutlookWebMockup2 />,
      tip: "Vyhledávání je nejrychlejší způsob jak najít nastavení."
    },
    {
      title: "Vložte a uložte",
      description: "Vložte podpis do editoru pomocí Ctrl+V a uložte změny.",
      icon: <ClipboardPaste className="h-6 w-6" />,
      mockup: <OutlookWebMockup3 />
    }
  ],
  "outlook-windows": [
    {
      title: "Otevřete Možnosti",
      description: "Klikněte na \"Soubor\" v horním menu a poté vyberte \"Možnosti\" v levém panelu.",
      icon: <Settings className="h-6 w-6" />,
      mockup: <OutlookWindowsMockup1 />
    },
    {
      title: "Přejděte na Podpisy",
      description: "V okně Možnosti vyberte \"Pošta\" a klikněte na tlačítko \"Podpisy...\"",
      icon: <FileText className="h-6 w-6" />,
      mockup: <OutlookWindowsMockup2 />
    },
    {
      title: "Vložte podpis",
      description: "Vytvořte nový podpis, vyberte svůj účet a vložte podpis do spodního editovacího pole. Potvrďte OK.",
      icon: <ClipboardPaste className="h-6 w-6" />,
      mockup: <OutlookWindowsMockup3 />,
      tip: "Nastavte podpis jako výchozí pro nové zprávy i odpovědi."
    }
  ],
  "apple-mail": [
    {
      title: "Otevřete Nastavení",
      description: "V aplikaci Mail klikněte na \"Mail\" v horním menu a vyberte \"Nastavení\" (nebo použijte Cmd+,).",
      icon: <Settings className="h-6 w-6" />,
      mockup: <AppleMailMockup1 />
    },
    {
      title: "Přejděte na Podpisy",
      description: "V okně Nastavení klikněte na záložku \"Podpisy\" a vyberte svůj e-mailový účet.",
      icon: <FileText className="h-6 w-6" />,
      mockup: <AppleMailMockup2 />
    },
    {
      title: "Vložte podpis",
      description: "Vytvořte nový podpis a vložte jej pomocí Cmd+V. DŮLEŽITÉ: Odškrtněte \"Vždy používat výchozí písmo zprávy\"!",
      icon: <ClipboardPaste className="h-6 w-6" />,
      mockup: <AppleMailMockup3 />,
      warning: "Bez odškrtnutí této možnosti se formátování podpisu rozhodí!"
    }
  ],
  thunderbird: [
    {
      title: "Otevřete nastavení účtu",
      description: "Klikněte pravým tlačítkem na váš e-mailový účet v levém panelu a vyberte \"Nastavení\".",
      icon: <Settings className="h-6 w-6" />,
      mockup: <ThunderbirdMockup1 />
    },
    {
      title: "Varianta A: HTML kód",
      description: "Zaškrtněte \"Použít HTML\" a vložte zkopírovaný HTML kód. Použijte tlačítko \"Kopírovat HTML kód\" v aplikaci.",
      icon: <ClipboardPaste className="h-6 w-6" />,
      mockup: <ThunderbirdMockup2 />,
      warning: "V Thunderbirdu musíte použít HTML kód, ne vizuální kopii!"
    },
    {
      title: "Varianta B: Import ze souboru (doporučeno)",
      description: "Stáhněte HTML soubor pomocí tlačítka \"Stáhnout HTML\". V nastavení účtu zvolte \"Připojit podpis ze souboru\" a vyberte stažený soubor.",
      icon: <FileText className="h-6 w-6" />,
      mockup: <ThunderbirdMockup3 />,
      tip: "Tato varianta je jednodušší - podpis se načte automaticky ze souboru a můžete jej snadno aktualizovat."
    }
  ]
}

const clientNames: Record<EmailClient, string> = {
  gmail: "Gmail",
  "outlook-web": "Outlook Web",
  "outlook-windows": "Outlook Windows",
  "apple-mail": "Apple Mail",
  thunderbird: "Thunderbird"
}

const clientIcons: Record<EmailClient, React.ReactNode> = {
  gmail: <Mail className="h-5 w-5" />,
  "outlook-web": <Globe className="h-5 w-5" />,
  "outlook-windows": <Monitor className="h-5 w-5" />,
  "apple-mail": <Apple className="h-5 w-5" />,
  thunderbird: <Mail className="h-5 w-5" />
}

interface InteractiveGuideProps {
  client: EmailClient
  onClose?: () => void
}

export function InteractiveGuide({ client, onClose }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = guideData[client]
  const step = steps[currentStep]
  
  const progress = ((currentStep + 1) / steps.length) * 100
  
  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {clientIcons[client]}
        </div>
        <div>
          <h3 className="font-semibold">Jak nastavit podpis v {clientNames[client]}</h3>
          <p className="text-sm text-muted-foreground">Krok {currentStep + 1} z {steps.length}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentStep 
                ? "bg-primary scale-125" 
                : index < currentStep 
                  ? "bg-primary/50" 
                  : "bg-secondary"
            )}
            aria-label={`Přejít na krok ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Step content */}
      <Card className="p-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
            {step.icon}
          </div>
          <div>
            <h4 className="font-semibold text-lg">{step.title}</h4>
            <p className="text-muted-foreground mt-1">{step.description}</p>
          </div>
        </div>
        
        {/* Mockup */}
        <div className="relative mt-4 mb-4 p-4 bg-muted/50 rounded-xl overflow-hidden">
          <div className="transform scale-90 origin-top-left">
            {step.mockup}
          </div>
        </div>
        
        {/* Tip or Warning */}
        {step.tip && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{step.tip}</span>
          </div>
        )}
        
        {step.warning && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="font-medium">{step.warning}</span>
          </div>
        )}
      </Card>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Zpět
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button onClick={onClose} className="gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Hotovo!
          </Button>
        ) : (
          <Button onClick={goNext} className="gap-2">
            Další
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
