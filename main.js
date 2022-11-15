import './style.css'

const fetchBtn = document.getElementById("fetchBtn")
const anno = document.getElementById("anno")

//impostare la mappa
const map = L.map('map').setView([51.505, -0.09], 3)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

var markers = []
var podium = []

var icona = L.icon({
    iconUrl: 'checkered-flag.png',
    iconSize: [40, 40],
    iconAnchor: [0, 40],
    popupAnchor: [20, -30],
});

//premere bottone -> {icon: icona}
fetchBtn.onclick = () => {
  for (var m of markers){
    map.removeLayer(m)
  }
  for(let i=1;i!=25;i++){
    fetch(`https://ergast.com/api/f1/${anno.value}/${i}/results.json`).then(r => r.json())
      .then(body => {
        const {MRData} = body
        const {total} = MRData

        if (total != 0){
          const {RaceTable} = MRData
          const {Races} = RaceTable
          const {raceName,Circuit,round,date,Results} = Races[0]
          const {Location,circuitName} = Circuit

          podium = []

          for (let i=0;i<3;i++){
            const {Driver,Constructor} = Results[i]
            const {givenName,familyName} = Driver
            const {name} = Constructor
            podium.push(givenName + " " + familyName + " (" + name + ")")
          }

          //aggiunta marker
          var marker = L.marker([Location.lat, Location.long], {icon: icona}).addTo(map).bindPopup("<B>" + raceName + "</B><br />" +
                                                                                                  "<strong>Round: </strong>" + round + "<br />" +
                                                                                                  "<strong>Circuit: </strong>" + circuitName + "<br />" +
                                                                                                  "<strong>Date: </strong>" + date + "<br />" +
                                                                                                  "<B>Podium:</B><br />" +
                                                                                                  "<strong>1°: </strong>" + podium[0] + "<br />" +
                                                                                                  "<strong>2°: </strong>" + podium[1] + "<br />" +
                                                                                                  "<strong>3°: </strong>" + podium[2] + "<br />"
                                                                                                  )
                                                                                                  
          map.addLayer(marker)
          markers.push(marker)
        }   
      })
  }
}