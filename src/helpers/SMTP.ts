import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { User } from '../types/sharedTypes';

interface MailOptions {
	from: string;
	to: string | string[];
	bcc?: string | string[];
	subject: string;
	html: string;
}

export const notifyUserAboutForgotPassword = async (user: User, random:string): Promise<boolean> => {
	const { email } = user;
	const mailOptions = {
		from: `"Jardín Binario" <jardinbinario@gmail.com>`,
		to: email,
		subject: 'Solicitud para restablecer contraseña.',
		html:
			`
				Hola ${user.name},
				<br/><br/>
				Esperamos que estés muy bien.
				<br/><br/>
				Hemos recibido una solicitud para reiniciar su contraseña.
				Su token para reiniciar la contraseña es <b>${random}</b>. 
				<br/><br/>

				Gracias,
				<br/>
				Jardín Binario.
			`
	};

	const sentInfo = await sendEmail(mailOptions);
	return sentInfo.accepted.length > 0;
}

export const sendEmail = async (mailOptions: MailOptions): Promise<SMTPTransport.SentMessageInfo> => {
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT,
			pass: process.env.GMAIL_PWD
		}
	});

	
	return await transporter.sendMail(mailOptions);
}