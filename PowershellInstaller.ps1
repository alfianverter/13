Add-Type -AssemblyName System.IO.Compression.FileSystem
function Unzip
{
    param([string]$zipfile, [string]$outpath)

    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipfile, $outpath)
}

function Install-Dependancies {
    Write-Host "WARNING: IF YOUR SCRIPT THROWS ERRORS SUCH AS 'the term npm is not recognized' AND 'the term yarn is not recognized' THEN YOU INCORRECTLY TOLD THE SCRIPT THIS IS THE SECOND TIME YOU RUN IT. CANCEL THE SCRIPT AND RE-RUN IT THEN ANSWER 'N' AT THE FIRST PROMPT! IF YOU HAVE DONE THIS PLEASE REBOOT YOUR SYSTEM, RUN THE SCRIPT AGAIN AND ANSWER 'Y' AT THE FIRST PROMPT. IF IT STILL DOESN'T WORK YOU CAN CONTACT ME ON MY SERVER!" -ForegroundColor Red -BackgroundColor Black
    Write-Host "Next lets get your Discord Token" -ForegroundColor Green -BackgroundColor Black
    Write-Host "1. From either the web application, or the installed Discord app, do ""Ctrl + Shift + i""" -ForegroundColor Green -BackgroundColor Black
    Write-Host "2. This brings up the ""Developer Tools"". Go to the ""Application tab""" -ForegroundColor Green -BackgroundColor Black
    Write-Host "3. On the left, expand ""Local Storage"", then click on the discordapp.com entry (it should be the only one)." -ForegroundColor Green -BackgroundColor Black
    Write-Host "4. Locate the entry called ""token"" and copy it" -ForegroundColor Green -BackgroundColor Black
    Write-Host "5. Open this GIF to see the process: https://favna.s-ul.eu/B33EG6HK.gif" -ForegroundColor Green -BackgroundColor Black
     
    $token = Read-Host -Prompt "Please paste your token, INCLUDING the "" "" marks "
    
    Write-Host "Now your User ID" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Enable Discord developer mode by opening settings -> going to appearance -> Enabling Developer Mode" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Click your own name on any message sent by you and click ""COPY ID""" -ForegroundColor Green -BackgroundColor Black
    
    $owner  = Read-Host -Prompt "Please paste your User ID, ONLY the number (so no "" marks)!"
    
    Write-Host "Would you like to set your own global command prefix (default $)? [Y/N]" -ForegroundColor Green 
         $Readhost = Read-Host "[Y/N] " 
         Switch ($ReadHost) 
          { 
            Y {Write-Host "Querying for global command prefix"-ForegroundColor Yellow -BackgroundColor Black; $gcpOpt=$true}
            N {Write-Host "Skipping global command prefix setup and setting it to '$'"-ForegroundColor DarkRed -BackgroundColor Black; $gcpOpt=$false} 
            Default {Write-Host "Skipping global command prefix setup and setting it to '$'"-ForegroundColor DarkRed -BackgroundColor Black; $gcpOpt=$false} 
          }
    
    $gcp = "$"
    
    if($gcpOpt) {
        $gcp  = Read-Host -Prompt "Please enter your global command prefix"
    }
    
    Write-Host "Setting up some dependancies. This may take a couple of minutes to more than 10 minutes depending on fast your system and download speeds are" -ForegroundColor Green -BackgroundColor Black
    
    Write-Host "Installing yarn and build dependencies (this can take some time!)"
    npm i -g yarn windows-build-tools node-pre-gyp node-gyp pm2
       
    Write-Host "Setting up node modules (can take a long time!)"
    yarn install
    
    Write-Host "Generating .env file"
    $EnvVarsToFile =
@"
token={0}
owner="{1}"
prefix="{2}"
googleapikey="API Key for Google Cloud Platform"
imagekey="Google Custom Search Engine key (can be the same as searchkey but not recommended)"
searchkey="Google Custom Search Engine key (can be the same as imagekey but not recommended)"
oxrkey="Open-Exchange-Rates App ID"
moviedbkey="TheMovieDB API Key"
steamkey="Steam API Key"
igdbkey="IGDB API Key"
spotifyid="Spotify App ID"
spotifysecret="Spotify App Secret"
timezonedbkey="Timezonedb API Key"
webhookid="The ID of a webhook"
webhooktoken="The token of a webhook"
"@  -f $token, $owner, $gcp

    $EnvVarsToFile | Out-File -FilePath src\.env -Encoding UTF8
    
    Write-Host "Cleaning up" -ForegroundColor Red -BackgroundColor Black
    Write-Host "Deleting Downloads folder" -ForegroundColor Green -BackgroundColor Black
    Remove-Item -Recurse -Force -Path Downloads\
    
    Write-Host "Starting the bot using pm2" -ForegroundColor Red -BackgroundColor Black
    pm2 start .\src\app.js --name selfbot
    
    Write-Host "pm2 basic usage list" -ForegroundColor Red -BackgroundColor Black
    Write-Host "pm2 stop 0 --> stops the bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 restart 0 --> restarts the bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 list --> shows currently running processes" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 info 0 --> shows detailed info about selfbot process" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 reset 0 --> resets error counter to 0 for bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 flush --> flushes the current logs" -ForegroundColor Green -BackgroundColor Black
    
    Write-Host "Further Resources:" -ForegroundColor Red -BackgroundColor Black
    Write-Host "GitHub Wiki: https://github.com/Favna/Discord-Self-Bot/wiki" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Join the support server: https://favna.xyz/redirect/server" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Starting the bot without pm2: yarn start" -ForegroundColor Green -BackgroundColor Black
}
function Install-Programs {
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    If([Environment]::Is64BitProcess) {
        $64bit=$true
    }
    
    Write-Host "Would you like to install Notepad++ (Default is No)?" -ForegroundColor Green 
        $Readhost = Read-Host "[Y/N] " 
        Switch ($ReadHost) 
         { 
           Y {Write-Host "Queueing Notepad++ installation"-ForegroundColor Yellow -BackgroundColor Black; $NppOpt=$true} 
           N {Write-Host "Skipping Notepad++ installation"-ForegroundColor DarkRed -BackgroundColor Black; $NppOpt=$false} 
           Default {Write-Host "Skipping Notepad++ installation"-ForegroundColor DarkRed -BackgroundColor Black; $NppOpt=$false} 
         }
    
    Write-Host "Would you like to install Visual Studio Code (Default is No)?" -ForegroundColor Green 
         $Readhost = Read-Host "[Y/N] " 
         Switch ($ReadHost) 
          { 
            Y {Write-Host "Queueing Visual Studio Code installation"-ForegroundColor Yellow -BackgroundColor Black; $CodeOpt=$true}
            N {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $CodeOpt=$false} 
            Default {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $CodeOpt=$false} 
          }
    
    New-Item -ItemType directory -Path Downloads\
    
    Write-Host "Downloading and installing dependancies" -ForegroundColor Cyan -BackgroundColor Black
          
    If($64bit) {
        Write-Host "Downloading NodeJS" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://nodejs.org/dist/v8.11.2/node-v8.11.2-x64.msi" -OutFile "Downloads/nodejs.msi"
        Write-Host "Downloading Git" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://github.com/git-for-windows/git/releases/download/v2.17.0.windows.1/Git-2.17.0-64-bit.exe" -OutFile "Downloads/git.exe"
        Write-Host "Downloading Python" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://www.python.org/ftp/python/3.6.5/python-3.6.5-amd64.exe" -OutFile "Downloads/python.exe"
        Write-Host "Download GTK" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip" -OutFile "Downloads/GTK.zip"
        Write-Host "Downloading libjpeg-turbo" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://sourceforge.net/projects/libjpeg-turbo/files/1.5.3/libjpeg-turbo-1.5.3-vc64.exe/download" -OutFile "Downloads/turbo.exe"
    
        Write-Host "About to install NodeJS. Make sure you select the option ""Add to PATH"" while installing!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process msiexec.exe -Wait -ArgumentList "/I Downloads/nodejs.msi"
        Write-Host "NodeJS Installed"  -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Git. Make sure you select ""Run Git from Windows Command Prompt"" and ""Use Windows' default console view"" when these options are asked by the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/git.exe" -Wait
        Write-Host "Git Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Python. Make sure to select the option ""Add Python 3.6 to PATH"" at the very beginning of the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/python.exe" -Wait
        Write-Host "Python Installed"  -ForegroundColor Cyan -BackgroundColor Black

        Write-Host "Unzipping GTK to C:\GTK" -ForegroundColor Cyan -BackgroundColor Black
        Unzip ".\Downloads\GTK.zip" "C:\GTK"
        Write-Host "GTK Unzipped successfully"  -ForegroundColor Cyan -BackgroundColor Black

        Write-Host "About to start installing libjpeg-turbo" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/turbo.exe" -Wait
        Write-Host "libjpeg-turbo installed"  -ForegroundColor Cyan -BackgroundColor Black

    
        if($CodeOpt) {
            Write-Host "Downloading Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://go.microsoft.com/fwlink/?Linkid=852157" -OutFile "Downloads/vscode.exe"
            Write-Host "About to start installing Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/vscode.exe" -Wait
        }
    
    } else {
        Write-Host "Downloading NodeJS" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://nodejs.org/dist/v8.11.2/node-v8.11.2-x86.msi" -OutFile "Downloads/nodejs.msi"
        Write-Host "Downloading Git" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://github.com/git-for-windows/git/releases/download/v2.17.0.windows.1/Git-2.17.0-32-bit.exe" -OutFile "Downloads/git.exe"
        Write-Host "Downloading Python" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://www.python.org/ftp/python/3.6.5/python-3.6.5.exe" -OutFile "Downloads/python.exe"
        Write-Host "Download GTK" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "http://ftp.gnome.org/pub/GNOME/binaries/win32/gtk+/2.24/gtk+-bundle_2.24.10-20120208_win32.zip" -OutFile "Downloads/GTK.zip"
        Write-Host "Downloading libjpeg-turbo" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://sourceforge.net/projects/libjpeg-turbo/files/1.5.3/libjpeg-turbo-1.5.3-vc.exe/download" -OutFile "Downloads/turbo.exe"
    
        Write-Host "About to install NodeJS. Make sure you select the option ""Add to PATH"" while installing!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process msiexec.exe -Wait -ArgumentList "/I Downloads/nodejs.msi"
        Write-Host "NodeJS Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Git. Make sure you select ""Run Git from Windows Command Prompt"" and ""Use Windows' default console view"" when these options are asked by the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/git.exe" -Wait
        Write-Host "Git Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Python. Make sure to select the option ""Add Python 3.6 to PATH"" at the very beginning of the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/python.exe" -Wait
        Write-Host "Python Installed"  -ForegroundColor Cyan -BackgroundColor Black

        Write-Host "Unzipping GTK to C:\GTK" -ForegroundColor Cyan -BackgroundColor Black
        Unzip ".\Downloads\GTK.zip" "C:\GTK"
        Write-Host "GTK Unzipped successfully"  -ForegroundColor Cyan -BackgroundColor Black

        Write-Host "About to start installing libjpeg-turbo" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/turbo.exe" -Wait
        Write-Host "libjpeg-turbo installed"  -ForegroundColor Cyan -BackgroundColor Black
    
        if($CodeOpt) {
            Write-Host "Downloading Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://go.microsoft.com/fwlink/?LinkID=623230" -OutFile "Downloads/vscode.exe"
            Write-Host "About to start installing Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/vscode.exe" -Wait
        }
    }

    if($NppOpt) {
        Write-Host "Downloading Notepad++" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://notepad-plus-plus.org/repository/7.x/7.5.6/npp.7.5.6.Installer.exe" -OutFile "Downloads/notepadplusplus.exe"
        Write-Host "About to start installing Notepad++" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/notepadplusplus.exe" -Wait
    }

    Install-Dependancies
}

If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "You need to run this script as administrator!`nPlease re-run this script as an Administrator!"
    pause
    break
}

Write-Host "After the installers it could be that you have to relaunch the powershell (or even reboot!)
in order to reload the windows PATH environment variable.
Whether you actually have to depends on your windows installation as for some it is required but for others it is not.
You'll notice whether you need to actually relaunc/reboot when the script fails to find yarn and/or pm2.
Is this the second time running the script (default is no)?" -ForegroundColor Green

    $Readhost = Read-Host "[Y/N] " 
    Switch ($ReadHost) 
     { 
       Y {Write-Host "Skipping to after installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$true} 
       N {Write-Host "Going to the installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$false} 
       Default {Write-Host "Going to the installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$false} 
     }

if($instOpt) {
    Install-Dependancies
} else {
    Install-Programs
}