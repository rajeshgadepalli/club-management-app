import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TextInput, List } from 'react-native-paper';
import { debounce } from 'lodash';
import FullScreenModal from '../FullScreenModal';
import LoadingScreen from '../LoadingScreen';
import ErrorMessage from '../ErrorMessage';
import { EntityLookupProps } from './types';
import { SPACING } from '@/theme';

function EntityLookup<T>({
  searchFn,
  onSelect,
  displayFields,
  placeholder = 'Search...',
  visible,
  onClose,
  renderItem
}: EntityLookupProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchFn(searchQuery);
        setResults(data);
      } catch (err: any) {
        setError(err.message || 'Failed to search');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [searchFn]
  );

  const handleSelect = (item: T) => {
    onSelect(item);
    onClose();
  };

  return (
    <FullScreenModal visible={visible} onClose={onClose} title="Select User">
      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          handleSearch(text);
        }}
        mode="outlined"
        style={styles.searchInput}
        autoFocus
        right={
          query ? (
            <TextInput.Icon
              icon="close"
              onPress={() => {
                setQuery('');
                setResults([]);
              }}
            />
          ) : undefined
        }
      />

      {error ? (
        <ErrorMessage message={error} />
      ) : loading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => {
            const keyField = displayFields?.[0]?.key as keyof T;
            const keyValue = keyField ? String(item[keyField] ?? '') : String(index);
            return `${index}-${keyValue}`;
          }}
          renderItem={({ item }) => {
            if (renderItem) return renderItem(item);

            const titleKey = displayFields?.[0]?.key;
            const descriptionKey = displayFields?.[1]?.key;

            return (
              <List.Item
                title={titleKey ? String(item[titleKey] ?? '') : ''}
                description={descriptionKey ? String(item[descriptionKey] ?? '') : undefined}
                onPress={() => handleSelect(item)}
              />
            );
          }}

          contentContainerStyle={styles.list}
        />
      )}
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: SPACING.sm,
  },
  list: {
    flexGrow: 1,
  },
});

export default EntityLookup;
