import requests
import json
import datetime


res = requests.get('http://park_where:3000/parkwhere/api/get?unix=1')
data = json.loads(res.text)
print(data)
now = datetime.datetime.now()

for key in data.keys():
    last_update = datetime.datetime.utcfromtimestamp(data[key])
    diff = now - last_update

    if diff.days > 0 and diff.days % 7 == 0:
        print('Car "' + key + '" has been idle for ' + str(diff.days) + ' days')
        res1= requests.get(f'http://park_where:7000/notify?car={key}&days={str(diff.days)}')
        print(res1.text)