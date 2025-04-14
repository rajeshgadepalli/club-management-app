import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HelperText } from 'react-native-paper';

interface CustomDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, onChange, options, error }) => {
    return (
        <View>
            <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label={label} value="" enabled={false} />
                {options.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
            </Picker>
            {error && <HelperText type="error">{error}</HelperText>}
        </View>
    );
};

export default CustomDropdown;