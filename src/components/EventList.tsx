import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import theme from '../styles/theme';

interface Event {
  id: string;
  name: string;
  image: string;
}
interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  selectedEventId?: string;
  style?: ViewStyle;
}
const EventList: React.FC<EventListProps> = ({
  events,
  onSelectEvent,
  selectedEventId,
  style,
}) => {
  return (
    <Container style={style}>
      {events.map((event) => (
        <ListItem
          key={event.id}
          onPress={() => onSelectEvent(event)}
          containerStyle={[
            styles.listItem,
            selectedEventId === event.id && styles.selectedItem,
          ]}
        >
          <Avatar
            size="medium"
            rounded
            source={{ uri: event.image }}
            containerStyle={styles.avatar}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{event.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </Container>
  );
};
const styles = {
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
};
const Container = styled.View`
  margin-bottom: 15px;
`;
export default EventList;