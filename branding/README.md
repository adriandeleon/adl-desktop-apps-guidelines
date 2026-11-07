# Pauta branding

**Pauta** is Spanish for a guideline, and for the ruled lines on writing paper. The mark is three periwinkle rules
(the guide) and a teal tick (an app checked against it), drawn the way the family's icons are drawn: the Ink navy
tile, the same corner radius and teal gradient, two shapes only so it reads at 32 px.

| File | What it is |
|---|---|
| `pauta-icon.svg` | The source mark, 512 × 512. Copied to `public/favicon.svg` and `src/assets/pauta-icon.svg`. |
| `pauta.png`, `pauta-{256,128,64,32,16}.png` | Rendered sizes. |
| `social-card.html` → `social-preview.png` | The 1280 × 640 card for shared links (`public/og.png`) and the GitHub repository's social preview. |

Colors and type are the family's own (Editora's Caret & Ink: Ink `#1B1E2A`, periwinkle `#9AA2D4`, teal
`#5EEAD4`→`#22B8A6`; Inter and JetBrains Mono). Pauta adds none.

Re-render after changing the mark:

```bash
node -e 'const s=require("sharp");for(const n of [512,256,128,64,32,16])s("branding/pauta-icon.svg",{density:Math.max(72,n/512*288)}).resize(n,n).png().toFile(n===512?"branding/pauta.png":`branding/pauta-${n}.png`)'
google-chrome --headless=new --hide-scrollbars --window-size=1280,640 --screenshot="$PWD/branding/social-preview.png" "file://$PWD/branding/social-card.html"
cp branding/pauta-icon.svg public/favicon.svg; cp branding/pauta-icon.svg src/assets/pauta-icon.svg; cp branding/social-preview.png public/og.png
```
