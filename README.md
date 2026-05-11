# TMF1214 — 8-Bit Web CPU Simulator

A simple browser-based ISA simulator built for the TMF1214 course at UNIMAS. It lets you write and run pseudo-assembly programs directly in the browser.

---

## Files

| File | Description |
|---|---|
| `index.html` | Main UI layout |
| `style.css` | Gruvbox dark theme styling |
| `simulator.js` | CPU logic, fetch, decode, execute |

---

## Supported Instructions

| Instruction | Syntax | Description |
|---|---|---|
| `LOAD` | `LOAD Rx value` | Load a number into a register |
| `ADD` | `ADD Rx Ry Rz` | Rx = Ry + Rz |
| `SUB` | `SUB Rx Ry Rz` | Rx = Ry - Rz |
| `MUL` | `MUL Rx Ry Rz` | Rx = Ry * Rz |
| `DIV` | `DIV Rx Ry Rz` | Rx = Ry / Rz |
| `JUMP` | `JUMP line` | Jump to a line number |
| `BEQ` | `BEQ Rx Ry line` | Jump to line if Rx == Ry |
| `HALT` | `HALT` | Stop the program |

**Registers available:** R0 to R10

---

## Important: Line Numbering

Every line counts toward jump targets, including blank lines and comment lines starting with `;`. Always use your text editor's line numbers when writing `JUMP` and `BEQ` targets.

---

## Sample Program

Calculates `(15.5 / 2) + 10`, then multiplies the result by 3 using a loop. Final answer in R0 should be **53.25**.

```
; Phase 1 & 2: Calculate (15.5/2) + 10
LOAD R1 15.5
LOAD R2 2
DIV R3 R1 R2     ; R3 = 7.75
LOAD R4 10
ADD R5 R3 R4     ; R5 = 17.75 (This is our Base)

; Phase 3: Multiply R5 by 3 using a loop
LOAD R0 0        ; R0 will be our Final Result (Accumulator)
LOAD R6 3        ; R6 is our Loop Counter
LOAD R7 1        ; Constant for decrementing

; --- Loop Start (Line 14) ---
ADD R0 R0 R5     ; Add 17.75 to the total
SUB R6 R6 R7     ; Decrement the counter
BEQ R6 R10 19   ; If counter is 0 (R10 is empty), jump to HALT
JUMP 14          ; Else, go back to Line 14

HALT             ; Final R0 should be 53.25
```

---

## How to Run

1. Open `index.html` in any browser
2. Type or paste your assembly code into the editor
3. Click **Execute Program**
4. View register states and output in the console panel
