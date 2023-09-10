import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

class AI {
	private configuration: any;
	private ai: any;
	public constructor() {
		this.configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.ai = new OpenAIApi(this.configuration);
	}

	public async downloadImage(url:string):Promise<Buffer> {
		const image = await axios({
			method: 'GET',
			url,
			responseType: 'arraybuffer',
		});

		const imageData = Buffer.from(image.data, 'binary');
		return imageData;
	}

	public async getImageFromPrompt(prompt:string):Promise<Buffer> {
		try {
			const image = await this.ai.createImage({
				prompt,
				n: 1,
				size: "1024x1024",
			});
			return this.downloadImage(image.data.data[0].url);
		} catch(err:any) {
			if (err.response) {
				console.log(err.response.status);
				console.log(err.response.data);
			  } else {
				console.log(err.message);
			}
			throw new Error(err);
			
		}
	}
}

export default AI;