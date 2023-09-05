from telnetlib import DO
import paramiko
import xtelnet
import requests
import json
#from datetime import datetime
import socket
import base64


t=xtelnet.session()

payload = {'Option': 'GetAminosToReboot'}
Devices = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=payload)
IDF = json.loads(Devices.content)
print(IDF)

for ips in IDF:
    ip=ips['ip']
    try:
        if ips['marca'] == 'Amino':
            
            print(ip)
            t.connect(ip, username='root',password='root2root',p=23,timeout=8)
            output1=t.execute('reboot')
            t.close()
            print("REBOOT AMINO")

        elif ips['modelo'] == 'MAG420':   
            ip = ip.strip()
            print(ip)
            client = paramiko.SSHClient()
            #client.load_system_host_keys()
            #client.load_host_keys('~/.ssh/known_hosts')
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.load_system_host_keys()
            client.connect(hostname=ip, port='22', username='root',password='930920')
            stdin, stdout, stderr = client.exec_command('/sbin/reboot -f > /dev/null 2>&1 &')
            lines = stdout.readlines()
            print(lines)
            stdin.close()
            stdout.close()
            stderr.close()
            client.close()
            print("REBOOT INFOMIR 420")
        
        elif ips['modelo'] == '500x':
            ip = ip.strip()
            print(ip)
            k = paramiko.RSAKey.from_private_key_file('/var/www/html/keyname.pem')
            client = paramiko.SSHClient()
            #client.load_system_host_keys()
            #client.load_host_keys('~/.ssh/known_hosts')
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.load_system_host_keys()
            client.connect(hostname=ip, port='10022', pkey= k)
            stdin, stdout, stderr = client.exec_command('/sbin/reboot -f > /dev/null 2>&1 &')
            print("REBOOT KAMAI")
            lines = stdout.readlines()
            print(lines)
            stdin.close()
            stdout.close()
            stderr.close()
            client.close()
        info = {'Option': 'updateDeviceReboot', 'MacAddress': ips['mac_address'],'Reboot': 0}
        req = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=info)            
    except:
        info = {'Option': 'updateDeviceReboot', 'MacAddress': ips['mac_address'],'Reboot': 477}
        req = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=info) 
        continue
info = {'Option': 'UpdateParameter', 'RebootStatus': 1}
req = requests.post('http://localhost/BBINCO/TV/Core/Controllers/DevicesStatus.php', data=info)



 







