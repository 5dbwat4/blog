---
title: seccomp 相关题学习笔记
date: 2025-03-26T21:46:21+08:00
tags:
---
# orw sheet

```c
unsigned int orw_seccomp()
{
  __int16 v1; // [esp+4h] [ebp-84h] BYREF
  char *v2; // [esp+8h] [ebp-80h]
  char v3[96]; // [esp+Ch] [ebp-7Ch] BYREF

  qmemcpy(v3, &unk_8048640, sizeof(v3));
  v1 = 12;
  v2 = v3;
  prctl(38, 1, 0, 0, 0);
  prctl(22, 2, &v1);   //<-- v1 is indeed a struct sock_fprog
}
```

片段中`prctl(38, 1, 0, 0, 0)`==` prctl(PR_SET_NO_NEW_PRIVS,1,0,0,0);`,
`prctl(22, 2, &v1);`==`prctl(PR_SET_SECCOMP,SECCOMP_MODE_FILTER,&prog);`

虽然看不出用处，但是这里先贴一个`prctl`部分的常量定义：

```c
/* Valid operations for seccomp syscall. */
#define SECCOMP_SET_MODE_STRICT		0
#define SECCOMP_SET_MODE_FILTER		1
#define SECCOMP_GET_ACTION_AVAIL	2
#define SECCOMP_GET_NOTIF_SIZES		3
```

```c
/* Valid values for seccomp.mode and prctl(PR_SET_SECCOMP, <mode>) */
#define SECCOMP_MODE_DISABLED	0 /* seccomp is not in use. */
#define SECCOMP_MODE_STRICT	1 /* uses hard-coded filter. */
#define SECCOMP_MODE_FILTER	2 /* uses user-supplied filter. */
```

```c
/*
 * All BPF programs must return a 32-bit value.
 * The bottom 16-bits are for optional return data.
 * The upper 16-bits are ordered from least permissive values to most,
 * as a signed value (so 0x8000000 is negative).
 *
 * The ordering ensures that a min_t() over composed return values always
 * selects the least permissive choice.
 */
#define SECCOMP_RET_KILL_PROCESS 0x80000000U /* kill the process */
#define SECCOMP_RET_KILL_THREAD	 0x00000000U /* kill the thread */
#define SECCOMP_RET_KILL	 SECCOMP_RET_KILL_THREAD
#define SECCOMP_RET_TRAP	 0x00030000U /* disallow and force a SIGSYS */
#define SECCOMP_RET_ERRNO	 0x00050000U /* returns an errno */
#define SECCOMP_RET_USER_NOTIF	 0x7fc00000U /* notifies userspace */
#define SECCOMP_RET_TRACE	 0x7ff00000U /* pass to a tracer or disallow */
#define SECCOMP_RET_LOG		 0x7ffc0000U /* allow after logging */
#define SECCOMP_RET_ALLOW	 0x7fff0000U /* allow */

/* Masks for the return value sections. */
#define SECCOMP_RET_ACTION_FULL	0xffff0000U
#define SECCOMP_RET_ACTION	0x7fff0000U
#define SECCOMP_RET_DATA	0x0000ffffU
```

然后就是IDA好像认不出这个sock_fprog结构体

```
struct sock_filter {	/* Filter block */
	__u16	code;   /* Actual filter code */
	__u8	jt;	/* Jump true */
	__u8	jf;	/* Jump false */
	__u32	k;      /* Generic multiuse field */
};

struct sock_fprog {	/* Required for SO_ATTACH_FILTER. */
	unsigned short		len;	/* Number of filter blocks */
	struct sock_filter *filter;
};
```

([see](https://github.com/torvalds/linux/blob/master/tools/include/uapi/linux/filter.h#L24))

# dump bpf

([refer](https://github.com/antoinet/pwnable.tw/blob/master/01_orw/README.md))

```
gdb-peda$ b *0x08048526
Breakpoint 1 at 0x8048526
gdb-peda$ r
Starting program: /opt/pwnable/orw
Breakpoint 1, 0x08048526 in orw_seccomp ()
gdb-peda$ dump binary memory bpf_bytecode $eax+8 $eax+108
gdb-peda$ quit
```

`0x08048526`是用IDA看到的调`prctl`的位置`.text:08048526                 call    _prctl`

`dump binary memory bpf_bytecode $eax+8 $eax+108`中 `bpf_bytecode` 是文件名，`$eax+8 $eax+108`我个人理解是含的越多越好（？

```
# cat bpf_bytecode| ~/git/libseccomp/tools/scmp_bpf_disasm
 line  OP   JT   JF   K
=================================
 0000: 0x20 0x00 0x00 0x00000004   ld  $data[4]
 0001: 0x15 0x00 0x09 0x40000003   jeq 1073741827 true:0002 false:0011
 0002: 0x20 0x00 0x00 0x00000000   ld  $data[0]
 0003: 0x15 0x07 0x00 0x000000ad   jeq 173  true:0011 false:0004                ; sys_rt_sigreturn
 0004: 0x15 0x06 0x00 0x00000077   jeq 119  true:0011 false:0005                ; sys_sigreturn
 0005: 0x15 0x05 0x00 0x000000fc   jeq 252  true:0011 false:0006                ; sys_exit_group
 0006: 0x15 0x04 0x00 0x00000001   jeq 1    true:0011 false:0007                ; sys_exit
 0007: 0x15 0x03 0x00 0x00000005   jeq 5    true:0011 false:0008                ; sys_open
 0008: 0x15 0x02 0x00 0x00000003   jeq 3    true:0011 false:0009                ; sys_read
 0009: 0x15 0x01 0x00 0x00000004   jeq 4    true:0011 false:0010                ; sys_write
 0010: 0x06 0x00 0x00 0x00050026   ret ERRNO(38)
 0011: 0x06 0x00 0x00 0x7fff0000   ret ALLOW
```

这里wp用的是libseccomp官方库里的tools，我见到还有过用`seccomp-tools`的，可以比较一下。

Update: 用了`seccomp-tools`，感觉体验远胜于libseccomp/tools，[david942j/seccomp-tools: Provide powerful tools for seccomp analysis](https://github.com/david942j/seccomp-tools)

```
➜  pwnable-tw--10 seccomp-tools disasm bpf_bytecode
 line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x09 0x40000003  if (A != ARCH_I386) goto 0011
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x15 0x07 0x00 0x000000ad  if (A == i386.rt_sigreturn) goto 0011
 0004: 0x15 0x06 0x00 0x00000077  if (A == i386.sigreturn) goto 0011
 0005: 0x15 0x05 0x00 0x000000fc  if (A == i386.exit_group) goto 0011
 0006: 0x15 0x04 0x00 0x00000001  if (A == i386.exit) goto 0011
 0007: 0x15 0x03 0x00 0x00000005  if (A == i386.open) goto 0011
 0008: 0x15 0x02 0x00 0x00000003  if (A == i386.read) goto 0011
 0009: 0x15 0x01 0x00 0x00000004  if (A == i386.write) goto 0011
 0010: 0x06 0x00 0x00 0x00050026  return ERRNO(38)
 0011: 0x06 0x00 0x00 0x7fff0000  return ALLOW
```

还有就是用`seccomp-tools dump ./filename`可以直接从可执行文件中dump出bpf.
