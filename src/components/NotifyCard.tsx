import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { Card, Text, Avatar } from '@rneui/themed';
import theme from '../styles/theme';

interface NotifyCardProps {
  eventName: string;
  description?: string;
  date: string;
  time: string;
  cep: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  onPress?: () => void;
  style?: ViewStyle;
}

const NotifyCard: React.FC<NotifyCardProps> = ({
  eventName,
  description,
  date,
  time,
  cep,
  status,
  onPress,
  style,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card containerStyle={[styles.card, style]} onPress={onPress}>
      <EventInfo>
        <Avatar
          size="medium"
          rounded
          source={{
            uri: `https://randomuser.me/api/portraits/men/${Math.floor(
              Math.random() * 10
            )}.jpg`,
          }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <EventName>{eventName}</EventName>
          {description ? <Description>{description}</Description> : null}
        </TextContainer>
      </EventInfo>

      <NotifyInfo>
        <InfoRow>
          <InfoLabel>Data:</InfoLabel>
          <InfoValue>{date}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Horário:</InfoLabel>
          <InfoValue>{time}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>CEP:</InfoLabel>
          <InfoValue>{cep}</InfoValue>
        </InfoRow>
      </NotifyInfo>

      <StatusContainer>
        <StatusDot color={getStatusColor()} />
        <Text style={{ color: getStatusColor() }}>
          {status === 'confirmed'
            ? 'Resolvido'
            : status === 'cancelled'
            ? 'Não Resolvido'
            : 'Pendente'}
        </Text>
      </StatusContainer>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const EventInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const TextContainer = styled.View`
  margin-left: 15px;
`;

const EventName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

const NotifyInfo = styled.View`
  margin-bottom: 15px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

export default NotifyCard;
