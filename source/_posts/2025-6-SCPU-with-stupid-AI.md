---
title: AI唐氏行为合集（SCPU版）
date: 2025-06-03T19:31:41+08:00
tags:
---

在本次Project中，你将欣赏到包括但不限于：

# 没有人知道它为什么在这里

```plain
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/RegFile.sv:18:11: syntax error, unexpected '[', expecting IDENTIFIER or randomize
   18 |   register[0] = 0;
      |           ^
```

# AI对enum的内容进行了原创性指导

```plain
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/MaskGen.sv:14:13: Can't find definition of variable: 'MEM_SB'
                                                                            : ... Suggested alternative: 'MEM_B'
   14 |             MEM_SB: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/MaskGen.sv:27:13: Can't find definition of variable: 'MEM_SH'
                                                                            : ... Suggested alternative: 'MEM_H'
   27 |             MEM_SH: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/MaskGen.sv:36:13: Can't find definition of variable: 'MEM_SW'
                                                                            : ... Suggested alternative: 'MEM_SB'
   36 |             MEM_SW: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/MaskGen.sv:43:13: Can't find definition of variable: 'MEM_SD'
                                                                            : ... Suggested alternative: 'MEM_D'
   43 |             MEM_SD: dmem_wmask = 8'b11111111;
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:15:13: Can't find definition of variable: 'MEM_LB'
                                                                              : ... Suggested alternative: 'MEM_B'
   15 |             MEM_LB: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:30:13: Can't find definition of variable: 'MEM_LBU'
                                                                              : ... Suggested alternative: 'MEM_LB'
   30 |             MEM_LBU: begin
      |             ^~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:45:13: Can't find definition of variable: 'MEM_LH'
                                                                              : ... Suggested alternative: 'MEM_H'
   45 |             MEM_LH: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:56:13: Can't find definition of variable: 'MEM_LHU'
                                                                              : ... Suggested alternative: 'MEM_LBU'
   56 |             MEM_LHU: begin
      |             ^~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:67:13: Can't find definition of variable: 'MEM_LW'
                                                                              : ... Suggested alternative: 'MEM_LB'
   67 |             MEM_LW: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:76:13: Can't find definition of variable: 'MEM_LWU'
                                                                              : ... Suggested alternative: 'MEM_LBU'
   76 |             MEM_LWU: begin
      |             ^~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataTrunc.sv:85:13: Can't find definition of variable: 'MEM_LD'
                                                                              : ... Suggested alternative: 'MEM_D'
   85 |             MEM_LD: read_data = dmem_rdata;
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataPkg.sv:15:13: Can't find definition of variable: 'MEM_SB'
                                                                            : ... Suggested alternative: 'MEM_B'
   15 |             MEM_SB: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataPkg.sv:28:13: Can't find definition of variable: 'MEM_SH'
                                                                            : ... Suggested alternative: 'MEM_H'
   28 |             MEM_SH: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataPkg.sv:37:13: Can't find definition of variable: 'MEM_SW'
                                                                            : ... Suggested alternative: 'MEM_SB'
   37 |             MEM_SW: begin
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/DataPkg.sv:44:13: Can't find definition of variable: 'MEM_SD'
                                                                            : ... Suggested alternative: 'MEM_D'
   44 |             MEM_SD: dmem_wdata = reg_data;
      |             ^~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:49:13: Can't find definition of variable: 'OPCODE_LUI'
   49 |             OPCODE_LUI, OPCODE_AUIPC: imm = {inst[31:12], 12'b0};
      |             ^~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:49:25: Can't find definition of variable: 'OPCODE_AUIPC'
                                                                         : ... Suggested alternative: 'OPCODE_LUI'
   49 |             OPCODE_LUI, OPCODE_AUIPC: imm = {inst[31:12], 12'b0};
      |                         ^~~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:50:13: Can't find definition of variable: 'OPCODE_JAL'
                                                                         : ... Suggested alternative: 'OPCODE_LUI'
   50 |             OPCODE_JAL: imm = {{12{inst[31]}}, inst[19:12], inst[20], inst[30:21], 1'b0};
      |             ^~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:51:13: Can't find definition of variable: 'OPCODE_JALR'
                                                                         : ... Suggested alternative: 'OPCODE_JAL'
   51 |             OPCODE_JALR: imm = {{20{inst[31]}}, inst[31:20]};
      |             ^~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:52:13: Can't find definition of variable: 'OPCODE_BRANCH'
                                                                         : ... Suggested alternative: 'OPCODE_JAL'
   52 |             OPCODE_BRANCH: imm = {{20{inst[31]}}, inst[7], inst[30:25], inst[11:8], 1'b0};
      |             ^~~~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:53:13: Can't find definition of variable: 'OPCODE_LOAD'
                                                                         : ... Suggested alternative: 'OPCODE_JAL'
   53 |             OPCODE_LOAD: imm = {{20{inst[31]}}, inst[31:20]};
      |             ^~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:54:13: Can't find definition of variable: 'OPCODE_STORE'
                                                                         : ... Suggested alternative: 'OPCODE_JALR'
   54 |             OPCODE_STORE: imm = {{20{inst[31]}}, inst[31:25], inst[11:7]};
      |             ^~~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:55:13: Can't find definition of variable: 'OPCODE_OP_IMM'
                                                                         : ... Suggested alternative: 'OPCODE_LUI'
   55 |             OPCODE_OP_IMM: imm = {{20{inst[31]}}, inst[31:20]};
      |             ^~~~~~~~~~~~~
%Error: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:119:13: Can't find definition of variable: 'OPCODE_OP'
                                                                          : ... Suggested alternative: 'OPCODE_JAL'
  119 |             OPCODE_OP: begin
      |             ^~~~~~~~~
```

