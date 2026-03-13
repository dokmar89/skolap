"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui"
import { Copy, Check, Mail, Monitor, Apple, Globe, User, Briefcase, Phone, MapPin, Download, Terminal, AlertTriangle, FileCode, Smartphone, Tablet, FileDown, Maximize2 } from "lucide-react"
import { InteractiveGuide } from "@/components/interactive-guide"
import { PlayCircle, BookOpen } from "lucide-react"

type EmailClient = "gmail" | "outlook-web" | "outlook-windows" | "apple-mail" | "thunderbird"
type DevicePreview = "phone" | "tablet" | "desktop" | "full"

const officeAddresses = [
  "Trida Svobody 956/31, 779 00 Olomouc",
] as const

interface FormData {
  fullName: string
  jobPosition: string
  phoneNumber: string
  emailAddress: string
  officeAddress: string
}

const installationGuides: Record<EmailClient, { title: string; steps: string[] }> = {
  gmail: {
    title: "Gmail",
    steps: [
      "Klikněte na ozubené kolečko (Nastavení) > \"Zobrazit všechna nastavení\".",
      "Sjeďte dolů k sekci \"Podpis\".",
      "Vytvořte nový nebo vyberte existující.",
      "Vložte (Ctrl+V) zkopírovaný podpis do textového pole.",
      "Dole na stránce klikněte na \"Uložit změny\".",
    ],
  },
  "outlook-web": {
    title: "Outlook Web (Prohlížeč)",
    steps: [
      "Klikněte na ozubené kolečko (Nastavení).",
      "Do vyhledávání napište \"Podpis e-mailu\".",
      "Vložte (Ctrl+V) podpis do editoru.",
      "Uložte.",
    ],
  },
  "outlook-windows": {
    title: "Outlook (Windows Aplikace)",
    steps: [
      "Jděte do Soubor > Možnosti > Pošta.",
      "Klikněte na tlačítko \"Podpisy...\".",
      "Vyberte svůj účet a vytvořte nový podpis.",
      "Vložte (Ctrl+V) podpis do spodního pole.",
      "Potvrďte OK.",
    ],
  },
  "apple-mail": {
    title: "Apple Mail (Mac)",
    steps: [
      "Otevřete Mail > Nastavení (Settings) > Podpisy.",
      "Vyberte svůj účet.",
      "DŮLEŽITÉ: Odškrtněte možnost \"Vždy používat výchozí písmo zprávy\" (Always match my default message font), jinak se podpis rozhodí.",
      "Vložte (Cmd+V) podpis.",
    ],
  },
  thunderbird: {
    title: "Thunderbird",
    steps: [
      "Klikněte pravým tlačítkem na svůj účet vlevo > Nastavení.",
      "Varianta A: Zaškrtněte \"Použít HTML\" a vložte zkopírovaný HTML kód.",
      "Varianta B: Zvolte \"Připojit podpis ze souboru\" a vyberte stažený HTML soubor.",
      "Varianta B je doporučená - podpis se načte ze souboru automaticky.",
    ],
  },
}

type ScriptType = "powershell" | "bat" | "macos-easy" | "macos-hardcore" | "linux-thunderbird"

interface ScriptInfo {
  name: string
  filename: string
  description: string
  icon: React.ReactNode
  warning?: string
  os: string
}

const scriptInfos: Record<ScriptType, ScriptInfo> = {
  powershell: {
    name: "PowerShell (.ps1)",
    filename: "nastavit-podpis-outlook.ps1",
    description: "Automaticky nastaví podpis v Microsoft Outlook na Windows. Vyžaduje administrátorská práva.",
    icon: <Terminal className="h-5 w-5" />,
    os: "Windows",
  },
  bat: {
    name: "Batch soubor (.bat)",
    filename: "nastavit-podpis-outlook.bat",
    description: "Jednoduchý BAT soubor pro Windows. Vytvoří HTML soubor s podpisem a otevře složku s podpisy Outlooku.",
    icon: <FileCode className="h-5 w-5" />,
    os: "Windows",
  },
  "macos-easy": {
    name: "macOS - Snadná varianta (.sh)",
    filename: "nastavit-podpis-apple-mail.sh",
    description: "Vytvoří HTML soubor s podpisem na ploše. Poté je nutné podpis ručně vložit do Apple Mail.",
    icon: <Apple className="h-5 w-5" />,
    os: "macOS",
  },
  "macos-hardcore": {
    name: "macOS - Pokročilá varianta (.sh)",
    filename: "nastavit-podpis-apple-mail-auto.sh",
    description: "POZOR: Upravuje skryté systémové soubory Apple Mail v ~/Library/Mail. Vytvoří zálohu před změnami.",
    icon: <Apple className="h-5 w-5" />,
    warning: "Tento skript upravuje skryté systémové soubory. Používejte pouze pokud víte, co děláte!",
    os: "macOS",
  },
  "linux-thunderbird": {
    name: "Linux Thunderbird (.sh)",
    filename: "nastavit-podpis-thunderbird.sh",
    description: "Vytvoří HTML soubor s podpisem a nakonfiguruje Thunderbird na Linuxu.",
    icon: <Terminal className="h-5 w-5" />,
    os: "Linux",
  },
}

