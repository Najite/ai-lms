/**
 * Rich, plain-English pedagogical modules with zero complex jargon and crisp architectural illustrations.
 * Used to augment curriculum nodes with friendly mental models and visual diagrams.
 */

export interface EnrichedHandbook {
  title: string;
  handbook: string;
}

export const ENRICHED_MODULE_HANDBOOKS: Record<string, EnrichedHandbook> = {
  "node-0-1": {
    title: "Lesson 0.1: Welcome to Programming — How Computers Think",
    handbook: `# Lesson 0.1: Welcome to Programming — How Computers Think

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Absolutely None (Zero coding background needed!)  
> **What You Will Learn**: How a computer takes instructions, how to save items in memory, and how to write your first program.  

---

## 🍳 1. What Is a Computer Program? (The Simple Kitchen Recipe)

If you have never written a single line of code in your life, do not worry at all!

Think of a computer as a **friendly, super-fast assistant who follows recipes with 100% exact precision**. It does not guess, assume, or improvise. It only carries out each instruction step by step, exactly as you wrote it.

Every computer program has three simple parts:
1. **Ingredients (Input Data)**: The numbers, words, and choices you give the computer.
2. **Kitchen Cooking (Clear Instructions)**: What you tell the computer to do with those ingredients (like adding numbers together or checking if an item is ready).
3. **Delicious Dish (The Screen Result)**: The final outcome that appears on the user's screen!

![How a Computer Program Works: Ingredients, Instructions, and Final Screen Result](/diagrams/recipe_analogy_diagram.jpg)

### Why Exact Instructions Matter
Imagine a recipe says: *"Put the pizza in the oven and wait."*  
A human naturally knows to take the pizza out after 15 minutes. But a computer does not know that! If you do not give it a stopping step, it will keep waiting forever. Writing software is simply writing clear, friendly, and step-by-step instructions.

---

## 📦 2. Storing Information with Variables (The Labeled Box)

What is a **variable**?

Think of a variable as a **labeled cardboard box**:
- You write a name label on the outside of the box (for example, \`player_score\` or \`user_name\`).
- You put a piece of information inside the box (like the number \`100\` or the name \`'Alice'\`).
- Whenever you need that information later, you just say the name on the box, and the computer opens it for you!

![How Variables Work: Storing, Reading, and Updating Values in Labeled Boxes](/diagrams/variable_box_diagram.jpg)

### Let's See It in Simple Python Code:

#### Step A: Putting a number into a box
\`\`\`python
# We create a box called 'score' and place the number 0 inside
score = 0
print("Starting score:", score)
\`\`\`

#### Step B: Updating what is inside the box
\`\`\`python
# The player scored points! Let's update the value inside the box:
score = score + 50
print("New score:", score)
\`\`\`

#### Step C: Storing text and words
\`\`\`python
# In programming, text is written inside quotation marks so the computer knows it is a word
player_name = "Alice"
print(f"Welcome to the game, {player_name}! Your score is {score}.")
\`\`\`

---

## ➕ 3. Everyday Math: How Computers Add and Multiply

Computers are lightning-fast calculators. In Python, doing math is just like using a basic pocket calculator:

| What you want to do | The Math Sign | Example Code | What it Gives |
|---|---|---|---|
| **Add** | \`+\` | \`10 + 5\` | \`15\` |
| **Subtract** | \`-\` | \`20 - 4\` | \`16\` |
| **Multiply** | \`*\` | \`6 * 7\` | \`42\` |
| **Divide** | \`/\` | \`10 / 2\` | \`5.0\` |
| **Leftover Remainder** | \`%\` | \`11 % 2\` | \`1\` (2 fits 5 times with 1 left over) |

Here is a simple real-life calculation:
\`\`\`python
# Let's calculate how many minutes are in 3 full days:
days = 3
hours = days * 24
minutes = hours * 60

print(f"In {days} days, there are {minutes} total minutes!")
\`\`\`

---

## 💡 4. A Peek Inside: How Computers Remember with Tiny Light Switches

Have you ever wondered how your phone or computer actually holds photos, songs, and games?

At the physical level, computers are made of billions of microscopic light switches:
- When a switch is turned **OFF**, it stands for **0** (no electric flow).
- When a switch is turned **ON**, it stands for **1** (electric flow present).

A single switch is called a **Bit** (short for *Binary Digit*).  
When you group **8 switches together**, it is called a **Byte**!

![Light Switches in Computers: 1 Switch is a Bit, 8 Switches make 1 Byte](/diagrams/bits_and_bytes_diagram.jpg)

Every letter you type and every number on your screen is simply a neat combination of these 8 switches. For example, the letter \`A\` is represented by the switch pattern \`01000001\`!

---

## ⚠️ 5. Common Beginner Traps (And How to Easily Avoid Them!)

> [!WARNING]
> **Trap 1: The Difference Between \`=\` and \`==\`**  
> This is the #1 mistake every new programmer makes, but it is easy when you remember this rule:  
> - **One equal sign (\`=\`)** means: **Put this value into the box!** (Action)  
> - **Two equal signs (\`==\`)** means: **Are these two things equal?** (Question)  

![Difference between Single Equal Sign (=) and Double Equal Sign (==)](/diagrams/equal_vs_double_equal_diagram.jpg)

> [!WARNING]
> **Trap 2: Adding Words vs. Adding Numbers**  
> Notice how quotes change how Python behaves:  
> - \`5 + 5\` gives \`10\` (it performs real addition).  
> - \`"5" + "5"\` gives \`"55"\` (quotes tell Python these are words, so it glues them together).  

---

## 🎯 6. Hands-On Practice Exercise

Now that you understand recipes, labeled boxes, and simple math, it is time to write your first solution!

1. Click the **Complete Theory & Launch Exercise** button below.
2. In the coding editor, you will complete a friendly 1-line formula that swaps two values.
3. Click **Run Test Suite** to watch the computer verify your code!
`
  },
  "node-0-2": {
    title: "Lesson 0.2: Making Decisions — How Programs Choose Paths",
    handbook: `# Lesson 0.2: Making Decisions — How Programs Choose Paths

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Lesson 0.1 (Variables & Labeled Boxes)  
> **What You Will Learn**: How a computer makes choices using simple yes/no checks, and how to guide your program down different paths.  

---

## 🔀 1. How Programs Make Choices (The Road Fork)

In everyday life, you make simple choices constantly:  
*"If it is raining outside, take an umbrella. Otherwise, wear sunglasses."*

Computers make decisions the exact same way. We call this an **if-else statement**.

![How Programs Make Decisions: Evaluating Conditions to Choose a Path](/diagrams/conditionals_fork_diagram.jpg)

### The Calm Invariant
A computer only checks if a statement is **True** or **False**:
- If the statement is **True**, it takes the first path.
- If the statement is **False**, it takes the alternate path.
There is no guessing. You are simply giving your computer a clear map for any situation.

---

## 🧭 2. Step-by-Step Python Examples

### Example 1: A Basic Yes/No Check
\`\`\`python
# Check if a player has enough points to pass
score = 85

if score >= 50:
    print("Congratulations! You passed this level.")
else:
    print("Keep practicing, you will get it next time!")
\`\`\`

### Example 2: Comparing Numbers with Friendly Symbols
Here is a handy reminder for comparison symbols:

| Comparison | Symbol | Example | What it Means |
|---|---|---|---|
| **Greater than** | \`>\` | \`10 > 5\` | Is 10 bigger than 5? (True) |
| **Less than** | \`<\` | \`3 < 8\` | Is 3 smaller than 8? (True) |
| **Equal to** | \`==\` | \`5 == 5\` | Are these identical? (True) |
| **Not equal to** | \`!=\` | \`5 != 2\` | Are these different? (True) |

---

## ⚠️ 3. Helpful Things to Keep in Mind

> [!NOTE]
> **Spacing (Indentation) Matters in Python**  
> Notice how the lines under \`if\` and \`else\` are indented with spaces:  
> Python uses spaces to know which actions belong inside the decision. Your editor will automatically indent these lines for you!

---

## 🎯 4. Hands-On Practice Exercise

Ready to see choices in action?  
Click the **Complete Theory & Launch Exercise** button below to try a friendly decision-making exercise!
`
  },
  "node-0-3": {
    title: "Lesson 0.3: Repetition & Loops — Letting Computers Do the Work",
    handbook: `# Lesson 0.3: Repetition & Loops — Letting Computers Do the Work

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Lessons 0.1 & 0.2  
> **What You Will Learn**: How to have the computer repeat repetitive tasks for you automatically without writing the same code twice.  

---

## 🔄 1. Why Computers Love Repeating Tasks (The Carousel)

Humans get tired when repeating the same task 1,000 times. But computers never get bored or tired! They can repeat an action millions of times per second with perfect precision.

In programming, repeating an action is called a **Loop**.

Think of a loop as a **carousel track**:
- The computer starts the loop.
- It asks: *"Is the task finished yet?"*
- If **No**, it does the task and loops around again.
- If **Yes**, it gently exits the loop and continues forward!

![How Loops Work: Smooth Repetition on a Carousel Track](/diagrams/loop_carousel_diagram.jpg)

---

## 🏃 2. Writing Your First Loop in Python

### Example 1: Counting from 1 to 5 with a For-Loop
\`\`\`python
# Let's count from 1 to 5:
for number in range(1, 6):
    print("Current count:", number)

print("All done counting!")
\`\`\`

### Example 2: Repeating while a condition is true
\`\`\`python
# Count down until fuel is empty:
fuel = 3

while fuel > 0:
    print(f"Engine running... Fuel left: {fuel}")
    fuel = fuel - 1

print("Landed smoothly!")
\`\`\`

---

## 🎯 3. Hands-On Practice Exercise

Click **Complete Theory & Launch Exercise** below to practice writing a clean, simple loop!
`
  },
  "node-0-4": {
    title: "Lesson 0.4: Functions & Modularity — Building Reusable Tools",
    handbook: `# Lesson 0.4: Functions & Modularity — Building Reusable Tools

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Lessons 0.1, 0.2 & 0.3  
> **What You Will Learn**: How to bundle instructions into reusable machines called functions so you never repeat yourself.  

---

## 🏭 1. What Is a Function? (The Processing Machine)

Imagine you work in a bakery. Every time an order comes in, you don't build a new oven from scratch. You already have an oven machine! You simply:
1. Feed in the ingredients (**Input Parameters**).
2. The oven follows its preset steps (**Function Body**).
3. Out comes a warm loaf of bread (**Return Value**).

In programming, a **function** is exactly that: a self-contained, labeled machine that takes input, does a specific task, and returns the result.

![How Functions Work: Inputs, Steps, and Output Return Values](/diagrams/functions_machines_diagram.jpg)

### Why Functions Make You a Better Engineer
- **Reusability**: Write code once, use it thousands of times.
- **Organization**: Break a massive program into tiny, manageable tools.
- **Bug Prevention**: When a calculation needs fixing, you fix it in one place, not in 50 different files.

---

## 🛠️ 2. Writing a Function in Python

Here is how simple defining a function is:

\`\`\`python
# Step 1: Define the function using 'def'
def calculate_fuel(distance_km: float) -> float:
    # 1 km needs 0.08 liters of fuel
    liters_needed = distance_km * 0.08
    return round(liters_needed, 2)

# Step 2: Call the function anytime you need it!
trip_a = calculate_fuel(120.0)
trip_b = calculate_fuel(450.5)

print(f"Trip A needs {trip_a}L, Trip B needs {trip_b}L")
\`\`\`

---

## 🎯 3. Hands-On Practice Exercise

Click **Complete Theory & Launch Exercise** below to build your first modular function!
`
  },
  "node-0-5": {
    title: "Lesson 0.5: Collections & Arrays — Organizing Items in Lists",
    handbook: `# Lesson 0.5: Collections & Arrays — Organizing Items in Lists

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Lessons 0.1 to 0.4  
> **What You Will Learn**: How to store multiple related items in a single ordered list, access items by index, and filter data.  

---

## 🗄️ 1. What Is a List? (The Numbered Locker System)

Instead of creating 50 separate variables like \`user1\`, \`user2\`, \`user3\`..., computers group related items into a single container called a **List** (or **Array**).

Think of a list as a **row of numbered storage lockers**:
- Every locker has an **index number** marking its exact position.
- In programming, counting almost always starts at **0** (zero-based indexing)!
- Locker \`0\` holds the first item, Locker \`1\` holds the second item, and so on.

![How Lists Work: Indexed Elements Starting at Position Zero](/diagrams/lists_arrays_diagram.jpg)

---

## 🔢 2. Common List Operations in Python

### Creating and Accessing Elements
\`\`\`python
# Storing server names in a list
servers = ["alpha", "beta", "gamma", "delta"]

# Accessing by position (Index 0 is the first!)
print("Primary server:", servers[0])  # prints: alpha
print("Backup server:", servers[1])   # prints: beta
\`\`\`

### Adding and Filtering
\`\`\`python
# Adding a new server to the end:
servers.append("epsilon")

# Filtering items using a simple loop:
scores = [45, 88, 92, 59, 100]
high_scores = []

for score in scores:
    if score >= 80:
        high_scores.append(score)

print("High scores:", high_scores) # [88, 92, 100]
\`\`\`

---

## 🎯 3. Hands-On Practice Exercise

Click **Complete Theory & Launch Exercise** below to filter and transform lists like a pro!
`
  },
  "node-0-6": {
    title: "Lesson 0.6: Dictionaries & Hash Maps — Ultra-Fast Lookups",
    handbook: `# Lesson 0.6: Dictionaries & Hash Maps — Ultra-Fast Lookups

> **Phase**: Phase 0 — First Steps in Programming  
> **Prerequisites**: Lessons 0.1 to 0.5  
> **What You Will Learn**: How hash maps allow instant O(1) data lookups using unique keys, and why they power modern databases and caches.  

---

## 📖 1. What Is a Dictionary / Hash Map? (The Contact List)

When you look up a contact in your phone, you don't scroll through 2,000 phone numbers one by one to see which belongs to your best friend. Instead, you search their **name**, and their phone number immediately pops up!

A **Dictionary** (or **Hash Map**) pairs a unique **Key** with a **Value**:
- **Key**: The unique identifier (like a user email, ID, or setting name).
- **Value**: The data linked to that key (like user profile, token, or score).

![Understanding Hash Maps and Dictionaries: Key to Value Mapping](/diagrams/hashmap_dictionary_diagram.jpg)

### Why Engineers Love Hash Maps
Searching through an unsorted list of 10 million items takes 10 million comparisons.  
Searching a Hash Map takes **1 single step** ($O(1)$ constant time), whether you have 10 items or 10 billion items!

---

## ⚡ 2. How to Use Dictionaries in Python

\`\`\`python
# Creating a user session dictionary
user_session = {
    "user_id": "usr_9481",
    "name": "Sarah Chen",
    "role": "systems_architect",
    "active": True
}

# Instant lookup by key
print("User Name:", user_session["name"])
print("Role:", user_session["role"])

# Adding a new key-value pair
user_session["last_login"] = "2026-09-21"
\`\`\`

---

## 🎯 3. Hands-On Practice Exercise

Click **Complete Theory & Launch Exercise** below to build a high-performance frequency map and simulated cache!
`
  }
};
