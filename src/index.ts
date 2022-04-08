import { JardinBinarioServer } from "./JardinBinario";
import { ServerStatus } from "./types/sharedTypes";
const server = new JardinBinarioServer();

server.listen().then(({connected, message}:ServerStatus) => {
	if(!connected) {
		console.error(message);
		// TODO think in some basic logging structure
	}
	console.log(message);
});