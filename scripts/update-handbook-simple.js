const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('/home/gamp/Documents/lms/.env.local', 'utf8');
const lines = env.split('\n');
let url = '', key = '';
lines.forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
});

const client = createClient(url, key);

const clearSimpleMarkdown = `# Lesson 0.1: Welcome to Programming — How Computers Think

> **Phase**: Phase 0 — First Steps in Programming
> **Prerequisites**: Absolutely None (Zero coding background needed!)
> **What You Will Learn**: How a computer takes instructions, how to save items in memory, and how to write your first program.

---

## 🍳 1. What Is a Computer Program? (The Simple Kitchen Recipe)

If you have never written a single line of code in your life, do not worry! 

A computer is simply a **helpful assistant who follows everyday recipes with 100% exact precision**. It does not guess, assume, or improvise. It only follows each step exactly as written.

A computer program consists of three very basic steps:
1. **Ingredients (Input Data)**: The numbers, words, and items you provide.
2. **Kitchen Cooking (Clear Instructions)**: What you tell the computer to do with those ingredients (like adding them together or checking if something is ready).
3. **Delicious Dish (The Result)**: The final outcome shown on your screen!

![How a Computer Program Works: Ingredients, Instructions, and Final Screen Result](/diagrams/recipe_analogy_diagram.jpg)

### Why Precision Matters
Imagine a recipe says: *"Put the pizza in the oven and wait."*
A human naturally knows to take it out after 15 minutes. But a computer doesn't know that unless you tell it! If you don't give it an exact stopping step, it will keep waiting forever. Writing software is simply writing clear, friendly, and step-by-step instructions.

---

## 📦 2. Storing Information in Variables (The Labeled Box)

What is a **variable**? 

Think of a variable as a **labeled storage box**. 
- You stick a name label on the outside of the box (for example, \`player_score\` or \`user_name\`).
- You put a piece of information inside the box (like the number \`100\` or the name \`'Alice'\`).
- Anytime you need that information later, you just mention the name on the box, and the computer opens it for you!

![How Variables Work: Storing, Reading, and Updating Values in Labeled Boxes](/diagrams/variable_box_diagram.jpg)

### How It Looks in Simple Python Code:

#### Step A: Putting a number in a box
\`\`\`python
# We create a box called 'score' and put the number 0 inside
score = 0
print("Starting score:", score)
\`\`\`

#### Step B: Updating the box
\`\`\`python
# You scored points! Let's update what is inside the box:
score = score + 50
print("New score:", score)
\`\`\`

#### Step C: Storing words and text
\`\`\`python
# In programming, text is written inside quotation marks
player_name = "Alice"
print(f"Welcome to the game, {player_name}! Your score is {score}.")
\`\`\`

---

## ➕ 3. Everyday Math: How Computers Add and Multiply

Computers are lightning-fast calculators. In Python, math is as simple as typing into a basic pocket calculator:

| What you want to do | The Math Sign | Example Code | What it Gives |
|---|---|---|---|
| **Add** | \`+\` | \`10 + 5\` | \`15\` |
| **Subtract** | \`-\` | \`20 - 4\` | \`16\` |
| **Multiply** | \`*\` | \`6 * 7\` | \`42\` |
| **Divide** | \`/\` | \`10 / 2\` | \`5.0\` |
| **Leftover Remainder** | \`%\` | \`11 % 2\` | \`1\` (because 2 fits 5 times with 1 left over) |

Let's see a real calculation:
\`\`\`python
# Let's count how many minutes are in 3 full days:
days = 3
hours = days * 24
minutes = hours * 60

print(f"In {days} days, there are {minutes} total minutes!")
\`\`\`

---

## 💡 4. A Peek Inside: How Computers Remember with Tiny Light Switches

Have you ever wondered how your phone or laptop actually holds pictures, songs, and text?

At the most basic level, computers are made of billions of microscopic light switches:
- When a switch is turned **OFF**, it stands for **0** (no electric flow).
- When a switch is turned **ON**, it stands for **1** (electric flow present).

A single switch is called a **Bit** (short for *Binary Digit*).  
When you group **8 switches together**, it is called a **Byte**!

![Light Switches in Computers: 1 Switch is a Bit, 8 Switches make 1 Byte](/diagrams/bits_and_bytes_diagram.jpg)

Every letter you type and every number you see is simply a unique pattern of these 8 switches. For example, the capital letter \`A\` is just the pattern \`01000001\`!

---

## ⚠️ 5. Common Beginner Mistakes (And How to Easily Avoid Them!)

> [!WARNING]
> **Trap 1: The Difference Between \`=\` and \`==\`**  
> This is the #1 mistake every new programmer makes, but it is easy to master when you remember this simple rule:  
> - **One equal sign (\`=\`)** means: **Put this value into the box!** (Action)  
> - **Two equal signs (\`==\`)** means: **Are these two things equal?** (Question)  

![Difference between Single Equal Sign (=) and Double Equal Sign (==)](/diagrams/equal_vs_double_equal_diagram.jpg)

> [!WARNING]
> **Trap 2: Adding Words vs. Adding Numbers**  
> Notice how quotes change everything:  
> - \`5 + 5\` gives \`10\` (it does real math).  
> - \`"5" + "5"\` gives \`"55"\` (because quotes treat them like words and glue them together).  

---

## 🎯 6. Hands-On Practice Exercise

Now that you understand recipes, labeled boxes, and simple math, it is time to try it yourself!

1. Click the **Complete Theory & Launch Exercise** button below.
2. In the coding editor, you will write a simple 1-line formula that swaps two numbers.
3. Click **Run Test Suite** to watch the computer verify your code!
`;

async function run() {
  const { data, error } = await client
    .from('curriculum_nodes')
    .update({ handbook_markdown: clearSimpleMarkdown })
    .eq('id', 'node-0-1');

  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('Successfully updated Supabase handbook_markdown for node-0-1 with illustrated simple theory!');
  }
}

run();
