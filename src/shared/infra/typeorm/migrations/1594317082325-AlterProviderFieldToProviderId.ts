import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1594317082325
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    // criação da chave estrangeira
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Se o usuário for deletado, todos os agendamentos ficarão null
        onUpdate: 'CASCADE', // Se o id do usuário for alterado, vai refletir em todos os relacionamentos, agendamentos
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider'); // desfaz a criação da chave estrangeira
    await queryRunner.dropColumn('appointments', 'provider_id'); // desfaz a criação do provider_id

    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        // desfaz a alteraçao do campo provider
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
