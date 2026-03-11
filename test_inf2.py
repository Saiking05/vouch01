import urllib.request
import json
req = urllib.request.Request("http://127.0.0.1:8000/api/influencers/all?limit=1")
res = urllib.request.urlopen(req)
data = json.loads(res.read())
print("ID format:", data['results'][0]['id'])
