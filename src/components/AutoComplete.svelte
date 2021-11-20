
<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { select_multiple_value } from 'svelte/internal';

	const dispatch = createEventDispatcher();
    
    export let place;
    export let classes;
    export let error;
    let addressInput;
    let autocomplete;
    
    
    

    onMount(async () => {
        initialize();
    });

    function initialize () {

        const options = {
            fields: ["formatted_address", "address_components","geometry"],
            strictBounds: false,
            types: ["address"],
        };

        autocomplete = new google.maps.places.Autocomplete(addressInput, options);
        autocomplete.setComponentRestrictions({
                country: ["ca"],
        });

        autocomplete.addListener("place_changed", () => {
            
            place = autocomplete.getPlace();

            //If we can find the place lets go to it
			if (typeof place.address_components !== "undefined") {
				// reset hasDownBeenPressed in case they don't unfocus
                addressChanged();
            } else {
                emitError("Please select an address from the dropdown. Don't use the 'Enter' key.");
                
            }
            
            
        });

        

    }
   

    function addressChanged() {
        const component_array = place.address_components;
        place.components= {};

        for (let i = 0; i < component_array.length; i++) {
            switch (component_array[i].types[0]) {
                case "street_number":
                    place.components['number'] = component_array[i].short_name;
                    break
                case "route":
                    place.components['street'] = component_array[i].short_name;
                    break
                case "locality":
                    place.components['city'] = component_array[i].short_name;
                    break
                case "administrative_area_level_1":
                    place.components['province'] = component_array[i].short_name;
                    break
                case "country":
                    place.components['country'] = component_array[i].long_name;
                    break
                case "postal_code":
                    place.components['postal'] = component_array[i].short_name.split(" ").join("");
                    break
                default:
                    break
                }   
            delete place.address_components;

        }

        addressInput.value = place.formatted_address;
        
		dispatch('address-changed', {
			place : place
        })
	}

    function emitError(message) {
        dispatch('error', {
			message: message
        })
    }

</script>


<input 
    type="text" 
    bind:this={addressInput} 
    onClick="this.select()"
    placeholder="Start typing an address..." 
    class={classes}
>