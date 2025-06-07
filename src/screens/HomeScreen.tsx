import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notify } from '../types/notifys';
import { Event } from '../types/events';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const events: Event[] = [
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

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [notifys, setNotifys] = useState<Notify[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifys = async () => {
    try {
      const storedNotifys = await AsyncStorage.getItem('notifys');
      if (storedNotifys) {
        setNotifys(JSON.parse(storedNotifys));
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotifys();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifys();
    setRefreshing(false);
  };

  const getEventInfo = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  const renderNotify = ({ item }: { item: Notify }) => {
    const event = getEventInfo(item.eventId);
    
    return (
      <NotifyCard>
        <EventImage source={{ uri: event?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <EventName>{event?.name || 'Evento não encontrado'}</EventName>
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Resolvido'}
          </Status>
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </NotifyCard>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Meus Registros</HeaderTitle>
      </HeaderContainer>

      <Content>
        <Button
          title="Registrar novo Evento"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateNotify')}
        />

        <NotifyList
          data={notifys}
          keyExtractor={(item: Notify) => item.id}
          renderItem={renderNotify}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhum evento registrado</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

const NotifyList = styled(FlatList)`
  flex: 1;
`;

const NotifyCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const EventImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const EventName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

export default HomeScreen;