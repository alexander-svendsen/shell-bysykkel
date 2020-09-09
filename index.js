#!/usr/bin/env node

const req = require('request');
const request = req.defaults({jar: true, followAllRedirects: true, followRedirect: true});


const options = {
    url: 'https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json',
    headers: {
        'Client-Identifier': 'nocompany-shellscript'
    }
};

const FyrstikkTorget = "543"
const KvernerByen = "447";


const idMap = {
    "447": {
        "name": "KværnerByen"
    },
    "543": {
        "name": "FyrstikkTorget"
    }
};

function correctStation(id){
    return idMap[id] !== undefined;
}


request.get(options,
    function(err,httpResponse,body){
        const json = JSON.parse(body)
        console.log("Bysykkler status: ")

        const structuredLogData = {}
        json["data"]["stations"]
            .forEach(station => {
                if (idMap[station.station_id] !== undefined){
                    const internalStationObject = idMap[station.station_id];

                    structuredLogData[`${internalStationObject.name}`] = {
                        "🚲": station["num_bikes_available"],
                        "🅿️": station["num_docks_available"]
                    }
                }
            })

        console.table(structuredLogData)

    });
