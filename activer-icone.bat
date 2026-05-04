@echo off
:: Active l'icone personnalisee du dossier Kaleysur
attrib +s "%~dp0"
attrib +s +h "%~dp0desktop.ini"
:: Rafraichit l'Explorateur Windows
ie4uinit.exe -show
echo Icone activee ! Ferme et reouvre le dossier pour voir le changement.
pause
