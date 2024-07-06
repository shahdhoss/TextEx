from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
from PIL import Image

app = Flask(__name__)
CORS(app)  
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    try:
        img = Image.open(file_path)
        string_from_text = pytesseract.image_to_string(img)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'status': 'success', 'string': string_from_text})

if __name__ == '__main__':
    app.run(debug=True)
