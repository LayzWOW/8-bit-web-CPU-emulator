// 1. Hardware State
let cpu = {
      registers: [0, 0, 0, 0], // R0, R1, R2, R3
      pc: 0                    // Program Counter
};

function runProgram() {
      const code = document.getElementById('code').value.split('\n');
      cpu.pc = 0;
      cpu.registers = [0, 0, 0, 0]; // Reset hardware

      while (cpu.pc < code.length) {
            let rawLine = code[cpu.pc].trim();
            if (rawLine === "") { cpu.pc++; continue; }

            // FETCH & DECODE
            let parts = rawLine.split(' ');
            let instruction = parts[0]; // e.g., "ADD"

            // EXECUTE
            execute(instruction, parts.slice(1));

            cpu.pc++; // Increment Program Counter
      }
      updateUI();
}

function execute(instr, args) {
      switch(instr) {

            // register handling modified to parseFloat() to store decimal numbers
            // though this is a simple fix/addition, I am not too sure whether this 
            // correct or not
            // by: Daryl H. Bennet
            case "LOAD": {
                  let regIdx = parseInt(args[0].replace('R', ''));
                  cpu.registers[regIdx] = parseFloat(args[1]);
                  break;
            }

            case "ADD": {
                  let dest = parseInt(args[0].replace('R', ''));
                  let s1 = parseInt(args[1].replace('R', ''));
                  let s2 = parseInt(args[2].replace('R', ''));
                  cpu.registers[dest] = cpu.registers[s1] + cpu.registers[s2];
                  break;
            }

            // The question didn't asked for it, but I added it for fun
            // by: Daryl H. Bennet
            case "SUB": {
                  let dest = parseInt(args[0].replace('R', ''));
                  let s1 = parseInt(args[1].replace('R', ''));
                  let s2 = parseInt(args[2].replace('R', ''));
                  cpu.registers[dest] = cpu.registers[s1] - cpu.registers[s2];
                  break;
            }

            // These 2 are copy pasted, changed the case and logic
            // by: Daryl H. Bennet
            case "MUL": {
                  let dest = parseInt(args[0].replace('R', ''));
                  let s1 = parseInt(args[1].replace('R', ''));
                  let s2 = parseInt(args[2].replace('R', ''));
                  cpu.registers[dest] = cpu.registers[s1] * cpu.registers[s2];
                  break;
            }

            case "DIV": {
                  let dest = parseInt(args[0].replace('R', ''));
                  let s1 = parseInt(args[1].replace('R', ''));
                  let s2 = parseInt(args[2].replace('R', ''));
                  cpu.registers[dest] = cpu.registers[s1] / cpu.registers[s2];
                  break;
            }

            default:
                  console.log("Unknown Instruction: " + instr);
      }
}

function updateUI() {
      document.getElementById('registers').innerText = `Registers: [${cpu.registers.join(', ')}]`;
      document.getElementById('pc').innerText = `PC: ${cpu.pc}`;
      document.getElementById('console').innerHTML += `Program Finished. Result: ${cpu.registers.join(' | ')} <br>`;
}
