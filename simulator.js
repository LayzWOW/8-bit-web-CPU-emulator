let cpu = {
    registers: new Array(11).fill(0),
    pc: 0
};

// BUG FIX 1: Removed stray top-level `let status = execute(instruction, parts.slice(1));`
// that referenced undefined variables and crashed the script on load.

function runProgram() {
    const codeArea = document.getElementById('code');
    const code = codeArea.value.split('\n'); // Line 1 = Index 0

    cpu.pc = 0;
    cpu.registers.fill(0);
    document.getElementById('console').innerHTML = "";
    let iterations = 0;

    while (cpu.pc < code.length && iterations < 5000) {
        let rawLine = code[cpu.pc].trim();

        // Skip execution for empty/comment lines but KEEP the PC alignment
        if (rawLine === "" || rawLine.startsWith(';')) {
            cpu.pc++;
            continue;
        }

        // Clean up inline comments and split instructions
        let parts = rawLine.split(';')[0].trim().split(/\s+/);
        if (parts.length === 0 || parts[0] === "") {
            cpu.pc++;
            continue;
        }

        try {
            // Execute the command
            // BUG FIX 4: execute() no longer silently swallows errors — it throws,
            // and this catch block is the single point of error display.
            let status = execute(parts[0].toUpperCase(), parts.slice(1));
            iterations++;

            if (status === "HALT") break;

            // Only move PC forward if we didn't just JUMP
            if (status !== "JUMPED") {
                cpu.pc++;
            }
        } catch (e) {
            document.getElementById('console').innerHTML += `<span style="color:#fb4934;">ERROR Line ${cpu.pc + 1}: ${e.message}</span><br>`;
            break;
        }
    }
    updateUI();
}

function execute(instr, args) {
    const getReg = (r) => {
        let idx = parseInt(r.toUpperCase().replace('R', ''));
        if (isNaN(idx) || idx < 0 || idx >= cpu.registers.length) throw new Error(`Invalid Register: ${r}`);
        return idx;
    };

    // BUG FIX 4: Removed internal try/catch — errors now propagate up to runProgram()
    // so they are caught and displayed once, with the correct line number.
    switch(instr) {
        case "LOAD":
            // BUG FIX 2: Removed dead `let val = parseInt(args[1])` — it was never used.
            cpu.registers[getReg(args[0])] = parseFloat(args[1]);
            break;
        case "ADD":
            cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] + cpu.registers[getReg(args[2])];
            break;
        case "SUB":
            cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] - cpu.registers[getReg(args[2])];
            break;
        case "MUL":
            cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] * cpu.registers[getReg(args[2])];
            break;
        case "DIV":
            if (cpu.registers[getReg(args[2])] === 0) throw new Error("Division by Zero");
            cpu.registers[getReg(args[0])] = cpu.registers[getReg(args[1])] / cpu.registers[getReg(args[2])];
            break;
        case "JUMP":
            cpu.pc = parseInt(args[0]) - 1;
            return "JUMPED";
        case "BEQ":
            if (cpu.registers[getReg(args[0])] === cpu.registers[getReg(args[1])]) {
                cpu.pc = parseInt(args[2]) - 1;
                return "JUMPED";
            }
            // BUG FIX 3: Was returning `false` — now falls through cleanly (returns undefined),
            // which is consistent with the "did not jump" path of other instructions.
            break;
        case "HALT":
            return "HALT";
        default:
            throw new Error(`Unknown Instruction: ${instr}`);
    }
}

function updateUI() {
    document.getElementById('registers').innerText = `Registers: [${cpu.registers.join(', ')}]`;
    document.getElementById('pc').innerText = `PC: ${cpu.pc}`;
    document.getElementById('console').innerHTML += `<div style="color:#b8bb26;">> Program Finished. Final R0: ${cpu.registers[0]}</div>`;
}

function clearAll() {
    cpu.registers.fill(0);
    cpu.pc = 0;
    document.getElementById('console').innerHTML = "Console Cleared.";
    updateUI();
}
