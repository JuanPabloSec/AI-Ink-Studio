# PropGate — pakiet do generacji wideo (PL)

Ten folder zawiera **3 gotowe spoty ~20s** do bezpośredniego użycia w generatorach wideo AI.

## Co tu jest
- `spot-01-start.json` — energiczny spot "Start z kontem fundowanym"
- `spot-02-proces.json` — spot tłumaczący proces 1-2-3
- `spot-03-social.json` — dynamiczny short social
- `spot-01.srt`, `spot-02.srt`, `spot-03.srt` — napisy PL zsynchronizowane na ~20s

## Jak generować (workflow)
1. Wybierz spot JSON.
2. Skopiuj pole `master_prompt` do generatora (Runway/Kling/Pika/Haiper itp.).
3. Ustaw parametry renderu z sekcji `render` (9:16, 1080x1920, 20s, 25/30fps).
4. Wklej `voiceover_pl` do narzędzia TTS/lip-sync (głos męski neutralny PL).
5. Dodaj odpowiadający plik `.srt`.
6. Zakończ planszą logo + CTA: `propgate.ai`.

## Uwaga compliance
Treści promują produkt, ale **bez obietnic gwarantowanych zysków**.
