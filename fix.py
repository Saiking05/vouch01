import os
import glob
import re

directory = r'd:\aiinfluencer\src\app\dashboard'
count = 0
for filepath in glob.glob(directory + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex replacing to avoid hardcoded exact match bugs
    new_content = re.sub(
        r'<AvatarImg src=\{inf\.avatar_url\} name=\{inf\.name\} size=\{([^\}]+)\} (rounded="[^"]+")? ?/>',
        r'<AvatarImg src={inf.avatar_url} name={inf.name} handle={inf.handle} platform={inf.platform} size={\1} \2 />',
        content
    )
    new_content = re.sub(
        r'<AvatarImg src=\{risk\.influencers\?\.avatar_url \?\? ""\} name=\{risk\.influencers\?\.name \?\? "Unknown"\} size=\{([^\}]+)\} rounded="([^"]+)" />',
        r'<AvatarImg src={risk.influencers?.avatar_url ?? ""} name={risk.influencers?.name ?? "Unknown"} handle={risk.influencers?.handle} platform={risk.influencers?.platform} size={\1} rounded="\2" />',
        new_content
    )
    new_content = re.sub(
        r'<AvatarImg src=\{profile\.avatar_url\} name=\{profile\.name\} size=\{([^\}]+)\} rounded="([^"]+)" />',
        r'<AvatarImg src={profile.avatar_url} name={profile.name} handle={profile.handle} platform={profile.platform} size={\1} rounded="\2" />',
        new_content
    )
    new_content = re.sub(
        r'<AvatarImg src=\{comparison\.influencer_a\.avatar_url\} name=\{comparison\.influencer_a\.name\} size=\{([^\}]+)\} rounded="([^"]+)" />',
        r'<AvatarImg src={comparison.influencer_a.avatar_url} name={comparison.influencer_a.name} handle={comparison.influencer_a.handle} platform={comparison.influencer_a.platform} size={\1} rounded="\2" />',
        new_content
    )
    new_content = re.sub(
        r'<AvatarImg src=\{comparison\.influencer_b\.avatar_url\} name=\{comparison\.influencer_b\.name\} size=\{([^\}]+)\} rounded="([^"]+)" />',
        r'<AvatarImg src={comparison.influencer_b.avatar_url} name={comparison.influencer_b.name} handle={comparison.influencer_b.handle} platform={comparison.influencer_b.platform} size={\1} rounded="\2" />',
        new_content
    )
    new_content = re.sub(
        r'<AvatarImg src=\{i\.avatar_url\} name=\{i\.name\} size=\{([^\}]+)\} rounded="([^"]+)" />',
        r'<AvatarImg src={i.avatar_url} name={i.name} handle={i.handle} platform={i.platform} size={\1} rounded="\2" />',
        new_content
    )

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1

print(f"Updated {count} files")
