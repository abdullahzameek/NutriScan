import requests
import json
# import cv2

# test_url = 'http://localhost:5000/get-predict'
# test_url2 = 'http://localhost:5000/update-calories-by-userid'

test_url = "https://nutriscan.appspot.com/get-predict"

# prepare headers for http request
content_type = 'image/jpeg'
headers = {'content-type': content_type}


# img = cv2.imread('/home/abdullahz/Desktop/food41/donuts/100576.jpg')
img  = ('/home/abdullahz/Desktop/food41/chicken_wings/57530.jpg')

with open(img, 'rb') as image_file:
    content = image_file.read()
    print(type(content))

# encode image as jpeg
# _, img_encoded = cv2.imencode('.jpg', img)
# send http request with image and receive response
response = requests.post(test_url, data=content, headers=headers)

# decode response
print(json.loads(response.text))