import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		mapsReady: false,
	}
});

window.initMap = function ready() {
	app.$set({ mapsReady : true });
}

export default app;