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
        config = {
            Entity: entityType,
            APIData:{
                "id": entityId,
                ...props
            }
        }

        console.log(config);
        
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