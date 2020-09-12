import IMailTemplateProvider from '../models/IMailTemplateProvider';

// serve como teste, só retorna o texto, só p/ passar no teste
class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content';
  }
}
export default FakeMailTemplateProvider;
