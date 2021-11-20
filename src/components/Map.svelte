<script>

    import { onMount } from 'svelte';
    let container;
    let mapConfig = {
        zoom : 12,
        center : {lat: 43.653226, lng: -79.383184},
        mapTypeControl : false,
        fullscreenControl : false,
        streetViewControl : false,

    };
    let map;
    let marker;

    export const updateMarker = function (location) {
        if (!marker.visible){
            marker.setVisible(true);
        } 
        marker.setPosition(location);
        map.panTo(location);
        map.setZoom(15);

    }
   
    onMount(async () => {
        map = new google.maps.Map(container, mapConfig);
        marker = new google.maps.Marker({
            visible: false,
            map: map
        });
    });


</script>

<style>
.fill-container {
   width: 100%;
   height: 100%;
}
</style>

<div class="fill-container" bind:this={container}></div>