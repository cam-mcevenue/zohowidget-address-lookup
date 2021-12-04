<script>
	import 'bulma/css/bulma.css';
	import Map from './components/Map.svelte';
	import AutoComplete from './components/AutoComplete.svelte';
	import ZohoUtils from './components/ZohoUtils.svelte';
	import { fade } from 'svelte/transition';

	import { mapsAPIKey } from './js/key';
	import { Field, Button, Input } from 'svelma'

	export let mapsReady;

	let map;
	let place;
	let address;
	let unitNumber ='';
	let valid_address = true;
	let error_msg;
	let zohoUtils;
	let zohoResponse;
	let zohoContext;

	function handleAddressChange (event) {
		place = event.detail.place;
		address = place.formatted_address;
		valid_address = true;
		validateAddressInput();
		map.updateMarker(place.geometry.location);
	}

	function handleGoogleError(event) {
		valid_address = false;
		error_msg = event.detail.message;
		document.querySelector('.pac-input').classList.add('is-danger');
	}

	function validateAddressInput () {

		let input = document.querySelector('.pac-input');
		input.classList.remove('is-danger');
		error_msg = undefined;

		if (input.value.length > 0 && valid_address) {
			input.classList.add('is-success');
			valid_address = true;
			return true
		} else {
			input.classList.add('is-danger');
			error_msg = "Please enter a valid address";
			return false
		}	
		
	}

	function validateForm () {
		
		let form_valid = validateAddressInput();
		
		if (form_valid) {
			place.components.unit = unitNumber,
			zohoUtils.updateZohoRecord(place.components);
		}
		
	}

	function closeWidget() {
		ZOHO.CRM.UI.Popup.close();
	}

	function handleZohoResponse(event) {
		zohoResponse = event.detail;

		if (zohoResponse.code == 'error') {
			return
		} 

		if (zohoResponse.trigger == 'blueprint') {
			ZOHO.CRM.BLUEPRINT.proceed();
		}
	}

	function zohoReady (event) {
		if (event.detail.trigger === 'blueprint') {
			zohoContext = 'blueprint';
		}
	}

</script>

<svelte:head>
	<script defer async
		src="https://maps.googleapis.com/maps/api/js?key={mapsAPIKey}&callback=initMap&libraries=places&v=weekly">
	</script>
	<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</svelte:head>

<style>
	.is-height-100-p {
		height: 100%
	}
</style>

{#if mapsReady}
	<section class="section p-0" style="height: 100vh;">
		<div class="is-flex is-flex-direction-row is-height-100-p">
			<div class="column is-two-fifths is-flex is-flex-direction-column is-justify-content-center">
				{#if zohoContext === 'blueprint'}
					<h2 class="title is-4">Update the address for this deal:</h2>
				{/if}
				<div class="field">
					<label class="label">Unit # (optional)</label>
					<div class="control has-icons-left">
					  <input bind:value={unitNumber} class="input" type="text" placeholder="ex. 1107">
					  	<span class="icon is-small is-left">
							  <i class="fas fa-building"></i>
						</span>

					</div><!--control-->
				</div><!--field-->
				<div class="field">
					<label class="label">Address</label>
					<div class="control has-icons-left {error_msg != undefined ? 'has-icons-right' : '' }">
					  	<AutoComplete on:address-changed={handleAddressChange} on:error={handleGoogleError} classes="input pac-input" />
					  	<span class="icon is-small is-left">
							<i class="fas fa-search"></i>
				  		</span>
						{ #if error_msg != undefined } 
							<span class="icon is-small is-right">
								<i class="fas fa-exclamation-triangle has-text-danger"></i>
							</span>
							<p class="help is-danger">{error_msg}</p>
						{ /if }
					</div><!--control-->
				</div><!--field-->
				<div class="field is-grouped mt-4">
					<div class="control">
						<button class="button is-link" on:click={validateForm}>Save Address</button>
					</div><!--control-->
					<div class="control">
						<button on:click={closeWidget} class="button is-link is-light">Close</button>
					</div>
				</div><!--field-->
				{ #if zohoResponse != undefined } 
					<div transition:fade class="notification {zohoResponse.code === 'success' ? 'is-success' : 'is-danger'}">
						{zohoResponse.message}
					</div><!--notification-->
				{/if}
			</div><!--column-->
				
			<div class="column is-three-fifths p-0">
				<Map bind:this={map} />
			</div><!--column-->

		</div><!--is-flex-->
	</section>
{/if}

<ZohoUtils bind:this={zohoUtils} on:zoho-ready={zohoReady} on:zoho-response={handleZohoResponse} />



			


