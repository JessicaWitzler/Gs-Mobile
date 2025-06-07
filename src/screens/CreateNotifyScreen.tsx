import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import EventList from '../components/EventList';
import TimeSlotList from '../components/TimeSlotList';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateNotifyScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateNotify'>;
};

interface Notify {
  id: string;
  clientId: string;
  clientName: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  cep: string;
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Event {
  id: string;
  name: string;
  image: string;
}

const availableEvents: Event[] = [
  {
    id: '1',
    name: 'Tempestade',
    image: 'https://metsul.com/wp-content/uploads/2022/09/temporal2609b-scaled.jpg',
  },
  {
    id: '2',
    name: 'Sobrecarga de Rede',
    image: 'https://agoranovale.com.br/wp-content/uploads/2023/11/energia_eletrica-postes-redes-marcelo_casal-Agencia-brasil-agoranovale.webp',
  },
  {
    id: '3',
    name: 'Queda de Árvore',
    image: 'https://www.ambientelegal.com.br/wp-content/uploads/%C3%A1rvores1.jpeg',
  },
];

const CreateNotifyScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CreateNotifyScreenProps['navigation']>();
  const [date, setDate] = useState('');
  const [cep, setCep] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateNotify = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !cep || !selectedTime || !selectedEvent) {
        setError('Por favor, preencha a data, CEP, selecione um evento e horário');
        return;
      }

      const storedNotifys = await AsyncStorage.getItem('@EventsApp:notifys');
      const notifys: Notify[] = storedNotifys ? JSON.parse(storedNotifys) : [];

      const newNotify: Notify = {
        id: Date.now().toString(),
        clientId: user?.id || '',
        clientName: user?.name || '',
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        date,
        time: selectedTime,
        cep,
        description,
        status: 'pending',
      };

      notifys.push(newNotify);
      await AsyncStorage.setItem('@EventsApp:notifys', JSON.stringify(notifys));

      alert('Evento registrado com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao registrar evento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Registrar Evento</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <Input
          placeholder="CEP (somente números)"
          value={cep}
          onChangeText={setCep}
          containerStyle={styles.input}
          keyboardType="numeric"
          maxLength={8}
        />

        <Input
          placeholder="Descrição do problema"
          value={description}
          onChangeText={setDescription}
          containerStyle={styles.input}
          multiline
          numberOfLines={3}
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Evento</SectionTitle>
        <EventList
          events={availableEvents}
          onSelectEvent={setSelectedEvent}
          selectedEventId={selectedEvent?.id}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Registrar"
          onPress={handleCreateNotify}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateNotifyScreen;
