import requests

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer " + (os.getenv("GROQ_API_KEY") or "gsk_KEY_MASKED"),
    "Content-Type": "application/json"
}
data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Rispondi OK se sei attivo"}]
}
r = requests.post(url, headers=headers, json=data)
print("STATUS CODE:", r.status_code)
print("RESPONSE:", r.text)
