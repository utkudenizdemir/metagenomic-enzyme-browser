"use client";
import { Loader } from "@googlemaps/js-api-loader";
import { info } from "console";
import { useEffect, useRef } from "react";
import { MapData } from "../types/gen.s";
function Maps({ locations = [], link = null, height="24rem" }: { locations: MapData[] , link?: string | null, height?: string}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapInit = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = (await loader.importLibrary("maps")) as {
        Map: typeof google.maps.Map;
      };

      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

      const mapOptions: google.maps.MapOptions = {
        zoom: 5,
        mapId: "biome1",
        disableDefaultUI: true,
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const infoWindow = new google.maps.InfoWindow({
        minWidth: 300,
        maxWidth: 300,
      });

      const bounds = new google.maps.LatLngBounds();
      let sample_count =0

      locations.forEach((markerData: MapData) => {
        sample_count += 1
        console.log(sample_count);
        const pin = new PinElement({
          // glyph: mark,
          scale: 0.75,
        });
        // console.log(markerData);
        const marker = new AdvancedMarkerElement({

          position: {
            lat: markerData.location.lat,
            lng: markerData.location.lng,
          },
          map: map,
          title: markerData.sampleID,
          content: pin.element,
          gmpClickable: true,
        });

        marker.addListener(
          "click",
          ({
            domEvent,
            latLng,
          }: {
            domEvent: google.maps.MapMouseEvent["domEvent"];
            latLng: google.maps.LatLng;
          }) => {
            const { target } = domEvent;
            const infoWindowContent =(` 
                <div class="w-full h-fit">
                <h1 class="text-lg font-bold">Sample ID: <a href="${link? link :`/study/${markerData.studyID}` }/sample/${markerData.sampleNumID}">${markerData.sampleID} </a> </h1>
                <p> ${markerData.location.region}</p>
                </div>`)
            
            infoWindow.close();
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);
          }
        );

        bounds.extend(
          new google.maps.LatLng(
            markerData.location.lat,
            markerData.location.lng
          )
        );
       
      });

    if (locations.length > 1) { 
      map.fitBounds(bounds);
    } else if (locations.length <= 1) {
      console.log("less than 1");
      map.setCenter(new google.maps.LatLng(locations[0].location.lat, locations[0].location.lng));
      map.setZoom(6);
    }
    };

    mapInit();
  }, []);

  return <div style={{ height }} className="w-full"  ref={mapRef}></div>;
}

export default Maps;