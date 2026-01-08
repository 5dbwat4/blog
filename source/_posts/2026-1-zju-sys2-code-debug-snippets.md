---
title: 计算机系统II 调试用代码片段
date: 2026-01-05T01:43:09+08:00
tags: Schoolwork
---

众所周知，流水线CPU设计时GTKWave不能说不好用吧只能说是非常难用，所以我使用的是`$display`大法，直接输出所需信息。（用这种方法的似乎大有人在）

这里分享一些相关的代码片段和调试技巧。

<!-- more -->

# RegFile

\* `RegFile.sv`

```verilog
  data_t register [1:31]; // assume your register file is named "register"

  always @(posedge clk or posedge rst) begin
    // $display("register data full: %h", register[31]);
    `ifdef VERILATE
    // display register checkboard
    $display("RegFile:");
    $display("   x0: 0000000000000000 ra: %h sp: %h gp: %h tp: %h", register[1], register[2], register[3], register[4]);
    $display("   t0: %h t1: %h t2: %h s0: %h s1: %h", register[5], register[6], register[7], register[8], register[9]);
    $display("   a0: %h a1: %h a2: %h a3: %h a4: %h", register[10], register[11], register[12], register[13], register[14]);
    $display("   a5: %h a6: %h a7: %h s2: %h s3: %h", register[15], register[16], register[17], register[18], register[19]);
    $display("   s4: %h s5: %h s6: %h s7: %h s8: %h", register[20], register[21], register[22], register[23], register[24]);
    $display("   s9: %h s10:%h s11:%h t3: %h t4: %h", register[25], register[26], register[27], register[28], register[29]);
    $display("   t5: %h t6: %h", register[30], register[31]);
    `endif

  // all other code
  end
```

# Memory操作

\* `Core.sv`

```verilog
`ifdef VERILATE
always @(posedge clk) begin
    // $display("State: %s, IF_stall=%b, MEM_stall=%b", current_state.name(), if_stall, mem_stall);
    $display("IMEM request: addr=%h, valid=%b, ready=%b", imem_ift.r_request_bits.raddr, imem_ift.r_request_valid, imem_ift.r_request_ready);
    $display("IMEM reply:   rdata=%h, valid=%b, ready=%b", imem_ift.r_reply_bits.rdata, imem_ift.r_reply_valid, imem_ift.r_reply_ready);
    $display("DMEM R request: addr=%h, valid=%b, ready=%b", dmem_ift.r_request_bits.raddr, dmem_ift.r_request_valid, dmem_ift.r_request_ready);
    $display("DMEM R reply:   rdata=%h, valid=%b, ready=%b", dmem_ift.r_reply_bits.rdata, dmem_ift.r_reply_valid, dmem_ift.r_reply_ready);
    $display("DMEM W request: addr=%h, data=%h, mask=%b, valid=%b, ready=%b", 
             dmem_ift.w_request_bits.waddr, dmem_ift.w_request_bits.wdata, dmem_ift.w_request_bits.wmask,
             dmem_ift.w_request_valid, dmem_ift.w_request_ready);
    $display("DMEM W reply:   valid=%b, ready=%b", dmem_ift.w_reply_valid, dmem_ift.w_reply_ready);
end
`endif
```

用于输出内存请求和响应的状态，方便调试内存访问问题。


# UART 重定向

> 此外，我们的 `Uart` 在被写入数据的时候会调用 `$display` 函数输出写入的值，起到调试的时候观看串口输出的效果。如果大家想要收集调试的输出，可以运行 `make kernel 2>log`，然后所有的执行流会被保存到当前路径下的 log 文件中，而标准输出只会输出 `Uart` 被写入的值（即 `printk` 函数的输出），可以比较好地展示最后的效果。在验收时请以这种方式运行，以展示运行结果的正确性。

（p.s. 实际上是`$write`）

问题来了，我们的调试阶段也是需要用到 `$display` 输出的。为了不让这两种输出混起来，可以把Uart中的输出重定向到文件：

**要修改的文件位于`sys2-project`/`general/uart.sv`**

在约380行的位置处：

```diff
module uart_transmitter#(
    parameter ClkFrequency = 100000000,
    parameter Baud = 9600
)(
	input wire clk,
    input wire rstn,
	Decoupled_ift.Slave uart_data,
	output wire txd,
    input wire cts
);

    import UartPack::*;

    uart_t txd_data;
    wire txd_start;
    assign txd_data = uart_data.data;
    assign txd_start = uart_data.valid;

    wire txd_busy;
    async_transmitter#(
        .ClkFrequency(ClkFrequency),
        .Baud(Baud)
    ) transmitter (
        .clk(clk),
        .TxD_start(txd_start),
        .TxD_data(txd_data),
        .TxD(txd),
        .TxD_busy(txd_busy)
    );

    // assign uart_data.ready = ~txd_busy & ~cts;
    assign uart_data.ready = ~txd_busy;

+   int fd; // File descriptor
+
+   initial begin
+       fd = $fopen("output.txt", "w");
+   end

    always@(posedge clk)begin
        if(uart_data.valid & uart_data.ready)begin
+           $fwrite(fd, "%c", uart_data.data);
-           $write("%c", uart_data.data);
        end
    end
    `ifdef UART_DEBUG
        always@(posedge clk)begin
            if(uart_data.valid & uart_data.ready)begin
                $display("soc transmit data %x", uart_data.data);
            end
        end
    `endif

endmodule

```

具体要粘贴的内容：

```verilog
    int fd; // File descriptor

    initial begin
        // Open file in write mode ("w" creates or overwrites)
        fd = $fopen("output.txt", "w");
    end

    always@(posedge clk)begin
        if(uart_data.valid & uart_data.ready)begin
            $fwrite(fd, "%c", uart_data.data);
        end
    end
```

这样，Uart的输出就会被写入到`output.txt`文件中，而不是标准输出流里了。输出的这个文件位于`src/project/build/verilate`目录下。你也可以改成绝对地址。


# 使用`.name()`输出enum的名称

在Verilog/SystemVerilog中，enum类型的变量默认输出的是它们的整数值，而不是名称。为了在调试时更方便地查看enum变量的状态，可以使用SystemVerilog提供的`.name()`方法来输出enum的名称。

例如，对于

```verilog
    typedef enum logic [3:0] {
        ALU_ADD,  ALU_SUB,  ALU_AND,  ALU_OR,
        ALU_XOR,  ALU_SLT,  ALU_SLTU, ALU_SLL,
        ALU_SRL,  ALU_SRA,  ALU_ADDW, ALU_SUBW,
        ALU_SLLW, ALU_SRLW, ALU_SRAW, ALU_DEFAULT
    } alu_op_enum;

    alu_op_enum current_op;
```

在调试输出时，可以这样写：

```verilog
    $display("Current ALU operation: %s", current_op.name());
```

会更清楚一些。