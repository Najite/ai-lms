import json
import re

MANIFEST_PATH = "/home/sawacha/lms/supabase/curriculum_manifest.json"
CURRICULUM_PATH = "/home/sawacha/lms/curriculum.md"

def build_beginner_spec(phase_id, lesson_id, title, subtopics, prereq, fail, verif, proj):
    subtopic_lines = []
    for idx, st in enumerate(subtopics, 1):
        st_num = f"{phase_id}.{lesson_id}.{idx}"
        subtopic_lines.append(f"  - `{st_num}` {st}")
    subtopics_str = "\n".join(subtopic_lines)

    return f"""#### Lesson {phase_id}.{lesson_id}: {title}
- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: {prereq}
- **Subtopics**:
{subtopics_str}
- **Key Failure Modes & Edge Cases**: {fail}
- **Verification & Mastery Check**: {verif}
- **Project Application**: {proj}
"""

def renumber_chunk(text_chunk, phase_num, offset):
    parts = re.split(rf'(#### Lesson {phase_num}\.\d+:)', text_chunk)
    out = [parts[0]]
    for i in range(1, len(parts), 2):
        header = parts[i]
        body = parts[i+1]
        old_num = int(re.search(rf'{phase_num}\.(\d+)', header).group(1))
        new_num = old_num + offset
        new_header = f'#### Lesson {phase_num}.{new_num}:'
        
        # In body, replace subtopic references `{phase_num}.{old_num}.X`
        body = re.sub(rf'`{phase_num}\.{old_num}\.(\d+)`', rf'`{phase_num}.{new_num}.\1`', body)
        
        # Replace intra-phase prerequisites: Lesson {phase_num}.{X} -> Lesson {phase_num}.{X+offset}
        def repl_prereq(m):
            x = int(m.group(1))
            return f'Lesson {phase_num}.{x+offset}'
        body = re.sub(rf'Lesson {phase_num}\.(\d+)', repl_prereq, body)
        
        out.append(new_header + body)
    return ''.join(out)

print("Helper definitions loaded successfully.")
