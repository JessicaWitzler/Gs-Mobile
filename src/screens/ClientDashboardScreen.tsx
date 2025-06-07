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

type ClientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ClientDashboard'>;
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

const ClientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<ClientDashboardScreenProps['navigation']>();
  const [notifys, setNotifys] = useState<Notify[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifys = async () => {
    try {
      const storedNotifys = await AsyncStorage.getItem('@EventsApp:notifys');
      if (storedNotifys) {
        const allNotifys: Notify[] = JSON.parse(storedNotifys);
        const userNotifys = allNotifys.filter(
          (notify) => notify.clientId === user?.id
        );
        setNotifys(userNotifys);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
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
        <Title>Recomendações</Title>

        <RecommendationBox>
          É muito importante que, em caso de chuvas fortes, todos fiquem em suas casas para se protegerem. Caso precisem de ajuda, procurar informar pelo aplicativo a falta de energia.
        </RecommendationBox>

        <Button
          title="Registrar novo Evento"
          onPress={() => navigation.navigate('CreateNotify')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

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
                  Usuário: {notify.clientName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {notify.date} às {notify.time}
                </ListItem.Subtitle>
                <Text style={styles.eventName as TextStyle}>
                  {notify.eventName}
                </Text>
                <StatusBadge status={notify.status}>
                  <StatusText status={notify.status}>
                    {getStatusText(notify.status)}
                  </StatusText>
                </StatusBadge>
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
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
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

const RecommendationBox = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  background-color: ${theme.colors.surface};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  line-height: 22px;
  border: 1px solid ${theme.colors.border};
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

export default ClientDashboardScreen;
