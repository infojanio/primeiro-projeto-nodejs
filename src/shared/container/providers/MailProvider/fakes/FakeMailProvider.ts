import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

// envio de email Fake
export default class FakeMailProvider implements IMailProvider {
  private messages: IMessage[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
