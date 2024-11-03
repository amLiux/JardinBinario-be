import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { BlogEntry, NewsletterEntry, Ticket, User } from "../types/sharedTypes";

interface MailOptions {
  from: string;
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
}

export const notifyUserAboutForgotPassword = async (
  user: User,
  random: string
): Promise<boolean> => {
  const { email } = user;
  const mailOptions = {
    from: `"Jardín Binario" <jardinbinario@gmail.com>`,
    to: email,
    subject: "Solicitud para restablecer contraseña.",
    html: `
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
			`,
  };

  const sentInfo = await sendEmail(mailOptions);
  return sentInfo.accepted.length > 0;
};

export const notifyEndUsersAboutNewBlog = async (
  users: NewsletterEntry[],
  blog: BlogEntry
): Promise<void> => {
  const mailOptions = users.map(({ email }) => ({
    from: `"Jardín Binario" <jardinbinario@gmail.com>`,
    to: email,
    subject: `${blog.title}`,
    html: `
				Hola ${email},
				<br/><br/>
				Esperamos que estés muy bien.
				<br/><br/>
				Te interesa alguno de estos temas: <code>${blog.tags.join(", ")}</code>
				<br/><br/>
				Si tu respuesta es si, buenas noticias, acabamos de subir un blog muy interesante relacionado a los mismos.
				<br/><br/>
				<hr>
				${blog.sneakpeak}
				<hr>
				<br/><br/>
				Gracias,
				<br/>
				Jardín Binario.
			`,
  }));

  await Promise.all(mailOptions.map((mailOptions) => sendEmail(mailOptions)));
  //TODO maybe we can create a queue, and add the failing ones to queue and try to run later?
};

export const notifyUsersAboutNewTicket = async (
  users: User[],
  ticket: Ticket
): Promise<void> => {
  const mailOptions = users.map(({ email, name }) => ({
    from: `"Jardín Binario" <jardinbinario@gmail.com>`,
    to: email,
    priority: "high",
    subject: "Nuevo tiquete",
    html: `
				Hola ${name},
				<br/><br/>
				Esperamos que estés muy bien.
				<br/><br/>
				${
          ticket.companyName
        } acaba de crear un tiquete buscando los siguientes servicios: ${ticket.service.join(
      ", "
    )}
				<br/><br/>

				Y dice lo siguiente:
				${ticket.description}

				Gracias,
				<br/>
				Jardín Binario.
			`,
  }));

  await Promise.all(mailOptions.map((mailOptions) => sendEmail(mailOptions)));
  //TODO maybe we can create a queue, and add the failing ones to queue and try to run later?
};

export const sendEmail = async (
  mailOptions: MailOptions
): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PWD,
    },
  });

  return await transporter.sendMail(mailOptions);
};
