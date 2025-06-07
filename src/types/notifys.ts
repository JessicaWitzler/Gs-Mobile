/**
 * Representa um registro de evento climático
 * @property id - Identificador único do evento
 * @property eventId - ID do evento 
 * @property date - Data do evento no formato YYYY-MM-DD
 * @property time - Horário do evento no formato HH:mm
 * @property description - Descrição ou motivo do evento
 * @property status - Status atual do evento (resolvido, pendente, não resolvido)
 */
export type Notify = {
    id: string;
    eventId: string;
    date: string;
    time: string;
    status: string;
    description: string;
  };