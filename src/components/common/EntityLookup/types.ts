export interface DisplayField<T> {
  key: keyof T;
  label: string;
}

export interface EntityLookupProps<T> {
  searchFn: (query: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  displayFields?: { key: keyof T; label?: string }[]; // optional
  placeholder?: string;
  visible: boolean;
  onClose: () => void;
  renderItem?: (item: T) => React.ReactElement | null;
}

export interface SelectedEntityCardProps<T> {
  value: T | null;
  onClear: () => void;
  entityType: string;
  displayFields: DisplayField<T>[];
  onPress: () => void;
}
