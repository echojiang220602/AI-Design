---
创建日期: 2026-05-26
AI 备注: Python面向对象核心：模块（3类导入）、类（__init__+self）、封装/继承/多态三大特征
relate:
  - "[[20260525-python入门5小时基础学习]]"
  - "[[K104-知识管理]]"
---

# Python面向对象核心

## 三类模块导入

| 类型 | 使用方式 | 示例 |
|------|---------|------|
| 内置函数 | 直接调用 | `print()`、`len()`、`abs()` |
| 内置模块 | `import` 导入 | `math`、`json`、`datetime` |
| 第三方模块 | `pip install` 后导入 | `numpy`、`pandas` |

## 类的创建

```python
class Person:
    def __init__(self, name, age):  # 构造函数
        self.name = name            # self绑定属性
        self.age = age
    
    def __str__(self):
        return f"{self.name}, {self.age}岁"

p = Person("张三", 25)
```

**关键**：`__init__` 创建对象自动执行，`self` 代表对象本身。

## 三大特征

| 特征 | 核心 | 示例 |
|------|------|------|
| **封装** | 隐藏细节，只留接口 | 手机只露屏幕，内部芯片不可见 |
| **继承** | 子承父业，代码复用 | `class Student(Person)` |
| **多态** | 同一接口，多种实现 | `speak()` 狗叫/猫叫 |

### 封装示例

```python
class BankAccount:
    def __init__(self):
        self._balance = 0  # 下划线表示受保护
    
    def deposit(self, amount):
        self._balance += amount
    
    def get_balance(self):
        return self._balance  # 只暴露接口，保证安全
```

### 继承示例

```python
class Animal:
    def breathe(self):
        print("呼吸")

class Person(Animal):  # 括号内写父类
    def __init__(self, name):
        super().__init__(2)  # 调用父类构造函数
        self.name = name
```

### 多态示例

```python
class Dog:
    def speak(self): print("汪汪汪")

class Cat:
    def speak(self): print("喵喵喵")

def make_speak(animal):
    animal.speak()  # 同一调用，结果各异

make_speak(Dog())  # 汪汪汪
make_speak(Cat())  # 喵喵喵
```

## 面向过程 vs 面向对象

| 维度 | 面向过程 | 面向对象 |
|------|---------|---------|
| 思维 | "怎么做" | "谁来做" |
| 组织 | 流水线顺序 | 多对象协作 |
| 维护 | 复杂时难维护 | 模块化易扩展 |

**OOP核心**：把"做事的人"抽象成对象，对象有属性（特征）和方法（行为），通过封装/继承/多态实现代码复用和扩展。

---
来源：[[20260525-python入门5小时基础学习]]