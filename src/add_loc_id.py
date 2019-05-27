import ast


with open('data/locations.json', 'r') as f1:
    locations = f1.read().split(';')
locations = [ast.literal_eval(location.strip()) for location in locations]
ids = [l['_id'] for l in locations]

with open('data/locations.csv', 'r') as f2:
    old_loc = [line.strip() for line in f2]

new_loc = []
for i in range(40):
    new_loc.append(old_loc[i]+ ',' + ids[i])

with open('data/new_locations.csv', 'w') as f3:
    for loc in new_loc:
        f3.write(loc + '\n')
