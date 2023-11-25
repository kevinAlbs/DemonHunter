"""
After a goofed MySQL upgrade, data was restored to `demon_hunter.scores` by reading contents of the `.ibd` file.
"""
import struct
from datetime import datetime

with open("scores.ibd", "rb") as file:
    contents = file.read()

# Inspecting with a hex editor, the first score appears to be at index 0x00010090
idx = 0x00010090

entries = []
# Read characters until a zero byte. The zero byte may be part of the next big-endian int32.
while idx < len(contents):
    name = bytearray()
    while True:
        name.append(contents[idx])
        idx += 1
        if contents[idx] == 0:
            break
    name = name.decode("utf8")

    # Read score.
    score = struct.unpack(">i", contents[idx:idx+4])[0]
    idx += 4

    # Read timestamp.
    timestamp = struct.unpack(">i", contents[idx:idx+4])[0]
    idx += 4

    if timestamp == 0:
        # We have gone too far.
        break

    print("Read: name='{}' score={} timestamp={} ({})".format(name, score, timestamp, datetime.fromtimestamp(timestamp)))
    entries.append({
        "name": name,
        "score": score,
        "timestamp": timestamp
    })
    idx += 24


print ("Dumping SQL statements")
for entry in entries:
    print ("INSERT INTO scores (name, score, date) VALUES('{}', {}, FROM_UNIXTIME({}));".format(entry["name"], entry["score"], entry["timestamp"]))