# AI把我的pin定义吃掉了

```plain
%Error-PINNOTFOUND: /mnt/e/Projects/sys1-sp25-master/src/project/../../sys-project-main/general/SCPU.sv:29:10: Pin not found: 'cosim_valid'
   29 |         .cosim_valid(cosim_valid),
      |          ^~~~~~~~~~~
                    ... For error description see https://verilator.org/warn/PINNOTFOUND?v=5.033
```

# 32位和64位左右脑互博

```plain
%Warning-WIDTHTRUNC: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:56:10: Input port connection 'inst' expects 32 bits on the pin connection, but pin connection's VARREF 'inst' generates 64 bits.
                                                                                      : ... note: In instance 'Testbench.dut.core'
   56 |         .inst(inst),
      |          ^~~~
                     ... For warning description see https://verilator.org/warn/WIDTHTRUNC?v=5.033
                     ... Use "/* verilator lint_off WIDTHTRUNC */" and lint_on around source to disable this message.
%Warning-WIDTHEXPAND: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:73:26: Operator ASSIGN expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 32 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
   73 |             I_IMM:   imm = {{20{inst[31]}}, inst[31:20]};
      |                          ^
%Warning-WIDTHEXPAND: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:74:26: Operator ASSIGN expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 32 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
   74 |             S_IMM:   imm = {{20{inst[31]}}, inst[31:25], inst[11:7]};
      |                          ^
%Warning-WIDTHEXPAND: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:75:26: Operator ASSIGN expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 32 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
   75 |             B_IMM:   imm = {{20{inst[31]}}, inst[7], inst[30:25], inst[11:8], 1'b0};
      |                          ^
%Warning-WIDTHEXPAND: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:76:26: Operator ASSIGN expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 32 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
   76 |             U_IMM:   imm = {inst[31:12], 12'b0};
      |                          ^
%Warning-WIDTHEXPAND: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:77:26: Operator ASSIGN expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 32 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
   77 |             UJ_IMM:  imm = {{12{inst[31]}}, inst[19:12], inst[20], inst[30:21], 1'b0};
      |                          ^
%Warning-WIDTHTRUNC: /mnt/e/Projects/sys1-sp25-master/src/project/submit/Core.sv:213:38: Operator ASSIGNW expects 64 bits on the Assign RHS, but Assign RHS's REPLICATE generates 96 bits.
                                                                                       : ... note: In instance 'Testbench.dut.core'
  213 |     assign cosim_core_info.inst      = {32'b0,inst};
      |                                      ^
```

# 你说算哪个就算哪个吧

```verilog
        // 从指令存储器读取指令
        inst = pc[1] ? imem_ift.r_reply_bits.rdata[63:32] : imem_ift.r_reply_bits.rdata[31:0];
    end

```

AI:

> **修正方法**：
>
> 直接取 64 位存储器数据的低 32 位作为指令：
>
> ```verilog
> inst = imem_ift.r_reply_bits.rdata[31:0]; // 移除pc[1]的判断
> ```

实际：

```verilog
        inst = pc[2 ] ? imem_ift.r_reply_bits.rdata[63:32] : imem_ift.r_reply_bits.rdata[31:0];
```

# 瞎jb乱跳

AI的代码——没有人知道他想怎么跳

```verilog
    assign branch_target = pc + {{32{imm[31]}}, imm};  // PC + 偏移量
    assign jump_target = (inst[6:0] == JALR_OPCODE) ? (read_data_1 +{{32{imm[31]}}, imm}) & ~64'd1 : branch_target;
    assign br_taken = (inst[6:0] == BRANCH_OPCODE) ? cmp_res : 
                     ((inst[6:0] == JAL_OPCODE) || (inst[6:0] == JALR_OPCODE));
    assign next_pc = npc_sel ? jump_target : pc_plus4;
  
```

但我们有

```plain
register data full: '{'h1f0, 'hab, 'h1, 'h0, 'h0, 'h0, 'hab, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'hab, 'h24, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0, 'h0}
 PC: 000000000000002c, Next PC: 00000000000001d4
 Instruction: 1a771463
 Read Data 1: 00000000000000ab, Read Data 2: 00000000000000ab
 ALU Result: 000000000000002c, Branch Target: 00000000000001d4, Jump Target: 00000000000001d4
 Branch Taken: 0, Next PC: 00000000000001d4
 Imm: 000001a8, ALU A: 000000000000002c, ALU B: 0000000000000000
core   0: 0x000000000000002c (0x1a771463) bne     a4, t2, pc + 424
core   0: 3 0x000000000000002c (0x1a771463)
[error] PC SIM 0000000000000030, DUT 00000000000001d4
```

欸 我们Read Data 1 == Read Data 2但我们偏要跳 就是玩

# 莫名其妙的变量

```plain
%Error: /home/sys/sys1-sp25/src/project/submit/Controller.sv:42:60: Can't find definition of variable: 'cmp_res'
   42 |     assign npc_sel = inst_jal | inst_jalr | (inst_branch & cmp_res);
      |                                                            ^~~~~~~
%Error: Exiting due to 1 error(s)
make: *** [Makefile:56: Testbench] Error 1
```

```verilog
assign npc_sel = inst_jal | inst_jalr | (inst_branch & cmp_res);
```
