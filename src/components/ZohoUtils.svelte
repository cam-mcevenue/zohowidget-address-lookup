<script>

    import { onMount, createEventDispatcher } from 'svelte';

    let entityId;
    let entityType;
    let trigger;
    let config;
    let response;

    const dispatch = createEventDispatcher();

    

    onMount(async () => {
        ZOHO.embeddedApp.init();
    });

    ZOHO.embeddedApp.on("PageLoad", function(data) {

        ZOHO.CRM.UI.Resize({height: 440, width: 1024});
        
        //add data to config object
        if ((typeof data.EntityId) === 'object'){
            entityId = data.EntityId[0];
            trigger = "button";
        } else {
            entityId = data.EntityId;
            trigger = "blueprint";
        }
    
        entityType = data.Entity;

        dispatch('zoho-ready', {trigger : trigger});
        
    });
    
    export async function updateZohoRecord (place_components) {
        
        if (entityType == "Deals") {
            config = {
                Entity: entityType,
                APIData:{
                    "id": entityId,
                    "Street_Address" : place_components.number + " " + place_components.street,
                    "City" : place_components.city,
                    "Province" : place_components.province,
                    "Postal_Code" : place_components.postal,
                    "Country" : place_components.country,
                    "Unit": place_components.unit
                }
            }
        } 

        if (entityType == "Contacts") {
            config = {
                Entity: entityType,
                APIData:{
                    "id": entityId,
                    "Mailing_Street" : place_components.number + " " + place_components.street,
                    "Mailing_City" : place_components.city,
                    "Mailing_State" : place_components.province,
                    "Mailing_Zip" : place_components.postal,
                    "Mailing_Country" : place_components.country,
                    "Mailing_Unit_Number": place_components.unit
                }
            }
        } 
        
        response = await ZOHO.CRM.API.updateRecord(config);
        let code = response.data[0].code;
        console.log(code);
        let data = {};
        data.trigger = trigger;
        if (response.data[0].code === "SUCCESS") {
            data.message = `The address for this ${entityType.slice(0, -1)} was updated successfully`
            data.code = 'success'
        } else {
            data.message = `The address for this ${entityType.slice(0, -1)} couldn't be updated. If this error continues talk to Cam.`;
            data.code = 'error'
        }
        
        dispatch('zoho-response', data)
        
    }
</script>

<svelte:head>

</svelte:head>