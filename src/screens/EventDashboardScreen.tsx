import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
type EventDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventDashboard'>;
};
 
interface Notify {
  id: string;
  clientId: string;
  clientName: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
 
interface StyledProps {
  status: string;
}
 
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};
 
const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Resolvido';
    case 'cancelled':
      return 'Não Resolvido';
    default:
      return 'Pendente';
  }
};
 
const EventDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<EventDashboardScreenProps['navigation']>();
  const [notifys, setNotifys] = useState<Notify[]>([]);
  const [loading, setLoading] = useState(true);
 
  const loadNotifys = async () => {
    try {
      const storedNotifys = await AsyncStorage.getItem('@EventsApp:notifys');
      if (storedNotifys) {
        const allNotifys: Notify[] = JSON.parse(storedNotifys);
        const eventNotifys = allNotifys.filter(
          (notify) => notify.eventId === user?.id
        );
        setNotifys(eventNotifys);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleUpdateStatus = async (notifyId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const storedNotifys = await AsyncStorage.getItem('@EventsApp:notifys');
      if (storedNotifys) {
        const allNotifys: Notify[] = JSON.parse(storedNotifys);
        const updatedNotifys = allNotifys.map(notify => {
          if (notify.id === notifyId) {
            return { ...notify, status: newStatus };
          }
          return notify;
        });
        await AsyncStorage.setItem('@EventsApp:notifys', JSON.stringify(updatedNotifys));
        loadNotifys();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };
 
  useFocusEffect(
    React.useCallback(() => {
      loadNotifys();
    }, [])
  );
 
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meus Registros</Title>
 
        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />
 
        {loading ? (
          <LoadingText>Carregando registros...</LoadingText>
        ) : notifys.length === 0 ? (
          <EmptyText>Nenhum evento registrado</EmptyText>
        ) : (
          notifys.map((notify) => (
            <NotifyCard key={notify.id}>
              <ListItem.Content>
              <ListItem.Title style={styles.clientName as TextStyle}>
                Usuário: {notify.clientName || 'Nome não disponível'}
              </ListItem.Title>
              <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                {notify.date} às {notify.time}
              </ListItem.Subtitle>
                <StatusBadge status={notify.status}>
                  <StatusText status={notify.status}>
                    {getStatusText(notify.status)}
                  </StatusText>
                </StatusBadge>
                {notify.status === 'pending' && (
                  <ButtonContainer>
                    <Button
                      title="Resolvido"
                      onPress={() => handleUpdateStatus(notify.id, 'confirmed')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.confirmButton}
                    />
                    <Button
                      title="Não Resolvido"
                      onPress={() => handleUpdateStatus(notify.id, 'cancelled')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.cancelButton}
                    />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </NotifyCard>
          ))
        )}
 
        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};
 
const styles = {
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 8,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
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
 
const NotifyCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;
 
const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;
 
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;
 
const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;
 
const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;
 
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;
 
export default EventDashboardScreen;