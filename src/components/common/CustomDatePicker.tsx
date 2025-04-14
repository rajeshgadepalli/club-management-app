import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
}

const DatePickerInput = ({
  label,
  value,
  onChange,
  error,
}: DatePickerInputProps) => {
  const [show, setShow] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <Button
        mode="outlined"
        onPress={() => setShow(true)}
      >
        {label}: {value && value instanceof Date ? value.toLocaleDateString() : 'Select date'}
      </Button>

      {error && <HelperText type="error">{error}</HelperText>}

      {show && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="date"
          onChange={onDateChange}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      )}
    </View>
  );
};

export default DatePickerInput;
