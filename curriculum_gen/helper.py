def format_lesson(phase_id, lesson_id, title, prereqs, subtopics, failure_modes, verification, project_app):
    subtopic_lines = []
    for idx, st in enumerate(subtopics, 1):
        st_num = f"{phase_id}.{lesson_id}.{idx}"
        subtopic_lines.append(f"  - `{st_num}` {st}")
    
    subtopics_str = "\n".join(subtopic_lines)
    
    return f"""#### Lesson {phase_id}.{lesson_id}: {title}
- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: {prereqs}
- **Subtopics**:
{subtopics_str}
- **Key Failure Modes & Edge Cases**: {failure_modes}
- **Verification & Mastery Check**: {verification}
- **Project Application**: {project_app}
"""
