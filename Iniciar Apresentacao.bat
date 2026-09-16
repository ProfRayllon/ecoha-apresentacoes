@echo off
title Apresentacoes ECOHA
cd /d "%~dp0"
rem Atualiza as apresentacoes com as ultimas edicoes dos .dc.html
where node >nul 2>nul && node gerar-apresentacoes.js
start "" "index.html"
