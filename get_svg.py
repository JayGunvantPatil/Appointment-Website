import urllib.request
import re

url = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Caduceus.svg"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        svg_content = response.read().decode('utf-8')
    
    # Ensure all hex blacks or raw blacks are mapped to Medical Green
    svg_content = re.sub(r'fill="[^"]+"', 'fill="#10B981"', svg_content)
    svg_content = svg_content.replace('black', '#10B981')
    svg_content = svg_content.replace('#000000', '#10B981')
    
    # Catch any untagged SVG parameters mapping default fill fallback
    if 'fill="#10B981"' not in svg_content:
        svg_content = svg_content.replace('<svg ', '<svg fill="#10B981" ')
        
    with open('a:/Hospital Website/public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("SVG fetched and parsed successfully!")
except Exception as e:
    print(f"Error fetching SVG: {e}")
