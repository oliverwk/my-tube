#!/usr/bin/env bash
nu=$(date +"%m-%d-%Y;%H:%M")
git add .
git commit -m "One of the final commit's at ${nu}"
git branch -M main
git push -u MyTube main
