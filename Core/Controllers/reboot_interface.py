from telnetlib import DO
import xtelnet
import requests
import json
from datetime import datetime
import socket

t=xtelnet.session()
hora = datetime.now().strftime('%H')
print(int(hora))
payload = {'Option': 'GetAminos'}
Devices = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=payload)
IDF = json.loads(Devices.content)
print(IDF)
for ips in IDF:
    try:
        ip=ips['ip']
        #ip = '10.30.12.134'
        mac = ips['mac_address']
        payload = {'Option': 'SetKillProcess', 'MacAddress':mac, 'Kill':1}
        Devices = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=payload)
        t.connect(ip, username='root',password='root2root',p=23,timeout=8)
        if int(hora) > 16:
            output1=t.execute('ps')
            out = output1.split('\n')
            for ou in out:
                if '/mnt/nv/mediad' in ou:
                    o = ou.split(" ")
    #                    print(o[1])
                    t.execute('kill '+o[1])
            for ou in out:
                if '/mnt/nv/opera --bootfile /tmp/opera_boot' in ou:
    #                    print(ou)
                    o = ou.split(" ")
    #                    print(o[1])
                    t.execute('kill '+o[1])
            t.close()
        else:
            output1=t.execute('reboot')
            t.close()
            print("REBOOT")
    except:
        #print('error')
        continue


#t.connect('10.0.3.62', username='root',password='root2root',p=23,timeout=5)
#output1=t.execute('reboot')
