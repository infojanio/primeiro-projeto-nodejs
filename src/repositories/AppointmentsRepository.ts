import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository <Appointment> { 
    
    //Encontra um agendamento em data específica 
    public async findByDate (date: Date): Promise <Appointment | null> {
        // //verificar se horário está disponível, se já tem o mesmo horário marcado
         const findAppointment = await this.findOne({
         where: { date }, //encontra os agendamentos where data, caso já exista retornará null
         });    
         
        return findAppointment || null;
        }    
    }
    export default AppointmentsRepository;