import json
import os
import requests


class BreezometerAPI():
    def __init__(self, key):
        self.key = key

    def make_get_request(self, endpoint, lon, lat):
        url = endpoint.format(lon, lat, self.key)
        r = requests.get(url)
        return r.json()

    def get_air_quality_data(self, lat, lon):
        endpoint = 'https://api.breezometer.com/air-quality/v2/current-conditions?lat={}&lon={}&key={}'
        return self.make_get_request(endpoint, lat, lon)

    def get_pollen_data(self, lat, lon):
        endpoint = 'https://api.breezometer.com/pollen/v2/current-conditions?lat={}&lon={}&key={}'
        return self.make_get_request(endpoint, lat, lon)

    def get_weather_data(self, lat, lon):
        endpoint = 'https://api.breezometer.com/weather/v1/forecast/hourly?lat={}&lon={}&key={}&hours=3'
        return self.make_get_request(endpoint, lat, lon)

    def get_all_data(self, lat, lon):
        air = self.get_air_quality_data(lat, lon)
        pollen = self.get_pollen_data(lat, lon)
        weather = self.get_weather_data(lat, lon)
        return air, pollen, weather


def add_location_id(ds, location_id):
    for d in ds:
        d['location'] = location_id


if __name__ == '__main__':
    api_key = '...'
    locations_file = 'data/locations.csv'
    meter = BreezometerAPI(api_key)
    with open(locations_file, 'r') as f:
        locations = [line.strip().split(',') for line in f]

    air_data, pollen_data, weather_data = [], [], []

    for l in locations:
        city, lat, lon, country, location_id = l[0], l[1], l[2], l[3], l[4]
        print(city)
        air, pollen, weather = meter.get_all_data(lat, lon)
        add_location_id([air, pollen, weather], location_id)
        air_data.append(air)
        pollen_data.append(pollen)
        weather_data.append(weather)

    with open('data/air2.json', 'w') as f1:
        for a in air_data:
            json.dump(a, f1)
            f1.write('\n')

    with open('data/pollen2.json', 'w') as f2:
        for p in pollen_data:
            json.dump(p, f2)
            f2.write('\n')

    with open('data/weather2.json', 'w') as f3:
        for w in weather_data:
            json.dump(w, f3)
            f3.write('\n')
