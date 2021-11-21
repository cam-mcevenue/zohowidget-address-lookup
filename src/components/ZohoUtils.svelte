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

        ZOHO.CRM.UI.Resize({height: 440, width: 1350});
        
        //add data to config object
        if ((typeof data.EntityId) === 'object'){
            entityId = data.EntityId[0];
            trigger = "button";
        } else {
            entityId = data.EntityId;
            trigger = "blueprint";
        }
    
        entityType = data.Entity;
        
    });
    
    export async function updateZohoRecord (props) {
        
        if (entityType == "Deals") {
            config = {
                Entity: entityType,
                APIData:{
                    "id": entityId,
                    "Street_Address" : place.components.number + " " + place.components.street,
                    "City" : props.city,
                    "Province" : props.province,
                    "Postal_Code" : props.postal,
                    "Country" : props.country,
                    "Unit": props.unit
                }
            }
        } 

        if (entityType == "Contacts") {
            config = {
                Entity: entityType,
                APIData:{
                    "id": entityId,
                    "Mailing_Street" : props.number + " " + props.street,
                    "Mailing_City" : props.city,
                    "Mailing_State" : props.province,
                    "Mailing_Zip" : props.postal,
                    "Mailing_Country" : props.country,
                    "Mailing_Unit_Number": props.unit
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