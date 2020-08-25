import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
/* Relacionamento entre tabelas
Um para um (OneToOne)
Um para muitos (OneToMany)
Muitos para muitos (ManyToMany)
*/
// atenção: como estamos dentro do Appointments, então a relação será ManyToOne

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string; // Relacionamento que pega o prestador pelo id

  @ManyToOne(() => User) // Muitos agendamentos para um prestador
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
