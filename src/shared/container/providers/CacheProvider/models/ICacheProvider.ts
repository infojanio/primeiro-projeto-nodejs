export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>; // salvar
  recover<T>(key: string): Promise<T | null>; // recuperar, retornar
  invalidate(key: string): Promise<void>; //

  invalidatePrefix(prefix: string): Promise<void>; // inválida todos os cache que começam com texto
}
