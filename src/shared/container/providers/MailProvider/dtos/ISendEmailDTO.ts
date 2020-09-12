import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendEmailDTO {
  to: IMailContact;
  from?: IMailContact; // o ? permite que envie o remetente da mensagem, ao invés do email padrão
  subject: string;
  templateData: IParseMailTemplateDTO;
}
