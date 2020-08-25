import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface Request {
    provider_id: string;
    date: Date; 
}

class CreateAppointmentService { //todo service possui um único método
//Toda vez que temos uma função async retornamos uma Promise
    public async execute({date, provider_id}: Request): Promise <Appointment> { //Recebimento de informações

        const appointmentsRepository = getCustomRepository(AppointmentsRepository); //Essa variável dará acesso a todos os métodos da classe
        
        const appointmentDate = startOfHour(date); //converte em horas inteiras, ex: 20:00:00 zera minuto e segundo

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
            ); //se tiver agendamento na mesma data
    
        if (findAppointmentInSameDate) { //Tratativa de erros
            throw new AppError ('O horário já foi agendado!'); //o service não usa request e response,  
        }
    
        const appointment = appointmentsRepository.create({ //cria uma instância 
            provider_id, 
            date: appointmentDate,
         });
         await appointmentsRepository.save(appointment); //salva no banco de dados

    return appointment;

    }
}
        export default CreateAppointmentService;