#!/bin/bash
grunt clean
grunt dist-mac --force
open dist/PdfSpeaker.app
