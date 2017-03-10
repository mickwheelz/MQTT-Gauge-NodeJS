#!/bin/bash
# Tested using bash version 4.1.5
a=0
b=0
c=0
d=0
for ((i=1;i<=28;i++));
do
   ((a=$i*500))
   ((b=$i*5))
   mosquitto_pub -h 127.0.0.1 -t testGaugeTopic/liveData --qos 0 -m "$a|$b|51.13379|4.13279|50|2"
   echo $i
   sleep .5
done
for ((i=28;i<=1;i--));
do
   ((a=$i*500))
   ((b=$i*5))
   mosquitto_pub -h 127.0.0.1 -t testGaugeTopic/liveData --qos 0 -m "$a|$b|51.13379|4.13279|50|2"
   echo $i
   sleep .5
done
