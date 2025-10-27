---
title: 『系统贯通实验』 cosim 差分框架报错详解
date: 2025-10-27T01:37:49+08:00
tags:
---

叠甲环节：以下内容仅仅基于我个人的实验体验。事实上，~~考虑到我上课基本没听过~~，以下内容中很有可能包含（或完全包含）课堂上讲过/助教讲过的内容。

如果是的话，~~就当补课了~~，希望路过的人能提出一下。

---

[众所周知](https://zju-sys.pages.zjusct.io/sys1/sys1-sp25/project-2-appendix/)，在计算机系统中我们会接触到一个[差分测试框架](https://github.com/sycuricon/riscv-isa-cosim)（如果你觉得没接触过，~~那就太可惜了，~~在“进行仿真测试，以检验 CPU 基本功能”那一步，你必然会见识到以`[CJ]`开头的一系列错误）。

如果根本没有看过实验文档（~~像我一样~~），在遇到`[error] check board set 1 error`时第一反应应该是*这tm是啥*，然后尝试Google这个报错信息，然后就会发现：这tm真是个罕见框架，网上一点相关的信息都没有（笑呆了，这个框架连个文档都没有）。

如果你运气好（~~读了文档~~），就会发现[这篇论文](https://www.usenix.org/conference/usenixsecurity23/presentation/xu-jinyan)，读完之后就会感觉到*如读*。具体的说，应该会对`riscv-isa-cosim`的执行流程有更深入的理解，但是从实用主义的角度的说，对于理解报错信息的帮助并不大。

所以有了这篇文章，这篇文章将直接扒`riscv-isa-cosim`的源码，看其中各种报错都意味着什么，方便后人理解与调试。

----

# DUMP_STATE


```cpp
#define DUMP_STATE                                                                        \
    for (int i = 0; i < 8; i++) {                                                         \
      printf("%s = 0x%016lx %s = 0x%016lx %s = 0x%016lx %s = 0x%016lx\n",                 \
        freg_name[4*i+0], dump(s->FPR[4*i+0]), freg_name[4*i+1], dump(s->FPR[4*i+1]),     \
        freg_name[4*i+2], dump(s->FPR[4*i+2]), freg_name[4*i+3], dump(s->FPR[4*i+3]));    \
    }                                                                                     \
    for (int i = 0; i < 8; i++) {                                                         \
      printf("%s = 0x%016lx %s = 0x%016lx %s = 0x%016lx %s = 0x%016lx\n",                 \
        reg_name[4*i+0], dump(s->XPR[4*i+0]), reg_name[4*i+1], dump(s->XPR[4*i+1]),       \
        reg_name[4*i+2], dump(s->XPR[4*i+2]), reg_name[4*i+3], dump(s->XPR[4*i+3]));      \
    };
```
这个宏定义会打印出寄存器的状态。


# `[*] \`Commit & Judge' General Co-simulation Framework`

```cpp

  // done
  fprintf(stderr, "[*] `Commit & Judge' General Co-simulation Framework\n");
  fprintf(stderr, "\t\tpowered by Spike " SPIKE_VERSION "\n");
  fprintf(stderr, "- core %ld, isa: %s %s %s\n",
          cfg.nprocs(), cfg.isa(), cfg.priv(), cfg.varch());

  fprintf(stderr, "- memory configuration:");
  for (auto& m: mems) {
    fprintf(stderr, " 0x%lx@0x%lx", m.first, m.second->size());
  } fprintf(stderr, "\n");

  fprintf(stderr, "- elf file list:");
  for (auto& elf: cfg.elffiles()) {
    fprintf(stderr, " %s", elf.c_str());
  } fprintf(stderr, "\n");

  fprintf(stderr, "- tohost address: 0x%lx\n", tohost_addr);  
  fprintf(stderr, "- fuzz information: [Handler] %ld page (0x%lx 0x%lx)\n",
          fuzz_handler_page_num, fuzz_handler_start_addr, fuzz_handler_end_addr);
  fprintf(stderr, "                    [Payload] %ld page (0x%lx 0x%lx)\n",
          fuzz_loop_page_num, fuzz_loop_entry_addr, fuzz_loop_exit_addr);

  procs[0]->get_state()->pc = cfg.boot_addr();

}
```

字面意思，`riscv-isa-cosim`已经准备好*吃从你的dut喂过来的失*了

# `warning: tohost symbols not in ELF; can't communicate with target`

```cpp

void cosim_cj_t::load_testcase(const char* elffile) {
  // mems[0].second->reset();
  memif_t tmp(this);
  std::map<std::string, uint64_t> symbols = load_elf(elffile, &tmp, &elf_entry);
  if (symbols.count("tohost"))
    tohost_addr = symbols["tohost"];
  else
    fprintf(stderr, "warning: tohost symbols not in ELF; can't communicate with target\n");

  if (symbols.count("_fuzz_handler_start"))
    fuzz_handler_start_addr = symbols["_fuzz_handler_start"];
  else
    fuzz_handler_start_addr = 0;
  if (symbols.count("_fuzz_handler_end"))
    fuzz_handler_end_addr = symbols["_fuzz_handler_end"];
  else
    fuzz_handler_end_addr = 0;
  if (symbols.count("_fuzz_main_loop_entry"))
    fuzz_loop_entry_addr = symbols["_fuzz_main_loop_entry"];
  else
    fuzz_loop_entry_addr = 0;
  if (symbols.count("_fuzz_main_loop_exit"))
    fuzz_loop_exit_addr = symbols["_fuzz_main_loop_exit"];
  else
    fuzz_loop_exit_addr = 0;

  fuzz_loop_page_num = (fuzz_loop_exit_addr - fuzz_loop_entry_addr + 0xFFF) / 0x1000;
  fuzz_handler_page_num = (fuzz_handler_end_addr - fuzz_handler_start_addr + 0xFFF) / 0x1000;

  va_enable = !!symbols.count("vm_boot");
  for (auto i : symbols) {
    auto it = addr2symbol.find(i.second);
    if (it == addr2symbol.end())
      addr2symbol[i.second] = i.first;
    
    if (i.first.find("fuzztext_") != std::string::npos) {
      if (va_enable) {
        text_label.push_back(i.second - fuzz_loop_entry_addr + 0x1000);
      } else {
        text_label.push_back(i.second);
      }
    } else if (i.first.find("fuzzdata_") != std::string::npos) {
      if (va_enable) {
        data_label.push_back(i.second - fuzz_loop_entry_addr + 0x1000);
      } else {
        data_label.push_back(i.second);
      }
    }
  }
}
```

这个警告意味着 ELF 文件中没有找到 `tohost` 符号，导致无法与目标进行通信。`tohost` 通常用于在仿真环境中向主机发送信息。如果你的 ELF 文件确实不包含这个符号，那么你可能需要检查你的编译和链接过程，确保正确地包含了必要的符号。

（说实话，这个报错真没见到过，而且感觉正常操作应该见不到这种错）

# `[CJ] Enable insn randomization`

```cpp
  if (in_fuzz_handler_range(s->pc)) {
    if (!start_randomize && dut_insn == 0x00002013UL) {
      if (cj_debug) printf("[CJ] Enable insn randomization\n");
      start_randomize = true;
    } else if (start_randomize && dut_insn == 0xfff02013UL) {
      if (cj_debug) printf("[CJ] Disable insn randomization\n");
      start_randomize = false;
    } else if (dut_insn == 0x00102013UL) {
      if (cj_debug) printf("\e[1;33m[CJ] Reset mutation queue\e[0m\n");
      masker_inst_t::fence_mutation();
    } 
  }
```

首先你当前的pc需要`in_fuzz_handler_range`

```cpp
  bool in_fuzz_handler_range(uint64_t addr) {
    if (fuzz_handler_start_addr == 0 && fuzz_handler_end_addr == 0) {
      return true;
    }

    if (va_enable) {
      return (fuzz_handler_start_addr <= addr && addr < fuzz_handler_end_addr) || 
             ((fuzz_handler_start_addr | va_mask) <= addr && addr < (fuzz_handler_end_addr | va_mask)) ;
    } else {
      return fuzz_handler_start_addr <= addr && addr < fuzz_handler_end_addr;
    }
  }
```

接下来需要当前未处在`start_randomize`状态下，并且`slti x0, x0, 0`，那么它就会提示你`[CJ] Enable insn randomization`，并且将`start_randomize`置为`true`。

# `[CJ] Disable insn randomization`

同上，但是需要`start_randomize`为`true`，并且指令为`slti x0, x0, -1`。

# `[CJ] Reset mutation queue`

同上，但是不管`start_randomize`状态如何，只要指令为`slti x0, x0, 1`，它就会提示你`[CJ] Reset mutation queue`，并且调用`masker_inst_t::fence_mutation();`来重置变异队列。

（好吧这三个我也没见过，感觉是在对处理器进行fuzz测试时才会遇到）

# `[error] check board set %ld error `

```cpp
  if (s->XPR.get_last_write(regNo)) {
    if (!check_board.set(regNo, s->XPR[regNo], dut_insn, dut_pc, get_mmio_access())) {
      printf("\x1b[31m[error] check board set %ld error \x1b[0m\n", regNo);
      if (blind) {
        tohost_data = 1;
        return 0;
      } else {
        return 10;
      }
    }
  }
```

就是说`check_board.set`返回了`false`时会爆这个错。

```cpp
bool set(size_t i, T value, uint32_t dut_insn, reg_t dut_pc, bool mmio_ignore = false) {
  if (!ignore_zero || i != 0) {
    if (valid[i])
      return false;  // <--- 失败条件1：对应位置已经被设置过
    valid[i] = !valid[i];
    ignore[i] = mmio_ignore;
    data[i] = value;
    insn[i] = dut_insn;
    pc[i] = dut_pc;
  }
  return true;
}
```

在我的个人实践中，通常是cosim接线接错的时候会导致这个问题

p.s. TODO: 这个可以再细化一下

# `[error] float check board set %ld error`


```cpp
  if (s->FPR.get_last_write(fregNo)) {
    if (!f_check_board.set(fregNo, s->FPR[fregNo], dut_insn, dut_pc, get_mmio_access())) {
      printf("\x1b[31m[error] float check board set %ld error \x1b[0m\n", fregNo);
      if (blind) {
        tohost_data = 1;
        return 0;
      } else {
        return 10;
      }
    }
  }
```

同上，但是`f_check_board`


# `[error] PC SIM %016lx, DUT %016lx`

```cpp
  if (dut_pc != sim_pc || dut_insn != sim_insn) {
    printf("\x1b[31m[error] PC SIM \x1b[33m%016lx\x1b[31m, DUT \x1b[36m%016lx\x1b[0m\n", sim_pc, dut_pc);
    printf("\x1b[31m[error] INSN SIM \x1b[33m%08x\x1b[31m, DUT \x1b[36m%08x\x1b[0m\n", sim_insn, dut_insn);
    DUMP_STATE;
    if (blind) {
      tohost_data = 1;
      return 0;
    } else {
      return 255;
    }
  }
```

这个相当好理解，就是你的PC或者指令和Spike模拟器的不一致了。顺便一提，只要有一个不一致，它就会把PC和INSN都打印出来。

当然还会再[DUMP_STATE](#dump_state)一下。

再顺便一提，SIM是模拟器的意思，DUT是被测设备（也就是你的CPU实现）的意思（Device Under Test）。

不过这个应该过于常见了，而且没那么神秘。

# `[error] INSN SIM %08x, DUT %08x`

同上。

# `[error] WDATA SIM %016lx, DUT %016lx `

见下

# `[error] %016lx@%08x float check board check %d error `

```cpp
  if (fc) {
    if (!f_check_board.clear(dut_waddr, freg(f64(dut_wdata)))) {
      if (f_check_board.get_ignore(dut_waddr)) {
        s->FPR.write(dut_waddr, freg(f64(dut_wdata)));
        f_check_board.clear(dut_waddr);
        return 0;
      } else {
        printf("\x1b[31m[error] WDATA \x1b[33mSIM %016lx\x1b[31m, DUT \x1b[36m%016lx \x1b[0m\n", 
          dump(f_check_board.get_data(dut_waddr)), dump(freg(f64(dut_wdata))));
        printf("\x1b[31m[error] %016lx@%08x float check board check %d error \x1b[0m\n", f_check_board.get_pc(dut_waddr), f_check_board.get_insn(dut_waddr), dut_waddr);
        DUMP_STATE;
        if (blind) {
          if (!sync_state)
            tohost_data = 1;
          s->FPR.write(dut_waddr, freg(f64(dut_wdata)));
          f_check_board.clear(dut_waddr);
          return 0;
        } else {
          return 255;
        }
      }

    }
  }
```

这个错误意味着浮点寄存器的写入数据在模拟器（SIM）和被测设备（DUT）之间不匹配。具体来说，当尝试清除浮点检查板（`f_check_board`）中的数据时，发现模拟器中的数据与DUT中的数据不一致，从而触发了这个错误。

```cpp
bool clear(size_t i, T value) {
  if (!ignore_zero || i != 0) {
    if (!valid[i])
      return false; // <--- 失败条件1：对应位置没有被设置过
    if (data[i] != value) {
      return false; // <--- 失败条件2：数据值不匹配
    }
    valid[i] = !valid[i];
  }
  return true;
}
void clear(size_t i) {
  valid[i] = false;
}
```

这里比较神秘的地方是第二行那个`xxx@xxx`，左右各是一个十六进制。 **前者是PC，后者是指令。**

# `[error] %016lx@%08x CSR UNMATCH SIM %016lx, DUT %016lx `

```cpp
else if ((check_board.get_insn(dut_waddr) & 0x7f) == 0x73) {
  if (!sync_state) {
    tohost_data = 1;
    printf("\x1b[31m[error] %016lx@%08x CSR UNMATCH \x1b[33mSIM %016lx\x1b[31m, DUT \x1b[36m%016lx \x1b[0m\n", 
  check_board.get_pc(dut_waddr), check_board.get_insn(dut_waddr), dump(check_board.get_data(dut_waddr)), dump(dut_wdata));
    DUMP_STATE;
  }
    
  s->XPR.write(dut_waddr, dut_wdata);
  check_board.clear(dut_waddr);
  return 0;
}
```

`CSR`不同步。这里的`(check_board.get_insn(dut_waddr) & 0x7f) == 0x73`意思是说，如果当前的*opcode*是`0x73`（也就是`SYSTEM`指令，`1110011`，类似`ecall`,`ebreak`之类的），那么就会进行CSR的检查。

这个指令也好神秘，而且实验文档里是被划掉不需要实现的，如果你的testcase.hex编译炸了（捂脸）或者读错文件了可能会出现（吧）。

# `[error] WDATA SIM %016lx, DUT %016lx `

```cpp
else {
    printf("\x1b[31m[error] WDATA \x1b[33mSIM %016lx\x1b[31m, DUT \x1b[36m%016lx \x1b[0m\n", 
      dump(check_board.get_data(dut_waddr)), dump(dut_wdata));
    printf("\x1b[31m[error] %016lx@%08x check board clear %d error \x1b[0m\n", check_board.get_pc(dut_waddr), check_board.get_insn(dut_waddr), dut_waddr);
    DUMP_STATE;
    if (blind) {
      if (!sync_state)
        tohost_data = 1;
      s->XPR.write(dut_waddr, dut_wdata);
      check_board.clear(dut_waddr);
      return 0;
    } else {
      return 255;
    }
  }
```

参考前文`[error] %016lx@%08x float check board check %d error `那一段。

# `[CJ] trying to communicate with testbench`

见下

# `[CJ] unsupported syscall #%ld!`

```cpp
  // select device
  switch ((tohost_data >> 56) & 0xff) {
    case 0x0: {
      // select cmd
      switch ((tohost_data >> 48) & 0xff) {
        case 0: {
          // check payload
          uint64_t payload = tohost_data << 16 >> 16;
          if (payload & 1) {
            printf("[CJ] trying to communicate with testbench\n");
          }
          else {
            volatile uint64_t magic_mem[8] __attribute__((aligned(64)));
            memif_t tmp(this);
            tmp.read(payload, sizeof(magic_mem), (void*)magic_mem);

            if (magic_mem[0] == 64) {
              uint64_t len = magic_mem[3];
              std::vector<char> buf(len);
              tmp.read(magic_mem[2], len, buf.data());
              ssize_t ret = write(1,buf.data(),len);
            }
            else {
              printf("[CJ] unsupported syscall #%ld!\n", magic_mem[0]);
            }

          }
        }
          break;
        default:
          break;
      }
    }
      break;
    default:
      break;
  }
```

这两个都是与`tohost`通信时的报错。

当`tohost_data`的高8位为0，接下来的8位也为0时，表示正在尝试与测试平台进行通信。如果`payload`的最低位为1，则打印出`[CJ] trying to communicate with testbench`。

否则，它会尝试读取`payload`地址处的内存，并检查第一个元素。如果第一个元素是64，则表示这是一个写操作，它会将数据写入标准输出。否则，它会打印出不支持的系统调用编号，格式为`[CJ] unsupported syscall #%ld!`。

# `ToDo: cosim_cj_t::proc_reset`

```cpp
void cosim_cj_t::proc_reset(unsigned id) {
  // not implement here
  printf("ToDo: cosim_cj_t::proc_reset\n");
}
```

笑

# `[CJ] generated random text label: %s(%016lx)`

以下四个应该全是与fuzz test有关的，而且是debug信息，应该是与我们实验无关的功能。

```cpp
// magic device call back function
uint64_t cosim_cj_t::get_random_text_address(std::default_random_engine &random) {
  if (text_label.size() == 0) {
    return 0x20220718;
  }
  std::uniform_int_distribution<uint64_t> rand_label(0, text_label.size() - 1);
  auto select = text_label[rand_label(random)];
  if (cj_debug) printf("[CJ] generated random text label: %s(%016lx)\n", addr2symbol[select].c_str(), select);

  // processor_t* p = get_core(0);
  // state_t* s = p->get_state();
  // printf("pc 0x%lx  mepc 0x%lx  sepc 0x%lx\n", s->pc, s->mepc->read(), s->sepc->read());

  return select;
}
```

# `[CJ] generated random data page:%016lx`

```cpp
uint64_t cosim_cj_t::get_random_data_address(std::default_random_engine &random) {
  if (data_label.size() == 0) {
    return 0x20220723;
  }
  std::uniform_int_distribution<uint64_t> rand_page(0, data_label.size() - 1);
  auto select = data_label[rand_page(random)];
  if (cj_debug) printf("[CJ] generated random data page:%016lx\n", select);
  return select;
}
```

# `[CJ] %cepc %016lx in fuzz range, stepping %d bytes`

```cpp
uint64_t cosim_cj_t::get_exception_return_address(std::default_random_engine &random, int smode) {
  processor_t* p = get_core(0);
  state_t* s = p->get_state();
  reg_t epc = smode ? s->sepc->read() : s->mepc->read();

  if (in_fuzz_loop_range(epc)) {  // step to the next inst
    reg_t epc_pa = va_enable ? (epc - 0x1000) + fuzz_loop_entry_addr : epc;
    int step = debug_mmu->test_insn_length(epc_pa);
    if (cj_debug) printf("[CJ] %cepc %016lx in fuzz range, stepping %d bytes\n", smode ? 's' : 'm', epc, step);
    return epc + step;
  } else { // load a randomly selected target
    if (cj_debug) printf("[CJ] %cepc %016lx out of fuzz range\n", smode ? 's' : 'm', epc);
    return magic->load(MAGIC_RDM_TEXT_ADDR);
  }
}
```

# `[CJ] %cepc %016lx out of fuzz range`

代码同上。


-------

# 综上所述

其实这一圈看完可以发现，和我们实验相关的报错信息并不多，主要集中在以下几个：
- `[error] check board set %ld error `
- `[error] float check board set %ld error`
- `[error] PC SIM %016lx, DUT %016lx`
- `[error] INSN SIM %08x, DUT %08x`
- `[error] WDATA SIM %016lx, DUT %016lx `
- `[error] %016lx@%08x float check board check %d error `
- `[error] %016lx@%08x CSR UNMATCH SIM %016lx, DUT %016lx `
- `[error] WDATA SIM %016lx, DUT %016lx `
- `[error] %016lx@%08x check board check %d error `
其他的报错信息基本上和fuzz测试相关，或者是debug信息。