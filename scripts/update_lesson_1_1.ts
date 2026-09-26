import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.existsSync('.env.local')
  ? fs.readFileSync('.env.local', 'utf8')
  : fs.existsSync('.env')
  ? fs.readFileSync('.env', 'utf8')
  : '';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() ||
  '';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() ||
  '';

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const lesson1Handbook = `# Lesson 1.1: Python Basics & Data Types

When we write software for AI systems, the computer must first understand what type of data it is handling. When calling model APIs or reading prompt completions, values arrive as raw text. Before you can track token usage, enforce rate limits, or calculate API costs, you must convert that text into the proper Python types.

---

## 💡 The Mental Model

Think of Python data types like labeled containers in a workshop:
- **String (\`str\`)**: Labeled storage for words, characters, and text.
- **Integer (\`int\`)**: Labeled storage for whole counts (you cannot process half a token).
- **Float (\`float\`)**: Labeled storage for numbers with decimal fractions (like token costs: $0.003).
- **Dictionary (\`dict\`)**: A labeled organizer box where you place values under named tabs (called **keys**).

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Primitive Types in Python
Python automatically assigns types to variables, but when data arrives from the outside world (an API response or file), numbers often arrive formatted as strings:
\`\`\`python
model_name = "claude-3-5-sonnet"  # str: textual label
raw_tokens = "8192"                # str: text that looks like a number
raw_cost = "0.003"                 # str: text that looks like a decimal
\`\`\`

### 2. Type Casting (Conversion)
To do math or store structured data, you convert between types using Python converter functions:
- \`int("8192")\` -> produces the integer \`8192\`
- \`float("0.003")\` -> produces the decimal float \`0.003\`
- \`str(100)\` -> produces the text \`"100"\`

### 3. Assembling a Dictionary & Returning Output
A Python dictionary stores information in key-value pairs using curly braces \`{}\`. To give the caller back their result, you use the \`return\` keyword:

\`\`\`python
# Creating and returning a dictionary
result = {
    "name": "claude-3-5-sonnet",
    "tokens": 8192,
    "cost": 0.003
}
return result
\`\`\`

---

## 🛠️ Step-by-Step Implementation Guide

Follow these steps to complete the exercise:

1. **Inspect Incoming Arguments**: Your function receives \`name\` (text), \`tokens\` (a string like \`"8192"\`), and \`cost\` (a string like \`"0.003"\`).
2. **Convert the Token Count**: Wrap \`tokens\` in \`int(tokens)\` so it becomes a whole number.
3. **Convert the Cost Rate**: Wrap \`cost\` in \`float(cost)\` so it becomes a decimal number.
4. **Build and Return the Dictionary**: Return a dictionary containing \`"name"\`, \`"tokens"\`, and \`"cost"\` mapped to your cleaned values.

### Starter Template
\`\`\`python
def parse_model_spec(name: str, tokens: str, cost: str) -> dict:
    """
    Parses and casts model metadata.
    Returns: {'name': str, 'tokens': int, 'cost': float}
    """
    # Replace pass with your implementation
    pass
\`\`\`

---

## ⚠️ Common Pitfalls to Avoid

- **String Concatenation Trap**: In Python, \`"100" + "50"\` results in \`"10050"\`, not \`150\`. If you forget to convert with \`int()\`, arithmetic will fail.
- **Missing the return statement**: If your function does not \`return\` the dictionary, Python returns \`None\` by default and the tests will fail.
- **Forgetting Quotes on Dictionary Keys**: Keys in standard Python dictionaries must be quoted strings: \`{"name": name}\`, not \`{name: name}\`.

---

## 🧪 Verification & Automated Checks

The test suite runs directly in your browser. It verifies that your output matches the exact structure required:

\`\`\`python
from solution import parse_model_spec

def test_parse():
    res = parse_model_spec("claude-3-5-sonnet", "8192", "0.003")
    assert res == {"name": "claude-3-5-sonnet", "tokens": 8192, "cost": 0.003}
    assert isinstance(res["tokens"], int)
    assert isinstance(res["cost"], float)
    print("✓ All assertions passed for Lesson 1.1")

if __name__ == "__main__":
    test_parse()
\`\`\`

---

## 🤖 Real-World Relevance for AI Engineers

Every LLM gateway (LiteLLM, Portkey, LangChain) ingests model metadata from config files or headers. Getting types wrong in production causes silent arithmetic errors in billing systems and context-window truncation.

---

## 🎯 Quick Self-Check
- Why must \`tokens\` be an \`int\` rather than a \`str\`?
- What syntax in Python groups key-value pairs together?
- Does your function explicitly \`return\` the resulting dictionary?
`;

const starterCode = {
  "solution.py": `def parse_model_spec(name: str, tokens: str, cost: str) -> dict:
    """
    Returns {'name': str, 'tokens': int, 'cost': float} with proper type casting.
    """
    # TODO: Cast tokens to int, cost to float, and return the dictionary
    pass
`
};

async function updateLesson1() {
  console.log('Updating Lesson 1.1 in Supabase...');
  const { data, error } = await supabase
    .from('curriculum_nodes')
    .update({
      handbook_markdown: lesson1Handbook,
      starter_code: starterCode,
      content_status: 'reviewed'
    })
    .eq('id', 'node-0-1')
    .select('id, title');

  if (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }

  console.log('Successfully updated Lesson 1.1 in Supabase:', data);
}

updateLesson1();
