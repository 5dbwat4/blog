---
title: 区分 C/C++ 的各个 format style
date: 2025-01-28T14:59:12+08:00
tags:
---
在VS Code编辑C/C++文件时，Alt+Shift+F 快捷键会默认使用拓展[C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)进行文档格式化

查看C_Cpp.formatting@ext:ms-vscode.cpptools这一配置项，发现VS Code默认使用clang-format进行格式化

> Coding style, currently supports: `Visual Studio`, `LLVM`, `Google`, `Chromium`, `Mozilla`, `WebKit`, `Microsoft`, `GNU`. Use `file` to load the style from a `.clang-format` file in the current or parent directory, or use `file:<path>/.clang-format` to reference a specific path.

查询文档[Clang-Format Style Options — Clang 20.0.0git documentation](https://clang.llvm.org/docs/ClangFormatStyleOptions.html)得知

* `LLVM` A style complying with the [LLVM coding standards](https://llvm.org/docs/CodingStandards.html)
* `Google` A style complying with [Google’s C++ style guide](https://google.github.io/styleguide/cppguide.html)
* `Chromium` A style complying with [Chromium’s style guide](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/styleguide/styleguide.md)
* `Mozilla` A style complying with [Mozilla’s style guide](https://firefox-source-docs.mozilla.org/code-quality/coding-style/index.html)
* `WebKit` A style complying with [WebKit’s style guide](https://www.webkit.org/coding/coding-style.html)
* `Microsoft` A style complying with [Microsoft’s style guide](https://docs.microsoft.com/en-us/visualstudio/ide/editorconfig-code-style-settings-reference)
* `GNU` A style complying with the [GNU coding standards](https://www.gnu.org/prep/standards/standards.html)

<!-- more -->


### **1. LLVM Style**

* **Indentation**: 2 spaces.
* **Braces**: Opening braces on the same line, closing braces on their own line.
* **Line Length**: 80 columns.
* **Naming**: CamelCase for types, lower\_case for functions and variables.
* **Spacing**: Spaces around operators, after commas, and in control structures.
* **Pointer Alignment**: `int *ptr` (space before `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Focus on readability and consistency, with a preference for simplicity.

### **2. Google Style**

* **Indentation**: 2 spaces.
* **Braces**: Opening braces on the same line, closing braces on their own line.
* **Line Length**: 80 columns.
* **Naming**: CamelCase for types, snake\_case for functions and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int* ptr` (space after `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Emphasizes readability and consistency, with a focus on large-scale codebases.

### **3. Chromium Style**

* **Indentation**: 2 spaces.
* **Braces**: Opening braces on the same line, closing braces on their own line.
* **Line Length**: 80 columns.
* **Naming**: CamelCase for types, snake\_case for functions and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int* ptr` (space after `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Similar to Google Style but with some additional restrictions for Chromium-specific code.

### **4. Mozilla Style**

* **Indentation**: 2 spaces.
* **Braces**: Opening braces on the same line, closing braces on their own line.
* **Line Length**: 80 columns.
* **Naming**: PascalCase for types, camelCase for functions and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int* ptr` (space after `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Focuses on readability and maintainability, with a preference for clarity.

### **5. WebKit Style**

* **Indentation**: 4 spaces.
* **Braces**: Opening braces on the same line, closing braces on their own line.
* **Line Length**: 100 columns.
* **Naming**: PascalCase for types, camelCase for functions and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int* ptr` (space after `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Prioritizes readability and consistency, with a focus on web-related code.

### **6. Microsoft Style**

* **Indentation**: 4 spaces.
* **Braces**: Opening braces on their own line, closing braces on their own line (Allman style).
* **Line Length**: 120 columns.
* **Naming**: PascalCase for types, camelCase for functions and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int* ptr` (space after `*`).
* **Comments**: Use `//` for single-line comments, `/* */` for multi-line.
* **Philosophy**: Emphasizes clarity and maintainability, with a focus on Windows development.

### **7. GNU Style**

* **Indentation**: 2 spaces (for C), 8 spaces (for C++).
* **Braces**: Opening braces on their own line, closing braces on their own line (Allman style).
* **Line Length**: 79 columns.
* **Naming**: snake\_case for types, functions, and variables.
* **Spacing**: Spaces around operators and after commas.
* **Pointer Alignment**: `int *ptr` (space before `*`).
* **Comments**: Use `/* */` for both single-line and multi-line comments.
* **Philosophy**: Focuses on simplicity and adherence to GNU standards, with a preference for readability.

### **Key Differences**

1. **Indentation**:
   * LLVM, Google, Chromium, Mozilla: 2 spaces.
   * WebKit, Microsoft: 4 spaces.
   * GNU: 2 spaces (C), 8 spaces (C++).
2. **Braces**:
   * LLVM, Google, Chromium, Mozilla, WebKit: Opening braces on the same line.
   * Microsoft, GNU: Opening braces on their own line (Allman style).
3. **Line Length**:
   * LLVM, Google, Chromium, Mozilla: 80 columns.
   * WebKit: 100 columns.
   * Microsoft: 120 columns.
   * GNU: 79 columns.
4. **Naming Conventions**:
   * LLVM, Google, Chromium: CamelCase for types, snake\_case for functions and variables.
   * Mozilla, WebKit, Microsoft: PascalCase for types, camelCase for functions and variables.
   * GNU: snake\_case for everything.
5. **Pointer Alignment**:
   * LLVM, GNU: `int *ptr` (space before `*`).
   * Google, Chromium, Mozilla, WebKit, Microsoft: `int* ptr` (space after `*`).
6. **Comments**:
   * Most use `//` for single-line and `/* */` for multi-line.
   * GNU prefers `/* */` for all comments.

### **Similarities**

* All styles emphasize readability and consistency.
* Spaces around operators and after commas are common.
* Most use `//` for single-line comments and `/* */` for multi-line comments.
* Most styles align braces and indentation consistently.
