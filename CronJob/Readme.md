# Instructions for the cronjob 

1) chmod +x <path to the file>
2) crontab -e
3) * * * * * /usr/bin/python3 <path to file> >> /path/to/sync.log 2>&1
4)cat /path/to/sync.log
5) to check the cronjob: crontab -l
