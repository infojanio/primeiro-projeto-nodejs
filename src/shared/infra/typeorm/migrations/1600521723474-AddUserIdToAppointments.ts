import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1600521723474
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true, // permite null, pois assim quando usuário excluir a conta seu historico continua salvo
      }),
    );
    // criação da chave estrangeira
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL', // Se o usuário for deletado, todos os agendamentos ficarão null
        onUpdate: 'CASCADE', // Se o id do usuário for alterado, vai refletir em todos os relacionamentos, agendamentos
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider'); // desfaz a criação da chave estrangeira
    await queryRunner.dropColumn('appointments', 'user_id'); // desfaz a criação do provider_id
  }
}
