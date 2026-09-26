#!/usr/bin/env python3
"""
Patch script for Module 2, Lessons 2.1 to 2.10 (node-1-1 through node-1-10).
Applies:
- Relatable real-world mental models (no generic boilerplate).
- Single-topic progression (Classes -> __init__ -> Methods -> Properties -> Inheritance -> Composition -> ABCs -> Magic methods -> Operator overloading -> Containers).
- 3-part exercise briefings: exercise_about, exercise_goal, expected_output outside code.
- Clean starter code with guided # TODOs.
- Strict unit tests in test_suite['tests.py'].
"""

import os
import json
import urllib.request
import ssl

ENV_PATH = "/home/sawacha/lms/.env"
API_KEY = None
SUPABASE_URL = None

if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip("'").strip('"')
            if k == "SUPABASE_SERVICE_ROLE_KEY" and not API_KEY:
                API_KEY = v
            elif k == "SUPABASE_ANON_KEY" and not API_KEY:
                API_KEY = v
            elif k == "NEXT_PUBLIC_SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v
            elif k == "SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v

if not API_KEY or not SUPABASE_URL:
    raise RuntimeError("Missing Supabase credentials")

MODULE_2_LESSONS_1_10 = {
    # --------------------------------------------------------------------------
    # LESSON 2.1: OOP Mental Model & Classes
    # --------------------------------------------------------------------------
    "node-1-1": {
        "title": "Lesson 2.1: The OOP Mental Model: Classes & Objects",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 1 of 50",
        "cs_foundation": "Object-Oriented Programming, Classes as Blueprints, and Instances as Concrete Objects",
        "ai_convergence": "Real-World Engineering: Modeling Bank Accounts & E-Commerce Customer Entities",
        "handbook_markdown": """# Lesson 2.1: The OOP Mental Model: Classes & Objects

As software systems grow complex, storing related data and behaviors in loose, disconnected dictionaries becomes fragile.

**Object-Oriented Programming (OOP)** allows you to bundle state (attributes) and behavior (methods) together into a unified custom data type.

---

## 💡 The Real-World Mental Model: Architectural Blueprints vs Built Houses

- **The Class (`class BankAccount`)**: An architectural blueprint on paper. The blueprint itself cannot hold furniture or keep anyone warm; it merely defines the dimensions and rooms.
- **The Object / Instance (`account_1 = BankAccount(...)`)**: An actual physical house built from that blueprint. You can build 50 independent houses from the exact same blueprint, each with its own front door key and distinct furniture.

```
Blueprint (Class):
┌───────────────────────────────────────┐
│ BankAccount                           │
│ - owner: str                          │
│ - balance: float                      │
│ + deposit(amount)                     │
│ + withdraw(amount)                    │
└───────────────────────────────────────┘
                   │
     Instantiate multiple houses
                   ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│ account_1 (Alice)       │   │ account_2 (Bob)         │
│ balance: $500.00        │   │ balance: $1,200.00      │
└─────────────────────────┘   └─────────────────────────┘
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Defining a Class and Instantiating Objects
```python
class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self.balance = initial_balance

    def deposit(self, amount: float) -> float:
        if amount > 0:
            self.balance += amount
        return round(self.balance, 2)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `BankAccount` class:

1. **Constructor (`__init__`)**:
   - `def __init__(self, account_holder: str, initial_balance: float = 0.0):`
   - Store `self.account_holder = account_holder` and `self.balance = initial_balance`.
2. **Methods**:
   - `def deposit(self, amount: float) -> float`: Adds `amount` to `self.balance` (if `amount > 0`) and returns `round(self.balance, 2)`.
   - `def withdraw(self, amount: float) -> bool`: If `amount <= self.balance` and `amount > 0`, deducts `amount` and returns `True`. Otherwise returns `False`.

---

## ⚠️ Common Pitfalls

- **Forgetting `self`**: Every instance method must accept `self` as its first parameter so Python knows which object instance is executing the method.
""",
        "starter_code": {
            "solution.py": """class BankAccount:
    \"\"\"
    Represents a customer bank account managing account holder state and balance operations.
    \"\"\"
    def __init__(self, account_holder: str, initial_balance: float = 0.0):
        # TODO: Initialize account_holder and balance attributes
        pass

    def deposit(self, amount: float) -> float:
        # TODO: Add amount to balance if positive and return rounded balance
        pass

    def withdraw(self, amount: float) -> bool:
        # TODO: Deduct amount if sufficient balance exists and return True, else False
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Core banking engines use object-oriented classes to encapsulate customer account balances and safely guard deposits and withdrawals.",
            "exercise_goal": "Implement BankAccount class with __init__, deposit, and withdraw methods.",
            "expected_output": "acc = BankAccount('Alice', 100.0)\nacc.deposit(50.0) -> 150.00\nacc.withdraw(30.0) -> True (balance: 120.0)\nacc.withdraw(200.0) -> False",
            "failure_mode": "Allowing overdrawing balance or failing to update instance attributes.",
            "verification_criteria": "Class encapsulates instance state properly and enforces valid balance transactions.",
            "tests.py": """from solution import BankAccount

def test_bank_account_oop():
    acc = BankAccount("Alice", 100.0)
    assert acc.account_holder == "Alice"
    assert acc.balance == 100.0

    # Deposit
    new_bal = acc.deposit(50.0)
    assert new_bal == 150.0
    assert acc.balance == 150.0

    # Successful withdraw
    assert acc.withdraw(40.0) is True
    assert acc.balance == 110.0

    # Insufficient funds withdraw
    assert acc.withdraw(500.0) is False
    assert acc.balance == 110.0

    print("✓ All assertions passed for Lesson 2.1: OOP Mental Model")

if __name__ == '__main__':
    test_bank_account_oop()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.2: Constructors & Instance Attributes
    # --------------------------------------------------------------------------
    "node-1-2": {
        "title": "Lesson 2.2: Constructors & Instance Attribute Binding",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 2 of 50",
        "cs_foundation": "Object Lifecycle, __init__ Constructor Method, and Dynamic Attribute Binding",
        "ai_convergence": "Real-World Engineering: Initializing Product Catalog Inventory Objects",
        "handbook_markdown": """# Lesson 2.2: Constructors & Instance Attributes

When you create a new object, Python calls a special method named **`__init__`** (the constructor) to initialize the object's starting state.

Understanding how `__init__` binds parameters to **`self`** ensures your objects always start with validated, clean instance data.

---

## 💡 The Real-World Mental Model: The Factory Assembly Line Initializer

Imagine a car rolling off an assembly line:
- As soon as the raw metal frame is created, the factory initializer (**`__init__`**) installs the specific engine, paints the requested color, and stamps the unique VIN serial number.
- Once initialization finishes, the car is ready to drive with its own unique characteristics.

```
ProductItem("SKU-99", "Wireless Mouse", 29.99, stock=50)
                      │
            Python calls __init__()
                      ▼
self.sku = "SKU-99"
self.title = "Wireless Mouse"
self.price = 29.99
self.stock = 50
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Attribute Validation in `__init__`
You can validate inputs directly inside `__init__` so invalid objects can never exist:
```python
class ProductItem:
    def __init__(self, sku: str, title: str, price: float, stock: int = 0):
        if price < 0:
            raise ValueError("Price cannot be negative")
        self.sku = sku.strip().upper()
        self.title = title.strip()
        self.price = round(price, 2)
        self.stock = max(0, stock)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `ProductItem` class:

1. **`__init__`**:
   - `sku: str` (sanitized to uppercase string).
   - `title: str` (stripped string).
   - `price: float` (raises `ValueError` if `price < 0`).
   - `stock: int = 0` (integer).
2. **Method `restock(self, quantity: int) -> int`**:
   - If `quantity > 0`, adds `quantity` to `self.stock`.
   - Returns current `self.stock`.

---

## ⚠️ Common Pitfalls

- **Naming attributes without `self.`**: Writing `price = price` inside `__init__` only creates a temporary local variable that vanishes when `__init__` exits. You must write `self.price = price`.
""",
        "starter_code": {
            "solution.py": """class ProductItem:
    \"\"\"
    Represents an inventory product with validated pricing and stock replenishment.
    \"\"\"
    def __init__(self, sku: str, title: str, price: float, stock: int = 0):
        # TODO: Validate price >= 0 (raise ValueError if negative) and bind attributes
        pass

    def restock(self, quantity: int) -> int:
        # TODO: Add positive quantity to stock and return new stock count
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Warehouse inventory management systems initialize catalog stock objects with strict pricing validation and stock replenishment tracking.",
            "exercise_goal": "Implement ProductItem with __init__ price validation and restock method.",
            "expected_output": "p = ProductItem('sku-101', 'Keyboard', 49.99, stock=10)\np.sku == 'SKU-101'\np.restock(5) -> 15",
            "failure_mode": "Failing to sanitize SKU or allowing negative price without ValueError.",
            "verification_criteria": "Constructor enforces validation rules and binds instance attributes properly.",
            "tests.py": """from solution import ProductItem

def test_product_constructor():
    item = ProductItem("  sku-abc  ", "Mechanical Keyboard", 89.50, stock=5)
    assert item.sku == "SKU-ABC"
    assert item.title == "Mechanical Keyboard"
    assert item.price == 89.50
    assert item.stock == 5

    # Restock
    assert item.restock(10) == 15
    assert item.stock == 15

    # Negative price error
    try:
        ProductItem("SKU-ERR", "Broken", -10.0)
        assert False, "Expected ValueError on negative price"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.2: Constructors & Attributes")

if __name__ == '__main__':
    test_product_constructor()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.3: Class Methods & Static Methods
    # --------------------------------------------------------------------------
    "node-1-3": {
        "title": "Lesson 2.3: Instance Methods, @classmethod & @staticmethod",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 3 of 50",
        "cs_foundation": "Method Binding: Instance Methods (self), Class Methods (cls), and Static Utility Methods",
        "ai_convergence": "Real-World Engineering: Creating Alternative Factory Constructors from JSON Dictionaries",
        "handbook_markdown": """# Lesson 2.3: Instance Methods, @classmethod & @staticmethod

Not all methods on a class need access to a specific object's instance state.

Python provides three distinct types of methods:
1. **Instance Method (`self`)**: Operates on a specific object instance.
2. **Class Method (`@classmethod`, `cls`)**: Receives the class itself, commonly used as alternative **factory constructors** (e.g. `User.from_dict(...)`).
3. **Static Method (`@staticmethod`)**: A self-contained utility function grouped inside the class namespace that doesn't need `self` or `cls`.

---

## 💡 The Real-World Mental Model: Factory Floor vs The Head Office

- **Instance Method (`self.wash_car()`)**: A worker washing one specific car in Bay 4.
- **Class Method (`@classmethod Car.from_order(order_sheet)`)**: The factory order desk that reads a customer order form and manufactures a brand new `Car` object.
- **Static Method (`@staticmethod Car.miles_to_km(miles)`)**: A conversion chart hanging on the wall that anyone can read without needing a car present.

```
class Employee:
    # 1. Standard constructor:
    def __init__(self, name, salary): ...

    # 2. Factory constructor (Class Method):
    @classmethod
    def from_csv_row(cls, row_str):
        name, salary = row_str.split(",")
        return cls(name, float(salary))

    # 3. Utility (Static Method):
    @staticmethod
    def calculate_annual_bonus(salary, rating):
        return salary * 0.1 if rating > 4 else 0.0
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `CustomerProfile` class:

1. **`__init__(self, customer_id: str, email: str, loyalty_points: int = 0)`**:
   - Stores `self.customer_id`, `self.email`, and `self.loyalty_points`.
2. **`@classmethod from_json_dict(cls, data: dict)`**:
   - Reads `data["id"]`, `data["email"]`, and `data.get("points", 0)`.
   - Returns a new instance: `return cls(data["id"], data["email"], data.get("points", 0))`.
3. **`@staticmethod is_valid_email(email: str) -> bool`**:
   - Returns `True` if `email` contains `@` and `.`, else `False`.

---

## ⚠️ Common Pitfalls

- **Using `self` inside `@classmethod`**: Always use `cls` as the first parameter of a `@classmethod`.
""",
        "starter_code": {
            "solution.py": """class CustomerProfile:
    \"\"\"
    Customer profile with instance attributes, @classmethod factory constructor,
    and @staticmethod email validator.
    \"\"\"
    def __init__(self, customer_id: str, email: str, loyalty_points: int = 0):
        # TODO: Bind instance attributes
        pass

    @classmethod
    def from_json_dict(cls, data: dict):
        # TODO: Extract fields from data dict and instantiate cls(...)
        pass

    @staticmethod
    def is_valid_email(email: str) -> bool:
        # TODO: Return True if email contains '@' and '.', else False
        pass
"""
        },
        "test_suite": {
            "exercise_about": "User service APIs use class method factory constructors to build customer objects directly from incoming JSON request payloads.",
            "exercise_goal": "Implement CustomerProfile with __init__, @classmethod from_json_dict, and @staticmethod is_valid_email.",
            "expected_output": "p = CustomerProfile.from_json_dict({'id': 'C10', 'email': 'a@b.com', 'points': 50})\np.loyalty_points == 50\nCustomerProfile.is_valid_email('test@domain.com') -> True",
            "failure_mode": "Failing to decorate with @classmethod / @staticmethod or failing to return new instance from factory.",
            "verification_criteria": "Methods are correctly bound and alternative constructor builds valid instance.",
            "tests.py": """from solution import CustomerProfile

def test_methods_oop():
    # Instance constructor
    p1 = CustomerProfile("C-1", "alice@example.com", 100)
    assert p1.customer_id == "C-1"
    assert p1.loyalty_points == 100

    # Factory classmethod
    raw_payload = {"id": "C-2", "email": "bob@work.org", "points": 250}
    p2 = CustomerProfile.from_json_dict(raw_payload)
    assert isinstance(p2, CustomerProfile)
    assert p2.customer_id == "C-2"
    assert p2.loyalty_points == 250

    # Static method
    assert CustomerProfile.is_valid_email("sarah@company.com") is True
    assert CustomerProfile.is_valid_email("invalid-email-address") is False

    print("✓ All assertions passed for Lesson 2.3: Class & Static Methods")

if __name__ == '__main__':
    test_methods_oop()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.4: Encapsulation & Properties (@property)
    # --------------------------------------------------------------------------
    "node-1-4": {
        "title": "Lesson 2.4: Encapsulation & The @property Decorator",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 4 of 50",
        "cs_foundation": "Data Hiding Conventions (_private), Managed Attributes, and @property Getters/Setters",
        "ai_convergence": "Real-World Engineering: Protecting Account Balances & Temperature Sensor Units",
        "handbook_markdown": """# Lesson 2.4: Encapsulation & The @property Decorator

In Python, attributes are public by default. However, allowing outside code to directly mutate internal state (such as setting `account.balance = -999999`) leads to data corruption.

Python uses leading underscores (`_internal_variable`) to signal private state, and the **`@property` decorator** to provide managed getter and setter methods that look like clean attribute access.

---

## 💡 The Real-World Mental Model: A Digital Thermostat Dial

- **Unprotected Attribute**: Direct access to the raw internal copper heating coil wires. Anyone can cross the wires and start a fire.
- **`@property` Getter & Setter**: The clean digital dial on the wall. When you turn the dial to set a new temperature (**Setter**), the thermostat checks whether the requested temperature is within safe limits ($50^\\circ\\text{F} - 90^\\circ\\text{F}$) before engaging the heater.

```python
class Thermostat:
    def __init__(self, initial_temp: float = 70.0):
        self._temp = initial_temp

    @property
    def temperature(self) -> float:
        return self._temp

    @temperature.setter
    def temperature(self, value: float):
        if not (50.0 <= value <= 90.0):
            raise ValueError("Temperature must be between 50 and 90 degrees")
        self._temp = value
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `SavingsGoal` class:

1. **`__init__(self, title: str, target_amount: float)`**:
   - `self.title = title`
   - `self._target_amount = target_amount` (must be `> 0`, else raise `ValueError`).
   - `self._saved_amount = 0.0`
2. **Properties**:
   - `@property def target_amount(self) -> float`: Returns `self._target_amount`.
   - `@target_amount.setter def target_amount(self, value: float)`: If `value <= 0`, raise `ValueError("Target must be positive")`; else set `self._target_amount = value`.
   - `@property def progress_percentage(self) -> float`: Returns `round((self._saved_amount / self._target_amount) * 100, 1)`.
3. **Method `add_savings(self, amount: float) -> float`**:
   - If `amount > 0`, adds to `self._saved_amount`.
   - Returns `self._saved_amount`.

---

## ⚠️ Common Pitfalls

- **Infinite Recursion in Setter**: Writing `self.temperature = value` inside `temperature.setter` calls the setter again recursively until Python crashes. You must assign to the internal private variable `self._temp = value`.
""",
        "starter_code": {
            "solution.py": """class SavingsGoal:
    \"\"\"
    Manages a financial savings goal with validated target amounts and progress tracking.
    \"\"\"
    def __init__(self, title: str, target_amount: float):
        # TODO: Initialize title, _target_amount (validate > 0), and _saved_amount = 0.0
        pass

    @property
    def target_amount(self) -> float:
        # TODO: Return private target amount
        pass

    @target_amount.setter
    def target_amount(self, value: float):
        # TODO: Validate value > 0 and assign to private attribute, else raise ValueError
        pass

    @property
    def progress_percentage(self) -> float:
        # TODO: Calculate and return (saved / target) * 100 rounded to 1 decimal place
        pass

    def add_savings(self, amount: float) -> float:
        # TODO: Add positive amount to _saved_amount and return new total
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Personal finance applications use encapsulated properties to guard savings target amounts against negative values while exposing real-time progress calculations.",
            "exercise_goal": "Implement SavingsGoal class with @property getter, setter, progress_percentage, and add_savings method.",
            "expected_output": "goal = SavingsGoal('Vacation', 1000.0)\ngoal.add_savings(250.0)\ngoal.progress_percentage -> 25.0\ngoal.target_amount = -50 -> Raises ValueError",
            "failure_mode": "Infinite recursion in setter or allowing non-positive target amounts.",
            "verification_criteria": "Properties encapsulate private attributes and validate values correctly.",
            "tests.py": """from solution import SavingsGoal

def test_properties_encapsulation():
    goal = SavingsGoal("Emergency Fund", 500.0)
    assert goal.target_amount == 500.0
    assert goal.progress_percentage == 0.0

    goal.add_savings(125.0)
    assert goal.progress_percentage == 25.0

    # Valid setter update
    goal.target_amount = 1000.0
    assert goal.target_amount == 1000.0
    assert goal.progress_percentage == 12.5

    # Invalid setter update
    try:
        goal.target_amount = -100.0
        assert False, "Expected ValueError on negative target amount"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.4: Encapsulation & Properties")

if __name__ == '__main__':
    test_properties_encapsulation()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.5: Inheritance & Method Overrides
    # --------------------------------------------------------------------------
    "node-1-5": {
        "title": "Lesson 2.5: Inheritance & Polymorphic Method Overriding",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 5 of 50",
        "cs_foundation": "Class Inheritance, Subclasses, super() Call Delegation, and Method Overriding",
        "ai_convergence": "Real-World Engineering: Modeling Base Employees & Specialized Commission Sales Staff",
        "handbook_markdown": """# Lesson 2.5: Inheritance & Polymorphic Method Overriding

When multiple classes share common fields and behaviors, copying and pasting the same methods into each class violates the DRY (Don't Repeat Yourself) principle.

**Inheritance** allows a child class (subclass) to inherit all capabilities of a parent class (superclass), while customizing specific behaviors via **method overriding** and **`super()`**.

---

## 💡 The Real-World Mental Model: Base Vehicles vs Specialized Electric Cars

- **Base Class (`Vehicle`)**: Defines universal vehicle attributes (`make`, `model`, `mileage`) and methods (`drive()`).
- **Subclass (`ElectricVehicle`)**: Inherits all base vehicle features, but overrides `fuel_type` to `"Electric"` and adds battery-specific methods (`charge()`).

```
          ┌────────────────────────────────┐
          │ BaseNotification               │
          │ - recipient: str               │
          │ + send(message)                │
          └────────────────────────────────┘
                          ▲
            Inherits base notification logic
                          │
          ┌────────────────────────────────┐
          │ SMSNotification                │
          │ + send(message) [Overrides!]   │
          └────────────────────────────────┘
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Using `super().__init__()`
```python
class Employee:
    def __init__(self, name: str, base_salary: float):
        self.name = name
        self.base_salary = base_salary

    def calculate_pay(self) -> float:
        return round(self.base_salary, 2)

class CommissionSalesperson(Employee):
    def __init__(self, name: str, base_salary: float, commission_rate: float = 0.05):
        # Call the parent class constructor:
        super().__init__(name, base_salary)
        self.commission_rate = commission_rate
        self.sales_volume = 0.0

    def record_sale(self, amount: float):
        self.sales_volume += amount

    # Override calculate_pay to include commission:
    def calculate_pay(self) -> float:
        commission = self.sales_volume * self.commission_rate
        return round(self.base_salary + commission, 2)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `Employee` and `CommissionSalesperson`:

1. **`Employee`**:
   - `__init__(self, name: str, base_salary: float)`: Binds `self.name` and `self.base_salary`.
   - `calculate_pay(self) -> float`: Returns `round(self.base_salary, 2)`.
2. **`CommissionSalesperson(Employee)`**:
   - `__init__(self, name: str, base_salary: float, commission_rate: float = 0.05)`: Calls `super().__init__(name, base_salary)`, stores `commission_rate`, and initializes `self.sales_volume = 0.0`.
   - `record_sale(self, amount: float)`: Adds `amount` to `self.sales_volume`.
   - `calculate_pay(self) -> float`: Overrides parent method, returning `round(self.base_salary + (self.sales_volume * self.commission_rate), 2)`.

---

## ⚠️ Common Pitfalls

- **Forgetting `super().__init__()` in subclass**: If you omit `super().__init__()`, the parent class's instance attributes are never created on `self`.
""",
        "starter_code": {
            "solution.py": """class Employee:
    \"\"\"Base employee with name and base salary.\"\"\"
    def __init__(self, name: str, base_salary: float):
        # TODO: Initialize name and base_salary
        pass

    def calculate_pay(self) -> float:
        # TODO: Return base salary rounded to 2 decimal places
        pass


class CommissionSalesperson(Employee):
    \"\"\"Specialized employee earning base salary plus commission on recorded sales.\"\"\"
    def __init__(self, name: str, base_salary: float, commission_rate: float = 0.05):
        # TODO: Call super().__init__, bind commission_rate and sales_volume = 0.0
        pass

    def record_sale(self, amount: float) -> None:
        # TODO: Add amount to sales_volume
        pass

    def calculate_pay(self) -> float:
        # TODO: Override to return base_salary + (sales_volume * commission_rate)
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Corporate payroll engines use class inheritance to share base employee salary logic while specializing commission calculations for sales team members.",
            "exercise_goal": "Implement Employee and CommissionSalesperson with super().__init__, record_sale, and calculate_pay override.",
            "expected_output": "sp = CommissionSalesperson('Bob', 3000.0, 0.10)\nsp.record_sale(5000.0)\nsp.calculate_pay() -> 3500.00",
            "failure_mode": "Failing to inherit from Employee or failing to call super().__init__().",
            "verification_criteria": "Subclass inherits from parent, delegates constructor via super(), and overrides pay calculation.",
            "tests.py": """from solution import Employee, CommissionSalesperson

def test_inheritance_polymorphism():
    # Base employee
    emp = Employee("Alice", 4000.0)
    assert emp.calculate_pay() == 4000.0

    # Subclass
    sales = CommissionSalesperson("Bob", 2000.0, commission_rate=0.10)
    assert isinstance(sales, Employee)
    assert sales.calculate_pay() == 2000.0

    sales.record_sale(10000.0)
    assert sales.calculate_pay() == 3000.0 # 2000 + 1000 commission

    print("✓ All assertions passed for Lesson 2.5: Inheritance & Overrides")

if __name__ == '__main__':
    test_inheritance_polymorphism()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.6: Composition & Dependency Injection
    # --------------------------------------------------------------------------
    "node-1-6": {
        "title": "Lesson 2.6: Composition Over Inheritance & Dependency Injection",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 6 of 50",
        "cs_foundation": "Composition ('has-a' relationship), Loose Coupling, and Dependency Injection",
        "ai_convergence": "Real-World Engineering: Swapping Notification Senders (Email vs SMS) in Checkout Workflows",
        "handbook_markdown": """# Lesson 2.6: Composition Over Inheritance

A classic trap in software architecture is forcing deep inheritance trees (e.g. `User -> Admin -> SuperAdmin -> Auditor`). This leads to brittle, tightly coupled code.

The **Composition Over Inheritance** principle states: *"Favor 'has-a' relationships over 'is-a' relationships."* Instead of an Order *being* an Email, an Order *has* a Notifier injected into it.

---

## 💡 The Real-World Mental Model: Swappable Camera Lenses

- **Deep Inheritance**: A camera with a permanently welded macro lens. If you want a telephoto shot, you have to buy a completely new camera.
- **Composition**: A professional camera body with a standard lens mount (**Dependency Injection**). You can snap on an Email lens, an SMS lens, or a Test Mock lens anytime without changing the camera body.

```
┌─────────────────────────────────┐
│ CheckoutService                 │
│ - notifier: NotificationSender  │ ◄─── Injected at runtime!
│ + process_order(order)          │
└─────────────────────────────────┘
          │
    Calls self.notifier.send(...)
          ▼
┌───────────────────┐    ┌───────────────────┐
│ EmailNotifier     │ or │ SMSNotifier       │
└───────────────────┘    └───────────────────┘
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement modular notification services using composition:

1. **`EmailNotifier`**:
   - `def send(self, recipient: str, message: str) -> str`: Returns `f"EMAIL to {recipient}: {message}"`.
2. **`SMSNotifier`**:
   - `def send(self, recipient: str, message: str) -> str`: Returns `f"SMS to {recipient}: {message}"`.
3. **`OrderCheckout` (Composed Container)**:
   - `__init__(self, notifier)`: Stores `self.notifier = notifier` and `self.orders = []`.
   - `complete_order(self, customer_contact: str, total_amount: float) -> str`:
     - Builds message: `f"Order of ${total_amount:.2f} confirmed."`
     - Calls and returns `self.notifier.send(customer_contact, message)`.

---

## ⚠️ Common Pitfalls

- **Hardcoding concrete dependencies inside `__init__`**: Avoid `self.notifier = EmailNotifier()`; accept the notifier as an injected parameter so it can be swapped.
""",
        "starter_code": {
            "solution.py": """class EmailNotifier:
    def send(self, recipient: str, message: str) -> str:
        # TODO: Return 'EMAIL to {recipient}: {message}'
        pass


class SMSNotifier:
    def send(self, recipient: str, message: str) -> str:
        # TODO: Return 'SMS to {recipient}: {message}'
        pass


class OrderCheckout:
    \"\"\"Composes a swappable notifier instance to dispatch order confirmations.\"\"\"
    def __init__(self, notifier):
        # TODO: Store injected notifier dependency
        pass

    def complete_order(self, customer_contact: str, total_amount: float) -> str:
        # TODO: Dispatch confirmation message via self.notifier.send and return result
        pass
"""
        },
        "test_suite": {
            "exercise_about": "E-commerce checkout services use composition and dependency injection to swap delivery notification channels without altering core order processing logic.",
            "exercise_goal": "Implement EmailNotifier, SMSNotifier, and OrderCheckout with injected notifier.",
            "expected_output": "co = OrderCheckout(EmailNotifier())\nco.complete_order('alice@test.com', 45.0) -> 'EMAIL to alice@test.com: Order of $45.00 confirmed.'",
            "failure_mode": "Hardcoding notifier instance or incorrect confirmation string format.",
            "verification_criteria": "OrderCheckout delegates messaging to injected notifier polymorphically.",
            "tests.py": """from solution import EmailNotifier, SMSNotifier, OrderCheckout

def test_composition():
    # Email channel
    email_checkout = OrderCheckout(EmailNotifier())
    res_email = email_checkout.complete_order("sarah@corp.com", 99.50)
    assert res_email == "EMAIL to sarah@corp.com: Order of $99.50 confirmed."

    # SMS channel
    sms_checkout = OrderCheckout(SMSNotifier())
    res_sms = sms_checkout.complete_order("+15550199", 25.00)
    assert res_sms == "SMS to +15550199: Order of $25.00 confirmed."

    print("✓ All assertions passed for Lesson 2.6: Composition")

if __name__ == '__main__':
    test_composition()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.7: Abstract Base Classes & Protocols
    # --------------------------------------------------------------------------
    "node-1-7": {
        "title": "Lesson 2.7: Abstract Base Classes & Formal Interface Contracts",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 7 of 50",
        "cs_foundation": "The abc.ABC Base Class, @abstractmethod Decorator, and Interface Enforcement",
        "ai_convergence": "Real-World Engineering: Enforcing Standard Payment Gateway Contracts (Stripe vs PayPal)",
        "handbook_markdown": """# Lesson 2.7: Abstract Base Classes & Formal Contracts

In large multi-developer codebases, you need to enforce that every payment gateway, database connector, or storage engine implements a specific set of required methods.

Python's **`abc` module** (Abstract Base Classes) allows you to define formal interface contracts. If a subclass fails to implement an **`@abstractmethod`**, Python prevents the subclass from being instantiated.

---

## 💡 The Real-World Mental Model: A Universal Outlet Specification

Think of an electrical wall socket standard:
- The standard (**`ABC`**) defines the exact dimensions and voltage requirements. You cannot plug appliances directly into a piece of paper.
- Any manufacturer building a plug must implement the exact prong dimensions (**`@abstractmethod`**). If they leave off a prong, the plug physically cannot connect.

```python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_charge(self, amount: float) -> dict:
        \"\"\"Must be implemented by all payment adapters.\"\"\"
        pass
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the abstract payment gateway interface:

1. **`PaymentProcessor(ABC)`**:
   - `@abstractmethod def charge(self, amount: float) -> dict:` pass.
2. **`CreditCardProcessor(PaymentProcessor)`**:
   - `__init__(self, merchant_id: str)`: stores `self.merchant_id`.
   - `charge(self, amount: float) -> dict`: Returns `{"status": "success", "provider": "CreditCard", "merchant": self.merchant_id, "amount": round(amount, 2)}`.

---

## ⚠️ Common Pitfalls

- **Attempting to instantiate an abstract class directly**: Calling `PaymentProcessor()` raises `TypeError: Can't instantiate abstract class with abstract methods`.
""",
        "starter_code": {
            "solution.py": """from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    \"\"\"Abstract base interface contract for all payment processors.\"\"\"
    @abstractmethod
    def charge(self, amount: float) -> dict:
        pass


class CreditCardProcessor(PaymentProcessor):
    \"\"\"Concrete implementation for credit card transactions.\"\"\"
    def __init__(self, merchant_id: str):
        # TODO: Store merchant_id
        pass

    def charge(self, amount: float) -> dict:
        # TODO: Return transaction dict with status, provider, merchant, and amount
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial integration backends enforce abstract base class contracts to guarantee all payment adapters implement uniform charge and refund methods.",
            "exercise_goal": "Define PaymentProcessor ABC with @abstractmethod charge and implement CreditCardProcessor subclass.",
            "expected_output": "cc = CreditCardProcessor('MCH-100')\ncc.charge(50.0) -> {'status': 'success', 'provider': 'CreditCard', 'merchant': 'MCH-100', 'amount': 50.0}",
            "failure_mode": "Failing to inherit from ABC or failing to implement abstract method in subclass.",
            "verification_criteria": "Abstract class blocks instantiation, and concrete subclass fulfills interface contract.",
            "tests.py": """from solution import PaymentProcessor, CreditCardProcessor

def test_abc_contracts():
    # Verify PaymentProcessor cannot be instantiated directly
    try:
        PaymentProcessor()
        assert False, "Expected TypeError when instantiating abstract base class"
    except TypeError:
        pass

    # Concrete implementation
    proc = CreditCardProcessor("MERCHANT-88")
    assert isinstance(proc, PaymentProcessor)
    res = proc.charge(75.50)
    assert res == {
        "status": "success",
        "provider": "CreditCard",
        "merchant": "MERCHANT-88",
        "amount": 75.50
    }

    print("✓ All assertions passed for Lesson 2.7: Abstract Base Classes")

if __name__ == '__main__':
    test_abc_contracts()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.8: Magic Methods & String Representations
    # --------------------------------------------------------------------------
    "node-1-8": {
        "title": "Lesson 2.8: Magic Methods: __repr__ and __str__",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 8 of 50",
        "cs_foundation": "Dunder Methods, Object Representation (__repr__), and User-Facing Formatting (__str__)",
        "ai_convergence": "Real-World Engineering: Formatting Order Items for Terminal Debuggers & Customer Receipts",
        "handbook_markdown": """# Lesson 2.8: Magic Methods: __repr__ and __str__

When you print a plain Python object, you get an unhelpful string like `<__main__.OrderItem object at 0x7f8b90>`.

Python's **dunder (double underscore) magic methods** allow you to customize how your objects display:
- **`__str__`**: User-friendly display format (what end users see on a receipt).
- **`__repr__`**: Unambiguous developer debugging format (what engineers see in logs and REPL terminals).

---

## 💡 The Real-World Mental Model: A Product Barcode vs Its Shelf Label

- **`__str__` (The Shelf Label)**: Clean, human-readable text for shoppers: `"Organic Coffee ($14.99)"`.
- **`__repr__` (The Barcode Scanner)**: Exact, unambiguous serial code for engineers and inventory systems: `"Product(id='SKU-402', price=14.99, in_stock=True)"`.

```python
class Product:
    def __init__(self, sku: str, price: float):
        self.sku = sku
        self.price = price

    def __str__(self) -> str:
        return f"Product {self.sku} (${self.price:.2f})"

    def __repr__(self) -> str:
        return f"Product(sku='{self.sku}', price={self.price})"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `OrderItem` class:

1. **`__init__(self, item_name: str, unit_price: float, quantity: int = 1)`**:
   - Stores `self.item_name`, `self.unit_price`, and `self.quantity`.
2. **`__str__(self) -> str`**:
   - Return `f"{self.quantity}x {self.item_name} @ ${self.unit_price:.2f}"` (e.g. `"2x Coffee Beans @ $15.00"`).
3. **`__repr__(self) -> str`**:
   - Return `f"OrderItem(item_name='{self.item_name}', unit_price={self.unit_price}, quantity={self.quantity})"`.

---

## ⚠️ Common Pitfalls

- **`__repr__` fallback**: If `__str__` is not defined, Python falls back to `__repr__`. But defining both is best practice.
""",
        "starter_code": {
            "solution.py": """class OrderItem:
    \"\"\"
    Represents a purchased line item with custom __str__ and __repr__ magic methods.
    \"\"\"
    def __init__(self, item_name: str, unit_price: float, quantity: int = 1):
        # TODO: Store instance attributes
        pass

    def __str__(self) -> str:
        # TODO: Return user-friendly format: '{quantity}x {item_name} @ ${unit_price:.2f}'
        pass

    def __repr__(self) -> str:
        # TODO: Return unambiguous developer format: OrderItem(item_name='...', unit_price=..., quantity=...)
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Order management pipelines implement custom __repr__ and __str__ magic methods so order objects render cleanly in customer receipts and developer debug logs.",
            "exercise_goal": "Implement OrderItem with custom __str__ and __repr__ implementations.",
            "expected_output": "item = OrderItem('Tea', 4.5, 2)\nstr(item) -> '2x Tea @ $4.50'\nrepr(item) -> \"OrderItem(item_name='Tea', unit_price=4.5, quantity=2)\"",
            "failure_mode": "Failing to match exact string formats.",
            "verification_criteria": "Object produces expected output for both str() and repr() calls.",
            "tests.py": """from solution import OrderItem

def test_dunder_representations():
    item = OrderItem("Cold Brew", 5.25, 2)
    assert str(item) == "2x Cold Brew @ $5.25"
    assert repr(item) == "OrderItem(item_name='Cold Brew', unit_price=5.25, quantity=2)"

    print("✓ All assertions passed for Lesson 2.8: Magic Methods __repr__ and __str__")

if __name__ == '__main__':
    test_dunder_representations()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.9: Operator Overloading (__add__, __eq__, __lt__)
    # --------------------------------------------------------------------------
    "node-1-9": {
        "title": "Lesson 2.9: Operator Overloading: __add__, __eq__ & Custom Math",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 9 of 50",
        "cs_foundation": "Operator Overloading, Value Equality (__eq__), Addition (__add__), and Comparisons",
        "ai_convergence": "Real-World Engineering: Adding Currency Balances & Comparing Financial Money Objects",
        "handbook_markdown": """# Lesson 2.9: Operator Overloading: Custom Math & Equality

In Python, operators like `+`, `==`, and `<` aren't hardcoded solely for integers and floats.

By implementing **operator overloading dunder methods** (`__add__`, `__eq__`, `__lt__`), you can make your custom domain objects interact naturally using standard mathematical syntax.

---

## 💡 The Real-World Mental Model: Physical Money Bags

Imagine two bags of cash:
- If you have Bag A with $50 and Bag B with $30, putting them together (**`Bag A + Bag B`**) naturally produces a new Bag with $80.
- Comparing whether Bag A has the same value as Bag C (**`Bag A == Bag C`**) checks their monetary contents, not whether they are the same physical bag.

```python
class Money:
    def __init__(self, dollars: float):
        self.dollars = round(dollars, 2)

    def __add__(self, other: 'Money') -> 'Money':
        return Money(self.dollars + other.dollars)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Money):
            return self.dollars == other.dollars
        return False
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `Currency` class:

1. **`__init__(self, amount: float, currency_code: str = "USD")`**:
   - Stores `self.amount = round(amount, 2)` and `self.currency_code = currency_code.upper()`.
2. **`__add__(self, other)`**:
   - If `not isinstance(other, Currency)` or `self.currency_code != other.currency_code`:
     - Raise `ValueError("Cannot add different currencies")`.
   - Returns a new `Currency(self.amount + other.amount, self.currency_code)`.
3. **`__eq__(self, other)`**:
   - Returns `True` if `isinstance(other, Currency)` and both `amount` and `currency_code` match.

---

## ⚠️ Common Pitfalls

- **Mutating `self` during `__add__`**: `__add__` should return a **new** object instance; it must not mutate `self.amount` in place.
""",
        "starter_code": {
            "solution.py": """class Currency:
    \"\"\"
    Represents monetary value with currency code and overloaded + and == operators.
    \"\"\"
    def __init__(self, amount: float, currency_code: str = "USD"):
        # TODO: Initialize amount and uppercase currency_code
        pass

    def __add__(self, other):
        # TODO: Validate matching Currency type and code, return new Currency instance
        pass

    def __eq__(self, other):
        # TODO: Return True if other is Currency with matching amount and code
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial accounting microservices use operator overloading to safely add currency values while preventing accidental cross-currency math errors.",
            "exercise_goal": "Implement Currency class with __add__ and __eq__ operator overloading.",
            "expected_output": "c1 = Currency(50.0, 'USD')\nc2 = Currency(25.0, 'USD')\nc3 = c1 + c2\nc3 == Currency(75.0, 'USD') -> True",
            "failure_mode": "Allowing addition across different currency codes or mutating original instance.",
            "verification_criteria": "Operator overloading works seamlessly and enforces currency safety.",
            "tests.py": """from solution import Currency

def test_operator_overloading():
    c1 = Currency(40.50, "USD")
    c2 = Currency(20.25, "USD")
    c3 = c1 + c2

    assert c3.amount == 60.75
    assert c3.currency_code == "USD"
    assert c3 == Currency(60.75, "USD")

    # Verify original objects were not mutated
    assert c1.amount == 40.50

    # Incompatible currency addition
    c_eur = Currency(10.0, "EUR")
    try:
        c1 + c_eur
        assert False, "Expected ValueError on different currency codes"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.9: Operator Overloading")

if __name__ == '__main__':
    test_operator_overloading()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 2.10: Container Protocol (__len__, __getitem__)
    # --------------------------------------------------------------------------
    "node-1-10": {
        "title": "Lesson 2.10: Container Protocol & Custom Collection Buffers",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 10 of 50",
        "cs_foundation": "Container Protocol, __len__, __getitem__, and Implementing Custom Sequence Collections",
        "ai_convergence": "Real-World Engineering: Building Bounded Sliding History Buffers",
        "handbook_markdown": """# Lesson 2.10: Container Protocol & Custom Collections

In Python, you don't have to inherit from `list` to make an object that supports `len(obj)` or index lookups like `obj[0]`.

By implementing the **Container Protocol** magic methods (**`__len__`** and **`__getitem__`**), any custom class becomes indexable, sliceable, and iterable in `for` loops.

---

## 💡 The Real-World Mental Model: A Rotating Restaurant Order Wheel

- **Standard List**: An infinite conveyor belt that grows forever until the restaurant runs out of space.
- **Custom Bounded Buffer**: A spinning order wheel with exactly 10 order ticket clips. When a new ticket arrives, the oldest ticket is dropped, and you can query the wheel's ticket count (`len(wheel)`) or inspect the 1st ticket (`wheel[0]`).

```python
class BoundedBuffer:
    def __init__(self, capacity: int = 5):
        self._items = []
        self.capacity = capacity

    def __len__(self) -> int:
        return len(self._items)

    def __getitem__(self, index):
        return self._items[index]
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `BoundedHistoryBuffer` class:

1. **`__init__(self, max_size: int = 5)`**:
   - `self._storage = []`
   - `self.max_size = max_size`
2. **Method `push(self, item)`**:
   - Appends `item` to `self._storage`.
   - If `len(self._storage) > self.max_size`, removes the oldest item (`self._storage.pop(0)`).
3. **Container Protocol Methods**:
   - `__len__(self) -> int`: Returns `len(self._storage)`.
   - `__getitem__(self, index)`: Returns `self._storage[index]`.

---

## ⚠️ Common Pitfalls

- **Implementing `__getitem__` makes the object iterable automatically**: Python automatically uses `__getitem__` to support `for item in buffer:` loops.
""",
        "starter_code": {
            "solution.py": """class BoundedHistoryBuffer:
    \"\"\"
    A bounded FIFO buffer implementing the container protocol (__len__, __getitem__).
    \"\"\"
    def __init__(self, max_size: int = 5):
        # TODO: Initialize _storage list and max_size
        pass

    def push(self, item) -> None:
        # TODO: Append item and evict oldest if exceeding max_size
        pass

    def __len__(self) -> int:
        # TODO: Return number of items currently in buffer
        pass

    def __getitem__(self, index):
        # TODO: Return item at index from _storage
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Event telemetry and chat buffers use bounded FIFO collections with container protocol methods to inspect historical events and compute buffer sizes.",
            "exercise_goal": "Implement BoundedHistoryBuffer with push, __len__, and __getitem__.",
            "expected_output": "buf = BoundedHistoryBuffer(max_size=2)\nbuf.push('A'); buf.push('B'); buf.push('C')\nlen(buf) == 2\nbuf[0] == 'B'",
            "failure_mode": "Failing to implement __len__ or __getitem__ or allowing size to exceed max_size.",
            "verification_criteria": "Buffer maintains bounded capacity and implements container protocol indexing.",
            "tests.py": """from solution import BoundedHistoryBuffer

def test_container_protocol():
    buf = BoundedHistoryBuffer(max_size=3)
    buf.push("msg_1")
    buf.push("msg_2")
    buf.push("msg_3")
    
    assert len(buf) == 3
    assert buf[0] == "msg_1"
    assert buf[2] == "msg_3"

    # Push 4th item (evicts msg_1)
    buf.push("msg_4")
    assert len(buf) == 3
    assert buf[0] == "msg_2"
    assert buf[2] == "msg_4"

    # Test iteration support via __getitem__
    items = [x for x in buf]
    assert items == ["msg_2", "msg_3", "msg_4"]

    print("✓ All assertions passed for Lesson 2.10: Container Protocol")

if __name__ == '__main__':
    test_container_protocol()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(MODULE_2_LESSONS_1_10)} lessons in Module 2 (node-1-1 to node-1-10)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in MODULE_2_LESSONS_1_10.items():
        payload = {
            "title": data["title"],
            "subtitle": data["subtitle"],
            "cs_foundation": data["cs_foundation"],
            "ai_convergence": data["ai_convergence"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        url = f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": API_KEY,
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        try:
            with urllib.request.urlopen(req, context=ctx) as response:
                print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {response.status}")
        except Exception as e:
            print(f"✗ Failed to patch {node_id}: {e}")

if __name__ == "__main__":
    apply_patch()
