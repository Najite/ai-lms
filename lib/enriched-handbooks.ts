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
  }
};
