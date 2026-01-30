import google.generativeai as genai

genai.configure(api_key="AIzaSyDwK041jVR7WrlzAyG_uE5Img_8FfoQyJw")

for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)