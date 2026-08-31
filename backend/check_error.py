import urllib.request, json, ssl, re

ctx = ssl.create_default_context()
url = 'https://quiz-master-llor.vercel.app/api/auth/register/'
payload = json.dumps({'name': 'Shreyas', 'email': 'shreyas@test.com', 'password': 'Password@123'}).encode('utf-8')
req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    r = urllib.request.urlopen(req, context=ctx, timeout=10)
    print('SUCCESS:', r.read().decode('utf-8'))
except Exception as e:
    html = e.read().decode('utf-8')
    # search for exception
    match = re.search(r'exception_value">([^<]+)', html)
    if match:
        print('EXCEPTION VALUE:', match.group(1))
    type_match = re.search(r'Exception Type:</th>\s*<td>([^<]+)', html)
    if type_match:
        print('EXCEPTION TYPE:', type_match.group(1))
