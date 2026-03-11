import os
import glob
import re

directory = r'd:\aiinfluencer\src\app\dashboard'
count = 0

for filepath in glob.glob(directory + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        original_content = f.read()

    content = original_content

    # 1. Inject Private/No Activity Badges near platform badges.
    def badge_injector(match):
        full_match = match.group(0)
        var_name = match.group(2)
        
        badges = f"""
                                                {{ {var_name}.posts === 0 && (
                                                    <span className="neo-badge bg-[var(--color-neo-red)]/10 text-[var(--color-neo-red)] px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                                        No Activity
                                                    </span>
                                                )}}
                                                {{ {var_name}.posts > 0 && {var_name}.engagement_rate === 0 && (
                                                    <span className="neo-badge bg-[var(--color-neo-black)]/10 text-[var(--color-neo-black)]/60 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                                        Private
                                                    </span>
                                                )}}"""
        return full_match + badges

    # Find {VAR.platform} badge end
    content = re.sub(
        r'(<span[^>]*>\s*\{([a-zA-Z_0-9]+)\.platform\}\s*</span>)',
        badge_injector,
        content
    )
    
    # 2. Update Engagement rate
    content = re.sub(
        r'<p\s+className="([^"]+)"\s*>\s*\{([a-zA-Z_0-9]+)\.engagement_rate\}%\s*</p>',
        r'<p className="\1">{\2.engagement_rate === 0 ? "N/A" : \2.engagement_rate + "%"}</p>',
        content
    )
    
    # 3. Update ROI
    content = re.sub(
        r'<p\s+className="([^"]+)"\s*>\s*\{([a-zA-Z_0-9]+)\.predicted_roi\}x\s*</p>',
        r'<p className="\1">{\2.engagement_rate === 0 ? "N/A" : \2.predicted_roi + "x"}</p>',
        content
    )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1

print(f"Updated {count} files")
