import json
import re
import sys

transcript_path = "/home/pepper-salt/.gemini/antigravity-ide/brain/aadeadf7-345d-4ede-ae16-5a5d395c1245/.system_generated/logs/transcript.jsonl"
output_path = "/home/pepper-salt/.gemini/antigravity-ide/scratch/tfiverse/box_office_planning_chat_history.md"

def extract_user_request(content):
    if not content:
        return ""
    # Try to find content between <USER_REQUEST> and </USER_REQUEST>
    match = re.search(r"<USER_REQUEST>(.*?)</USER_REQUEST>", content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return content.strip()

try:
    with open(transcript_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
except Exception as e:
    print(f"Error reading transcript: {e}")
    sys.exit(1)

md_content = []
md_content.append("# TFIverse - Box Office Planning Chat History\n")
md_content.append("This document contains the complete chat history of our planning and implementation for the BFilmy box office scraping and recovery work.\n")
md_content.append("--- \n")

for line_num, line in enumerate(lines, 1):
    try:
        data = json.loads(line)
        step_type = data.get("type")
        source = data.get("source")
        created_at = data.get("created_at", "")
        content = data.get("content", "")
        
        # Clean up timestamp for presentation
        time_str = created_at.replace("T", " ").replace("Z", "") if created_at else ""
        
        if step_type == "USER_INPUT":
            user_msg = extract_user_request(content)
            if user_msg:
                md_content.append(f"### 👤 User [{time_str}]\n\n{user_msg}\n\n---\n")
                
        elif step_type == "PLANNER_RESPONSE" and source == "MODEL":
            if content:
                md_content.append(f"### 🤖 Antigravity [{time_str}]\n\n{content}\n\n---\n")
                
    except Exception as e:
        # Skip malformed lines
        continue

try:
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md_content))
    print(f"Chat history successfully exported to {output_path}")
except Exception as e:
    print(f"Error writing markdown: {e}")
    sys.exit(1)
