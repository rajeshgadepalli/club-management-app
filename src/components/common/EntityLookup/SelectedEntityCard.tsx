import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { COLORS, SPACING } from '@/theme';
import { SelectedEntityCardProps } from './types';

function SelectedEntityCard<T>({
  value,
  onClear,
  entityType,
  displayFields,
  onPress,
}: SelectedEntityCardProps<T>) {
  if (!value) {
    return (
      <Card style={styles.card} onPress={onPress}>
        <Card.Content style={styles.selectContent}>
          <Text variant="bodyLarge" style={styles.selectText}>
            Select {entityType}
          </Text>
          <IconButton icon="chevron-right" size={24} />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.fields}>
            {displayFields.map(({ key, label }) => (
              <View key={String(key)} style={styles.field}>
                <Text variant="bodySmall" style={styles.label}>
                  {label}
                </Text>
                <Text variant="bodyLarge">
                  {String(value[key])}
                </Text>
              </View>
            ))}
          </View>
          <IconButton
            icon="close"
            onPress={onClear}
            style={styles.clearButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fields: {
    flex: 1,
  },
  field: {
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  clearButton: {
    margin: -8,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  selectText: {
    color: COLORS.primary,
  },
});

export default SelectedEntityCard;
