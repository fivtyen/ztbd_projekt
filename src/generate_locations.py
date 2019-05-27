import json 

with open('data/locations.json', 'w') as f1:
    with open('data/locations.csv', 'r') as f2:
        for line in f2:
            line = line.strip().split(',')
            location = {'city':line[0],
                        'country':line[3],
                        'lat':line[1],
                        'lon':line[2]}
            json.dump(location, f1)
            f1.write('\n')
            