function generatePowerShellScript(data: FormData, signatureHtml: string): string {
  const escapedHtml = signatureHtml.replace(/`/g, '``').replace(/\$/g, '`$')
  return `# Skript pro nastavení e-mailového podpisu v Microsoft Outlook
# Škola Populo - Automatický instalátor podpisu
# Spusťte jako administrátor: Right-click > "Spustit jako správce"

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Škola Populo - Instalace podpisu" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Jméno podpisu
$signatureName = "Skola-Populo-${data.fullName.replace(/\s+/g, '-')}"

# Cesta k složce s podpisy Outlooku
$signaturesPath = "$env:APPDATA\\Microsoft\\Signatures"

# Vytvoření složky pokud neexistuje
if (!(Test-Path $signaturesPath)) {
    New-Item -ItemType Directory -Path $signaturesPath -Force | Out-Null
    Write-Host "[OK] Vytvořena složka pro podpisy" -ForegroundColor Green
}

# HTML obsah podpisu
$signatureHtml = @"
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
${escapedHtml}
</body>
</html>
"@

# Uložení HTML verze
$htmlPath = "$signaturesPath\\$signatureName.htm"
$signatureHtml | Out-File -FilePath $htmlPath -Encoding UTF8
Write-Host "[OK] Vytvořen HTML podpis: $htmlPath" -ForegroundColor Green

# Vytvoření textové verze (plain text)
$plainText = @"
${data.fullName} | ${data.jobPosition}
Škola Populo - Doučování na míru

Tel: ${data.phoneNumber}
E-mail: ${data.emailAddress}
Web: www.skolapopulo.cz
Adresa: ${data.officeAddress}

--
Ve Škole Populo věříme, že každý může dosáhnout skvělých výsledků.
"@

$txtPath = "$signaturesPath\\$signatureName.txt"
$plainText | Out-File -FilePath $txtPath -Encoding UTF8
Write-Host "[OK] Vytvořen textový podpis: $txtPath" -ForegroundColor Green

# Vytvoření RTF verze (základní)
$rtfPath = "$signaturesPath\\$signatureName.rtf"
$rtfContent = "{\\rtf1\\ansi\\deff0 $plainText}"
$rtfContent | Out-File -FilePath $rtfPath -Encoding ASCII
Write-Host "[OK] Vytvořen RTF podpis: $rtfPath" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  HOTOVO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Podpis '$signatureName' byl úspěšně nainstalován." -ForegroundColor White
Write-Host ""
Write-Host "Nyní otevřete Outlook a:" -ForegroundColor Yellow
Write-Host "1. Jděte do: Soubor > Možnosti > Pošta > Podpisy" -ForegroundColor Yellow
Write-Host "2. Vyberte podpis '$signatureName'" -ForegroundColor Yellow
Write-Host "3. Nastavte jej jako výchozí pro nové zprávy" -ForegroundColor Yellow
Write-Host ""
Write-Host "Stiskněte libovolnou klávesu pro ukončení..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`
}

function generateBatScript(data: FormData, signatureHtml: string): string {
  const escapedHtml = signatureHtml.replace(/%/g, '%%').replace(/"/g, '\\"')
  return `@echo off
chcp 65001 >nul
title Škola Populo - Instalace podpisu

echo ============================================
echo   Škola Populo - Instalace podpisu
echo ============================================
echo.

set "SIGNATURES_PATH=%APPDATA%\\Microsoft\\Signatures"
set "SIGNATURE_NAME=Skola-Populo-Podpis"

:: Vytvoření složky pokud neexistuje
if not exist "%SIGNATURES_PATH%" (
    mkdir "%SIGNATURES_PATH%"
    echo [OK] Vytvořena složka pro podpisy
)

:: Vytvoření HTML souboru
echo ^<!DOCTYPE html^>^<html^>^<head^>^<meta charset="UTF-8"^>^</head^>^<body^>${escapedHtml}^</body^>^</html^> > "%SIGNATURES_PATH%\\%SIGNATURE_NAME%.htm"

echo [OK] Podpis byl vytvořen!
echo.
echo Cesta k podpisu: %SIGNATURES_PATH%\\%SIGNATURE_NAME%.htm
echo.
echo Otevírám složku s podpisy...
explorer "%SIGNATURES_PATH%"

echo.
echo ============================================
echo   HOTOVO!
echo ============================================
echo.
echo Nyní v Outlooku:
echo 1. Soubor ^> Možnosti ^> Pošta ^> Podpisy
echo 2. Vyberte "Skola-Populo-Podpis"
echo.
pause
`
}

function generateMacOSEasyScript(data: FormData, signatureHtml: string): string {
  const escapedHtml = signatureHtml.replace(/'/g, "'\\''")
  return `#!/bin/bash
# Škola Populo - Vytvoření podpisu pro Apple Mail (Snadná varianta)
# Tento skript vytvoří HTML soubor na ploše

echo "============================================"
echo "  Škola Populo - Vytvoření podpisu"
echo "============================================"
echo ""

# Cesta k souboru na ploše
OUTPUT_FILE="$HOME/Desktop/podpis-skola-populo.html"

# Vytvoření HTML souboru
cat > "$OUTPUT_FILE" << 'SIGNATURE_EOF'
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Podpis - ${data.fullName}</title>
</head>
<body>
${signatureHtml}
</body>
</html>
SIGNATURE_EOF

echo "[OK] Podpis byl vytvořen na ploše!"
echo ""
echo "Soubor: $OUTPUT_FILE"
echo ""
echo "============================================"
echo "  DALŠÍ KROKY:"
echo "============================================"
echo ""
echo "1. Otevřete soubor 'podpis-skola-populo.html' na ploše"
echo "2. Vyberte vše (Cmd+A) a zkopírujte (Cmd+C)"
echo "3. Otevřete Mail > Nastavení > Podpisy"
echo "4. Vytvořte nový podpis a vložte (Cmd+V)"
echo "5. DŮLEŽITÉ: Odškrtněte 'Vždy používat výchozí písmo'"
echo ""
echo "Hotovo!"
`
}

function generateMacOSHardcoreScript(data: FormData, signatureHtml: string): string {
  const escapedHtml = signatureHtml.replace(/'/g, "'\\''")
  return `#!/bin/bash
# Škola Populo - Automatická instalace podpisu pro Apple Mail
# POZOR: Tento skript upravuje skryté systémové soubory!
# Před spuštěním se ujistěte, že máte zálohu.

set -e

echo "============================================"
echo "  Škola Populo - POKROČILÁ instalace"
echo "============================================"
echo ""
echo "⚠️  VAROVÁNÍ: Tento skript upravuje systémové soubory!"
echo ""
read -p "Chcete pokračovat? (ano/ne): " CONFIRM

if [ "$CONFIRM" != "ano" ]; then
    echo "Instalace zrušena."
    exit 0
fi

echo ""
echo "[1/5] Hledám složku s podpisy Apple Mail..."

# Najít složku s podpisy (liší se podle verze macOS)
MAIL_DATA="$HOME/Library/Mail"
SIGNATURES_DIR=""

# Hledání V9, V10, V11 atd.
for version in V11 V10 V9 V8 V7 V6 V5 V4 V3 V2; do
    POTENTIAL_DIR="$MAIL_DATA/$version/MailData/Signatures"
    if [ -d "$POTENTIAL_DIR" ]; then
        SIGNATURES_DIR="$POTENTIAL_DIR"
        echo "[OK] Nalezena složka: $SIGNATURES_DIR"
        break
    fi
done

if [ -z "$SIGNATURES_DIR" ]; then
    echo "[!] Složka s podpisy nenalezena."
    echo "    Vytvářím novou strukturu..."
    SIGNATURES_DIR="$MAIL_DATA/V10/MailData/Signatures"
    mkdir -p "$SIGNATURES_DIR"
fi

echo ""
echo "[2/5] Vytvářím zálohu..."
BACKUP_DIR="$HOME/Desktop/AppleMail-Backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -R "$SIGNATURES_DIR" "$BACKUP_DIR/" 2>/dev/null || echo "    (žádné existující podpisy k zálohování)"
echo "[OK] Záloha vytvořena: $BACKUP_DIR"

echo ""
echo "[3/5] Generuji unikátní ID podpisu..."
SIGNATURE_UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
echo "[OK] UUID: $SIGNATURE_UUID"

echo ""
echo "[4/5] Vytvářím soubory podpisu..."

# Vytvoření .mailsignature souboru
SIGNATURE_FILE="$SIGNATURES_DIR/$SIGNATURE_UUID.mailsignature"

cat > "$SIGNATURE_FILE" << SIGNATURE_EOF
Content-Type: text/html;
	charset=utf-8
Content-Transfer-Encoding: quoted-printable
Mime-Version: 1.0

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
${signatureHtml}
</body>
</html>
SIGNATURE_EOF

echo "[OK] Vytvořen soubor: $SIGNATURE_FILE"

echo ""
echo "[5/5] Nastavuji atributy souboru..."
# Zamknout soubor aby ho Mail nepřepsal
chflags uchg "$SIGNATURE_FILE"
echo "[OK] Soubor byl uzamčen proti přepsání"

echo ""
echo "============================================"
echo "  ✅ INSTALACE DOKONČENA!"
echo "============================================"
echo ""
echo "Nyní:"
echo "1. Zavřete aplikaci Mail (úplně, i z Docku)"
echo "2. Znovu otevřete Mail"
echo "3. Jděte do Mail > Nastavení > Podpisy"
echo "4. Měli byste vidět nový podpis"
echo ""
echo "Pokud se podpis nezobrazuje správně:"
echo "- Odškrtněte 'Vždy používat výchozí písmo'"
echo ""
echo "Záloha byla uložena na plochu pro případ problémů."
echo ""
`
}

function generateLinuxThunderbirdScript(data: FormData, signatureHtml: string): string {
  return `#!/bin/bash
# Škola Populo - Instalace podpisu pro Thunderbird (Linux)

echo "============================================"
echo "  Škola Populo - Instalace podpisu"
echo "============================================"
echo ""

# Vytvoření složky pro podpisy
SIGNATURES_DIR="$HOME/.thunderbird-signatures"
mkdir -p "$SIGNATURES_DIR"

# Cesta k souboru podpisu
SIGNATURE_FILE="$SIGNATURES_DIR/skola-populo.html"

echo "[1/3] Vytvářím HTML soubor s podpisem..."

cat > "$SIGNATURE_FILE" << 'SIGNATURE_EOF'
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
${signatureHtml}
</body>
</html>
SIGNATURE_EOF

echo "[OK] Podpis uložen: $SIGNATURE_FILE"

echo ""
echo "[2/3] Hledám profil Thunderbirdu..."

TB_PROFILE_DIR="$HOME/.thunderbird"
if [ -d "$TB_PROFILE_DIR" ]; then
    PROFILE=$(ls -d "$TB_PROFILE_DIR"/*.default* 2>/dev/null | head -1)
    if [ -n "$PROFILE" ]; then
        echo "[OK] Nalezen profil: $PROFILE"
        
        # Informace o prefs.js
        echo ""
        echo "[3/3] Pro automatické nastavení přidejte do prefs.js:"
        echo ""
        echo "  user_pref(\"mail.identity.id1.sig_file\", \"$SIGNATURE_FILE\");"
        echo "  user_pref(\"mail.identity.id1.sig_on_fwd\", true);"
        echo "  user_pref(\"mail.identity.id1.sig_on_reply\", true);"
        echo ""
    fi
else
    echo "[!] Thunderbird profil nenalezen"
fi

echo ""
echo "============================================"
echo "  HOTOVO!"
echo "============================================"
echo ""
echo "Ruční nastavení v Thunderbirdu:"
echo "1. Klikněte pravým na účet > Nastavení"
echo "2. Zaškrtněte 'Připojit podpis ze souboru'"
echo "3. Vyberte: $SIGNATURE_FILE"
echo ""
`
}

function generateScript(type: ScriptType, data: FormData): string {
  const signatureHtml = generateSignatureHTML(data)
  
  switch (type) {
    case "powershell":
      return generatePowerShellScript(data, signatureHtml)
    case "bat":
      return generateBatScript(data, signatureHtml)
    case "macos-easy":
      return generateMacOSEasyScript(data, signatureHtml)
    case "macos-hardcore":
      return generateMacOSHardcoreScript(data, signatureHtml)
    case "linux-thunderbird":
      return generateLinuxThunderbirdScript(data, signatureHtml)
  }
}

function downloadScript(type: ScriptType, data: FormData) {
  const script = generateScript(type, data)
  const info = scriptInfos[type]
  const blob = new Blob([script], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = info.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateSignatureHTML(data: FormData): string {
  return `<table style="width: 449px;">
	<tbody>
		<tr>
			<td rowspan="1" style="width: 41px;">
			<div>
			<div style="text-align:center"><img alt="" data-widget="image" height="30" src="https://i.imgur.com/8EnPLvz.png" style="cursor: default; height: 38px; width: 26px;" width="21" /></div>
			</div>
			</td>
			<td colspan="2" style="width: 392px;">
			<div><span style="font-size:12px;"><span style="font-family:arial;"><strong>&nbsp;<br />
			&nbsp; ${data.fullName}</strong>&nbsp; | &nbsp;${data.jobPosition}<br />
			&nbsp; Škola Populo - Doučování na míru</span></span><br />
			&nbsp;</div>
			</td>
		</tr>
		<tr>
			<td style="width: 41px;">
			<div data-widget="image" style="text-align: center;"><img alt="" height="20" src="https://i.imgur.com/ihdnUBN.png" style="cursor: default; height: 15px; width: 15px;" width="20" /></div>
			</td>
			<td colspan="2" rowspan="1" style="width: 392px;"><span style="font-size:12px;"><span style="font-family:arial;">&nbsp;<span style="color:#ADD8E6;"> |</span>&nbsp;${data.phoneNumber}</span></span></td>
		</tr>
		<tr>
			<td style="width: 41px;">
			<div data-widget="image" style="text-align: center;"><img alt="" src="https://i.imgur.com/tRFuAsf.png" style="cursor: default; height: 15px; width: 15px;" /></div>
			</td>
			<td colspan="2" rowspan="1" style="width: 392px;"><span style="font-size:12px;"><span style="font-family:arial;">&nbsp;<span style="color:#ADD8E6;"> |</span>&nbsp;${data.emailAddress}</span> </span></td>
		</tr>
		<tr>
			<td style="width: 41px;">
			<div data-widget="image" style="text-align: center;"><img alt="" src="https://i.imgur.com/5fnOxrD.png" style="cursor: default; height: 15px; width: 15px;" /></div>
			</td>
			<td colspan="2" rowspan="1" style="width: 392px;"><span style="font-size:12px;"><span style="font-family:arial;">&nbsp;<span style="color:#ADD8E6;"> |</span>&nbsp;www.skolapopulo.cz</span> </span></td>
		</tr>
		<tr>
			<td style="width: 41px;">
			<div data-widget="image" style="text-align: center;"><img alt="" src="https://i.imgur.com/FeXjLKQ.png" style="cursor: default; height: 15px; width: 15px;" /></div>
			</td>
			<td colspan="2" rowspan="1" style="width: 392px;"><span style="font-size:12px;"><span style="font-family:arial;">&nbsp;<span style="color:#ADD8E6;"> |</span>&nbsp;${data.officeAddress}</span> </span></td>
		</tr>
	</tbody>
</table>

<hr />
<p><span style="font-size:12px;"><span style="font-family:arial;">Ve Škole Populo věříme, že každý může dosáhnout skvělých výsledků.</span></span></p>

<p><span style="font-size:12px;"><span style="font-family:arial;">Tento e-mail je důvěrný a může obsahovat citlivé obchodní informace. Je určený výhradně jeho adresátovi. Jeho zveřejňování, jiné použití nebo zprostředkování je zakázáno, nejste-li oprávněným adresátem. V případě, že nejste oprávněným adresátem tohoto e-mailu, prosím, smažte jej i s přiloženými soubory a informujte o tom odesílatele.</span></span></p>`
}

interface SignatureGeneratorProps {
  embedded?: boolean
}

export function SignatureGenerator({ embedded = false }: SignatureGeneratorProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    jobPosition: "",
    phoneNumber: "",
    emailAddress: "",
    officeAddress: "",
  })
  const [selectedClient, setSelectedClient] = useState<EmailClient>("gmail")
  const [copied, setCopied] = useState(false)
  const [scriptDialogOpen, setScriptDialogOpen] = useState(false)
  const [downloadedScript, setDownloadedScript] = useState<ScriptType | null>(null)
  const [guideDialogOpen, setGuideDialogOpen] = useState(false)
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop")
  const previewRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isVisualCopyClient = selectedClient !== "thunderbird"
  const guide = installationGuides[selectedClient]

  const copyToClipboard = async () => {
    try {
      if (isVisualCopyClient && previewRef.current) {
        // Visual copy - copy rendered HTML content
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(previewRef.current)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // Create a ClipboardItem with both HTML and plain text
        const htmlContent = previewRef.current.innerHTML
        const plainText = previewRef.current.innerText

        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
          }),
        ])

        selection?.removeAllRanges()
      } else {
        // Source copy - copy raw HTML string
        const htmlString = generateSignatureHTML(formData)
        await navigator.clipboard.writeText(htmlString)
      }

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      // Fallback for browsers that don't support ClipboardItem
      if (previewRef.current) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(previewRef.current)
        selection?.removeAllRanges()
        selection?.addRange(range)
        document.execCommand("copy")
        selection?.removeAllRanges()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleScriptDownload = (type: ScriptType) => {
    downloadScript(type, formData)
    setDownloadedScript(type)
    setTimeout(() => setDownloadedScript(null), 2000)
  }

  const isFormComplete = formData.fullName && formData.jobPosition && formData.phoneNumber && formData.emailAddress && formData.officeAddress

  const downloadHtmlFile = () => {
    const signatureHtml = generateSignatureHTML(formData)
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Podpis - ${formData.fullName} - Škola Populo</title>
</head>
<body>
${signatureHtml}
</body>
</html>`
    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `podpis-${formData.fullName.replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deviceWidths: Record<DevicePreview, string> = {
    phone: "320px",
    tablet: "600px",
    desktop: "100%",
    full: "100%",
  }

  const deviceLabels: Record<DevicePreview, string> = {
    phone: "Telefon (320px)",
    tablet: "Tablet (600px)",
    desktop: "Desktop",
    full: "Celá šířka",
  }

  const clientIcons: Record<EmailClient, React.ReactNode> = {
    gmail: <Mail className="h-4 w-4" />,
    "outlook-web": <Globe className="h-4 w-4" />,
    "outlook-windows": <Monitor className="h-4 w-4" />,
    "apple-mail": <Apple className="h-4 w-4" />,
    thunderbird: <Mail className="h-4 w-4" />,
  }

  return (
    <div className={embedded ? "" : "min-h-screen bg-background p-4 md:p-8"}>
      <div className="w-full">
        {/* Header */}
        {!embedded && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Generator e-mailoveho podpisu
            </h1>
            <p className="mt-2 text-muted-foreground">
              Interni nastroj pro zamestnance Skoly Populo
            </p>
          </div>
        )}
        {embedded && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Generator e-mailoveho podpisu</h1>
            <p className="mt-1 text-muted-foreground">
              Vytvorte si profesionalni e-mailovy podpis podle firemniho vzoru.
            </p>
          </div>
        )}

        {/* 1. Vyberte e-mailového klienta - celá šířka nahoře */}
        <Card className="border-border/50 shadow-lg mb-6">
          <CardHeader className="border-b border-border/50 bg-secondary/30">
            <CardTitle className="text-foreground">Vyberte e-mailového klienta</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={selectedClient} onValueChange={(v) => setSelectedClient(v as EmailClient)}>
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-muted/50 p-2 md:grid-cols-5">
                <TabsTrigger
                  value="gmail"
                  className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {clientIcons.gmail}
                  <span className="hidden sm:inline">Gmail</span>
                </TabsTrigger>
                <TabsTrigger
                  value="outlook-web"
                  className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {clientIcons["outlook-web"]}
                  <span className="hidden sm:inline">Outlook Web</span>
                </TabsTrigger>
                <TabsTrigger
                  value="outlook-windows"
                  className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {clientIcons["outlook-windows"]}
                  <span className="hidden sm:inline">Outlook</span>
                </TabsTrigger>
                <TabsTrigger
                  value="apple-mail"
                  className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {clientIcons["apple-mail"]}
                  <span className="hidden sm:inline">Apple</span>
                </TabsTrigger>
                <TabsTrigger
                  value="thunderbird"
                  className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {clientIcons.thunderbird}
                  <span className="hidden sm:inline">Thunderbird</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={copyToClipboard}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Zkopirováno!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" />
                    {isVisualCopyClient ? "Kopírovat podpis" : "Kopírovat HTML kód"}
                  </>
                )}
              </Button>
              <Button
                onClick={downloadHtmlFile}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                size="lg"
                disabled={!isFormComplete}
              >
                <FileDown className="mr-2 h-5 w-5" />
                Stáhnout HTML
              </Button>
            </div>

            {selectedClient === "thunderbird" && (
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <FileCode className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Tip pro Thunderbird</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  V Thunderbirdu můžete také použít volbu "Připojit podpis ze souboru". 
                  Stáhněte HTML soubor pomocí tlačítka výše a v nastavení účtu vyberte 
                  "Připojit podpis ze souboru" místo vkládání HTML kódu.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 2. Dva sloupce: Vaše údaje vlevo, Jak nainstalovat vpravo */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Levý sloupec - Vyplňování údajů */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-primary" />
                Vaše údaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Celé jméno
                </Label>
                <Input
                  id="fullName"
                  placeholder="Jan Novák"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="border-border/50 bg-card focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobPosition" className="flex items-center gap-2 text-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Pracovní pozice
                </Label>
                <Input
                  id="jobPosition"
                  placeholder="Lektor / Manažer pobočky"
                  value={formData.jobPosition}
                  onChange={(e) => handleInputChange("jobPosition", e.target.value)}
                  className="border-border/50 bg-card focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  Telefonní číslo
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+420 xxx xxx xxx"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="border-border/50 bg-card focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  E-mailová adresa
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="jmeno.prijmeni@skolapopulo.cz"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  className="border-border/50 bg-card focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeAddress" className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Adresa pobočky
                </Label>
                <Input
                  id="officeAddress"
                  list="office-addresses"
                  placeholder="Vyberte pobočku nebo zadejte vlastní adresu"
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange("officeAddress", e.target.value)}
                  className="border-border/50 bg-card focus:border-primary"
                />
                <datalist id="office-addresses">
                  {officeAddresses.map((address) => (
                    <option key={address} value={address} />
                  ))}
                </datalist>
              </div>
            </CardContent>
          </Card>

          {/* Pravý sloupec - Jak nainstalovat podpis */}
          <Card className="border-border/50 shadow-lg">
              <CardHeader className="border-b border-border/50 bg-primary/10">
                <CardTitle className="flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    Jak nainstalovat podpis - {guide.title}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Interactive Guide Button */}
                <Dialog open={guideDialogOpen} onOpenChange={setGuideDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mb-4 border-primary bg-primary/5 hover:bg-primary/10 text-primary"
                      size="lg"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Spustit interaktivní průvodce
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <InteractiveGuide 
                      client={selectedClient} 
                      onClose={() => setGuideDialogOpen(false)} 
                    />
                  </DialogContent>
                </Dialog>

                <div className="text-xs text-muted-foreground text-center mb-4">nebo postupujte podle textu</div>

                <ol className="space-y-3">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className={`text-foreground ${step.startsWith("DŮLEŽITÉ") ? "font-semibold text-destructive" : ""}`}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
        </div>

        {/* 3. Náhled podpisu - přes celou šířku */}
        <Card className="border-border/50 shadow-lg mb-6">
          <CardHeader className="border-b border-border/50 bg-secondary/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-foreground">Náhled podpisu</CardTitle>
              <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                <Button
                  variant={devicePreview === "phone" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDevicePreview("phone")}
                  className="h-8 px-2"
                  title="Telefon (320px)"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={devicePreview === "tablet" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDevicePreview("tablet")}
                  className="h-8 px-2"
                  title="Tablet (600px)"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={devicePreview === "desktop" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDevicePreview("desktop")}
                  className="h-8 px-2"
                  title="Desktop"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={devicePreview === "full" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDevicePreview("full")}
                  className="h-8 px-2"
                  title="Celá šířka"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-xs text-muted-foreground text-center mb-2">
              {deviceLabels[devicePreview]}
            </div>
            <div className="flex justify-center">
              <div 
                className={`transition-all duration-300 ${
                  devicePreview === "phone" 
                    ? "rounded-[2rem] border-[8px] border-gray-800 shadow-xl" 
                    : devicePreview === "tablet" 
                      ? "rounded-[1rem] border-[6px] border-gray-700 shadow-lg"
                      : ""
                }`}
                style={{ 
                  maxWidth: deviceWidths[devicePreview],
                  width: "100%",
                }}
              >
                <div
                  ref={previewRef}
                  className={`bg-white p-4 overflow-x-auto ${
                    devicePreview === "phone" 
                      ? "rounded-[1.5rem]" 
                      : devicePreview === "tablet"
                        ? "rounded-[0.5rem]"
                        : "rounded-lg border border-border/50"
                  }`}
                  dangerouslySetInnerHTML={{ __html: generateSignatureHTML(formData) }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Automatická instalace - úplně dole */}
        <Card className="border-border/50 shadow-lg border-dashed border-2 bg-gradient-to-br from-secondary/20 to-accent/10">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Terminal className="h-5 w-5 text-primary" />
              Automatická instalace (pro pokročilé)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Nemáte čas na ruční kopírování? Stáhněte si skript, který vše udělá za vás.
            </p>
            
            <Dialog open={scriptDialogOpen} onOpenChange={setScriptDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/50 hover:bg-primary/10 bg-transparent"
                  disabled={!isFormComplete}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {isFormComplete ? "Stáhnout instalační skript" : "Nejprve vyplňte všechny údaje"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Vyberte instalační skript
                  </DialogTitle>
                  <DialogDescription>
                    Vyberte skript podle vašeho operačního systému a e-mailového klienta.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Windows Section */}
                    <AccordionItem value="windows">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold">Windows</span>
                          <span className="text-xs text-muted-foreground">(Outlook)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(["powershell", "bat"] as ScriptType[]).map((type) => {
                          const info = scriptInfos[type]
                          return (
                            <div key={type} className="rounded-lg border border-border/50 p-4 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    {info.icon}
                                    <span className="font-medium">{info.name}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{info.description}</p>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleScriptDownload(type)}
                                className="w-full"
                                variant="secondary"
                              >
                                {downloadedScript === type ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Staženo!
                                  </>
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Stáhnout {info.filename}
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        })}
                      </AccordionContent>
                    </AccordionItem>

                    {/* macOS Section */}
                    <AccordionItem value="macos">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Apple className="h-5 w-5 text-gray-700" />
                          <span className="font-semibold">macOS</span>
                          <span className="text-xs text-muted-foreground">(Apple Mail)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(["macos-easy", "macos-hardcore"] as ScriptType[]).map((type) => {
                          const info = scriptInfos[type]
                          return (
                            <div key={type} className="rounded-lg border border-border/50 p-4 space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {info.icon}
                                  <span className="font-medium">{info.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{info.description}</p>
                                {info.warning && (
                                  <Alert variant="destructive" className="mt-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Varování</AlertTitle>
                                    <AlertDescription className="text-xs">
                                      {info.warning}
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                              <Button 
                                onClick={() => handleScriptDownload(type)}
                                className="w-full"
                                variant={type === "macos-hardcore" ? "destructive" : "secondary"}
                              >
                                {downloadedScript === type ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Staženo!
                                  </>
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Stáhnout {info.filename}
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        })}

                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                          <strong>Jak spustit .sh skript na macOS:</strong>
                          <ol className="list-decimal list-inside mt-1 space-y-1">
                            <li>Otevřete Terminal (Aplikace → Utility → Terminal)</li>
                            <li>Napište: <code className="bg-background px-1 rounded">chmod +x ~/Downloads/nazev-skriptu.sh</code></li>
                            <li>Napište: <code className="bg-background px-1 rounded">~/Downloads/nazev-skriptu.sh</code></li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Linux Section */}
                    <AccordionItem value="linux">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Terminal className="h-5 w-5 text-orange-500" />
                          <span className="font-semibold">Linux</span>
                          <span className="text-xs text-muted-foreground">(Thunderbird)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        {(["linux-thunderbird"] as ScriptType[]).map((type) => {
                          const info = scriptInfos[type]
                          return (
                            <div key={type} className="rounded-lg border border-border/50 p-4 space-y-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {info.icon}
                                  <span className="font-medium">{info.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{info.description}</p>
                              </div>
                              <Button 
                                onClick={() => handleScriptDownload(type)}
                                className="w-full"
                                variant="secondary"
                              >
                                {downloadedScript === type ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Staženo!
                                  </>
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Stáhnout {info.filename}
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        })}

                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                          <strong>Jak spustit .sh skript na Linuxu:</strong>
                          <ol className="list-decimal list-inside mt-1 space-y-1">
                            <li>Otevřete terminál</li>
                            <li>Napište: <code className="bg-background px-1 rounded">chmod +x ~/Downloads/nazev-skriptu.sh</code></li>
                            <li>Napište: <code className="bg-background px-1 rounded">bash ~/Downloads/nazev-skriptu.sh</code></li>
                          </ol>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </DialogContent>
            </Dialog>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Skripty jsou bezpečné a neobsahují žádný škodlivý kód.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
